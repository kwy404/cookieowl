import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';
import { configFromScript } from '../src/browser';
import type { CookieOwl } from '../src/core';
import { $ } from './helpers';

const tag = (attrs: string) => {
  const d = document.createElement('div');
  d.innerHTML = `<script ${attrs}></script>`;
  return d.firstElementChild as HTMLScriptElement;
};

describe('configFromScript', () => {
  it('reads every data attribute', () => {
    expect(
      configFromScript(
        tag('data-lang="pt-BR" data-template="lgpd" data-layout="bar" data-position="top" data-theme="dark" data-dir="rtl" data-policy-url="/privacidade" data-version="3" data-storage="localStorage" data-container="#demo" data-categories="analytics, marketing chat" data-expires-days="180" data-consent-mode="advanced" data-auto-block data-gpc="false" data-dnt data-reopen="right"'),
      ),
    ).toEqual({
      lang: 'pt-BR',
      template: 'lgpd',
      layout: 'bar',
      position: 'top',
      theme: 'dark',
      dir: 'rtl',
      policyUrl: '/privacidade',
      version: '3',
      storage: 'localStorage',
      container: '#demo',
      categories: ['analytics', 'marketing', 'chat'],
      expiresDays: 180,
      consentMode: { advanced: true },
      autoBlock: true,
      respectGPC: false,
      respectDNT: true,
      reopenButton: 'right',
    });
  });

  it('reads flags, turned off flags and ignores empty values', () => {
    expect(configFromScript(tag('data-consent-mode data-auto-block="false" data-reopen="false" data-lang="" data-expires-days="x"'))).toEqual({
      consentMode: { advanced: false },
      autoBlock: false,
      reopenButton: false,
    });
    expect(configFromScript(tag('data-consent-mode="false" data-reopen'))).toEqual({ consentMode: false, reopenButton: true });
    expect(configFromScript(null)).toEqual({});
  });
});

describe('configFromScript for the generator', () => {
  it('reads the preset, the accent and text overrides', () => {
    expect(configFromScript(tag('data-preset="gdpr" data-accent="#2f6fed" data-text-title="Cookies?" data-text-accept-all="OK" data-text-reject-all="No, thanks" data-text-prefs-title=""'))).toEqual({
      preset: 'gdpr',
      accent: '#2f6fed',
      text: { title: 'Cookies?', acceptAll: 'OK', rejectAll: 'No, thanks' },
    });
  });

  it('does not take data-text alone or other attributes as texts', () => {
    expect(configFromScript(tag('data-text="x" data-textual data-title="x"'))).toEqual({});
  });
});

describe('script tag auto init', () => {
  it('starts the shared instance from window.cookieowlConfig and exposes the globals', async () => {
    vi.resetModules();
    const w = window as unknown as { cookieowlConfig?: unknown; cookieowl?: CookieOwl; CookieOwl?: { VERSION: string } };
    w.cookieowlConfig = { lang: 'es', storage: 'memory', consentMode: { waitForUpdate: 300 } };
    await import('../src/browser');
    expect(w.cookieowl!.lang).toBe('es');
    expect($('[data-cko=accept]')!.textContent).toBe('Aceptar todas');
    expect(w.CookieOwl!.VERSION).toBe('0.2.0');
    w.cookieowl!.destroy();
    delete w.cookieowlConfig;
  });
});

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'cookieowl.js');

describe.skipIf(!existsSync(dist))('dist/cookieowl.js in a page', () => {
  // Inlined in a page, so a closing script tag inside the bundle is escaped.
  const inline = () => readFileSync(dist, 'utf8').replace(/<\/script/gi, '<' + String.fromCharCode(92) + '/script');
  const page = (head: string, body = '') => {
    const code = inline();
    return new JSDOM(`<!doctype html><html lang="pt-BR"><head><script data-consent-mode data-auto-block data-policy-url="/privacidade">${code}</script>${head}</head><body>${body}</body></html>`, {
      url: 'https://loja.example.com.br/',
      runScripts: 'dangerously',
    });
  };

  it('blocks a tracker in head, shows the LGPD banner and releases on accept', async () => {
    const dom = page('<script async src="https://www.googletagmanager.com/gtag/js?id=G-1"></script>', '<script type="text/plain" data-cookieowl="analytics">document.body.dataset.ran = "yes"</script>');
    const { document: doc } = dom.window;
    await new Promise((r) => setTimeout(r, 20));
    const gtag = doc.querySelector('script[src*="gtag/js"]') as HTMLScriptElement;
    expect(gtag.type).toBe('text/plain');
    expect(doc.querySelector('.cko-title')!.textContent).toBe('Sua privacidade importa');
    expect(doc.querySelector('.cko-text p')!.textContent).toContain('LGPD');
    const dl = (dom.window as unknown as { dataLayer: IArguments[] }).dataLayer;
    expect([...dl[0]!].slice(0, 2)).toEqual(['consent', 'default']);
    (doc.querySelector('[data-cko=accept]') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 20));
    expect(doc.body.dataset.ran).toBe('yes');
    expect((doc.querySelector('script[src*="gtag/js"]') as HTMLScriptElement).type).toBe('');
    expect(doc.cookie).toContain('cookieowl=');
    const update = dl.filter((a) => !('event' in a)).map((a) => [...a]).find((a) => a[1] === 'update')!;
    expect(dl.at(-1)).toMatchObject({ event: 'cookieowl_consent' });
    expect(update[2]).toMatchObject({ analytics_storage: 'granted', ad_storage: 'granted' });
    (doc.querySelector('.cko-reopen') as HTMLButtonElement).click();
    expect(doc.querySelectorAll('.cko-sw:checked')).toHaveLength(3);
    dom.window.close();
  });

  it('skips init with data-manual', async () => {
    const code = inline();
    const dom = new JSDOM(`<!doctype html><head><script data-manual>${code}</script></head><body></body>`, { url: 'https://x.example/', runScripts: 'dangerously' });
    const w = dom.window as unknown as { cookieowl: CookieOwl };
    expect(dom.window.document.querySelector('.cko')).toBeNull();
    w.cookieowl.init({ lang: 'fr', storage: 'memory' });
    await new Promise((r) => setTimeout(r, 20));
    expect(dom.window.document.querySelector('[data-cko=reject]')!.textContent).toBe('Tout refuser');
    dom.window.close();
  });
});

describe('shared instance', () => {
  it('reuses window.cookieowl created by the script tag build', async () => {
    vi.resetModules();
    const w = window as unknown as { cookieowl?: unknown };
    const fake = { accepted: () => true, on: () => () => {} };
    w.cookieowl = fake;
    const mod = await import('../src/index');
    expect(mod.cookieowl).toBe(fake);
    delete w.cookieowl;
    vi.resetModules();
    const fresh = await import('../src/index');
    expect(fresh.cookieowl).not.toBe(fake);
  });
});
