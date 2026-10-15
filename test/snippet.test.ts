import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { configFromScript } from '../src/browser';
import { CDN_URL, initCode, scriptAttributes, scriptTag, snippetConfig, type SnippetOptions } from '../src/snippet';
import type { CookieOwlConfig } from '../src/types';
import { $, owl } from './helpers';

/** Parses a generated tag the way a browser does and reads it like the script tag build. */
const readTag = (html: string): CookieOwlConfig => {
  const d = document.createElement('div');
  d.innerHTML = html;
  const el = d.firstElementChild as HTMLScriptElement;
  expect(el.tagName).toBe('SCRIPT');
  expect(d.childNodes).toHaveLength(1);
  return configFromScript(el);
};

/** Runs the generated npm code against a fake cookieowl and returns what init received. */
const readInit = (code: string): CookieOwlConfig => {
  let got: CookieOwlConfig = {};
  const body = code.replace("import { cookieowl } from 'cookieowl';", '');
  new Function('cookieowl', body)({ init: (c: CookieOwlConfig = {}) => (got = c) });
  return got;
};

/** Basic Consent Mode is `true` in the npm code and `{ advanced: false }` from the tag. */
const sameAsInit = (c: CookieOwlConfig): CookieOwlConfig =>
  typeof c.consentMode === 'object' && !c.consentMode.advanced ? { ...c, consentMode: true } : c;

const CASES: SnippetOptions[] = [
  {},
  { preset: 'lgpd' },
  { preset: 'gdpr', policyUrl: '/privacy', accent: '#2f6fed' },
  { preset: 'lgpd', lang: 'auto', consentMode: false, autoBlock: false },
  { lang: 'en', template: 'lgpd', consentMode: 'advanced', autoBlock: true },
  { categories: [], layout: 'bar', position: 'top', theme: 'dark' },
  { categories: ['analytics', 'necessary', ' marketing '], reopenButton: 'right', respectGPC: false, respectDNT: true },
  { version: 3, expiresDays: 180, storage: 'localStorage', reopenButton: false },
  { text: { title: 'Cookies? "Yes" & <no>', acceptAll: "It's fine", rejectAll: '' } },
  { preset: 'gdpr', text: { description: 'Line one\nline two </script> back\\slash' } },
];

describe('snippetConfig', () => {
  it('leaves every default out', () => {
    expect(
      snippetConfig({
        lang: 'pt-BR',
        template: 'lgpd',
        version: 1,
        categories: ['preferences', 'analytics', 'marketing'],
        layout: 'box',
        position: 'bottom-right',
        theme: 'auto',
        consentMode: false,
        autoBlock: false,
        respectGPC: true,
        respectDNT: false,
        reopenButton: 'left',
        expiresDays: 365,
        storage: 'cookie',
        accent: ' ',
        policyUrl: '',
        text: { title: ' ' },
      }),
    ).toEqual({ lang: 'pt-BR' });
    expect(snippetConfig({ layout: 'bar', position: 'bottom' })).toEqual({ layout: 'bar' });
  });

  it('keeps what differs from the preset, including turning its features off', () => {
    expect(snippetConfig({ preset: 'lgpd', lang: 'pt-BR', template: 'lgpd', consentMode: true, autoBlock: true })).toEqual({ preset: 'lgpd' });
    expect(snippetConfig({ preset: 'lgpd', lang: 'auto', consentMode: false, autoBlock: false })).toEqual({
      preset: 'lgpd',
      lang: 'auto',
      consentMode: false,
      autoBlock: false,
    });
    expect(snippetConfig({ preset: 'gdpr', template: 'lgpd', consentMode: 'advanced' })).toEqual({
      preset: 'gdpr',
      template: 'lgpd',
      consentMode: { advanced: true },
    });
  });

  it('keeps a template that the language would not pick', () => {
    expect(snippetConfig({ lang: 'en', template: 'gdpr' })).toEqual({ lang: 'en' });
    expect(snippetConfig({ lang: 'en', template: 'lgpd' })).toEqual({ lang: 'en', template: 'lgpd' });
    expect(snippetConfig({ template: 'gdpr' })).toEqual({ template: 'gdpr' });
  });

  it('turns an empty category list into necessary only', () => {
    expect(snippetConfig({ categories: [] })).toEqual({ categories: ['necessary'] });
    const o = owl({ ...snippetConfig({ categories: [] }), storage: 'memory' });
    expect(o.categories().map((c) => c.id)).toEqual(['necessary']);
  });
});

describe('scriptTag', () => {
  it('is a single line, pinned to the CDN by default', () => {
    expect(scriptTag({})).toBe(`<script src="${CDN_URL}"></script>`);
    expect(CDN_URL).toBe('https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js');
    expect(scriptTag({ preset: 'lgpd', policyUrl: '/privacidade', accent: '#2f6fed' }, { src: '/js/cookieowl.js' })).toBe(
      '<script src="/js/cookieowl.js" data-preset="lgpd" data-policy-url="/privacidade" data-accent="#2f6fed"></script>',
    );
    for (const c of CASES) expect(scriptTag(c)).not.toContain('\n');
  });

  it('writes flags bare and turned off flags as "false"', () => {
    expect(scriptAttributes({ consentMode: true, autoBlock: true, respectDNT: true })).toEqual([
      ['data-consent-mode', null],
      ['data-auto-block', null],
      ['data-dnt', null],
    ]);
    expect(scriptAttributes({ preset: 'gdpr', consentMode: false, autoBlock: false, respectGPC: false, reopenButton: false })).toEqual([
      ['data-preset', 'gdpr'],
      ['data-consent-mode', 'false'],
      ['data-auto-block', 'false'],
      ['data-gpc', 'false'],
      ['data-reopen', 'false'],
    ]);
  });

  it('escapes attribute values', () => {
    const tag = scriptTag({ text: { title: '"><img src=x onerror=alert(1)>' } });
    expect(tag).toContain('data-text-title="&quot;&gt;&lt;img src=x onerror=alert(1)&gt;"');
    expect(readTag(tag)).toEqual({ text: { title: '"><img src=x onerror=alert(1)>' } });
  });

  it('reads back in the script tag build as exactly the generated configuration', () => {
    for (const c of CASES) expect(readTag(scriptTag(c)), JSON.stringify(c)).toEqual(snippetConfig(c));
  });
});

describe('initCode', () => {
  it('imports the shared instance and fits one init line when short', () => {
    expect(initCode({})).toBe("import { cookieowl } from 'cookieowl';\n\ncookieowl.init();\n");
    expect(initCode({ preset: 'gdpr', consentMode: false })).toBe("import { cookieowl } from 'cookieowl';\n\ncookieowl.init({ preset: 'gdpr', consentMode: false });\n");
    expect(initCode({ preset: 'lgpd', policyUrl: '/privacidade', accent: '#2f6fed', layout: 'bar', text: { title: 'Cookies' } })).toBe(
      [
        "import { cookieowl } from 'cookieowl';",
        '',
        'cookieowl.init({',
        "  preset: 'lgpd',",
        "  accent: '#2f6fed',",
        "  policyUrl: '/privacidade',",
        "  layout: 'bar',",
        "  text: { title: 'Cookies' },",
        '});',
        '',
      ].join('\n'),
    );
  });

  it('runs and passes the same configuration as the script tag', () => {
    for (const c of CASES) expect(readInit(initCode(c)), JSON.stringify(c)).toEqual(sameAsInit(snippetConfig(c)));
  });
});

describe('live preview', () => {
  it('renders the banner the snippet describes', () => {
    const box = document.createElement('div');
    box.id = 'preview';
    document.body.append(box);
    owl({ ...snippetConfig({ preset: 'lgpd', accent: '#e4572e', layout: 'bar', text: { acceptAll: 'Pode ser' } }), container: '#preview', storage: 'memory' });
    const root = $('#preview .cko')!;
    expect(root.style.getPropertyValue('--seed')).toBe('#e4572e');
    expect($('#preview .cko-bar')).not.toBeNull();
    expect($('#preview [data-cko=accept]')!.textContent).toBe('Pode ser');
    expect($('#preview [data-cko=reject]')!.textContent).toBe('Rejeitar todos');
  });
});

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'cookieowl.js');

describe.skipIf(!existsSync(dist))('a generated line with dist/cookieowl.js', () => {
  it('starts the banner with the preset, accent and texts of the generator', async () => {
    const opts: SnippetOptions = { preset: 'lgpd', accent: '#2f6fed', policyUrl: '/privacidade', text: { title: 'Cookies "aqui"', rejectAll: 'Não, obrigado' } };
    const attrs = scriptAttributes(opts)
      .map(([k, v]) => (v === null ? k : `${k}="${v.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`))
      .join(' ');
    const code = readFileSync(dist, 'utf8').replace(/<\/script/gi, '<' + String.fromCharCode(92) + '/script');
    const dom = new JSDOM(`<!doctype html><html lang="en"><head><script ${attrs}>${code}</script><script async src="https://connect.facebook.net/en_US/fbevents.js"></script></head><body></body></html>`, {
      url: 'https://loja.example.com.br/',
      runScripts: 'dangerously',
    });
    const doc = dom.window.document;
    await new Promise((r) => setTimeout(r, 20));
    expect(doc.querySelector('.cko-title')!.textContent).toBe('Cookies "aqui"');
    expect(doc.querySelector('[data-cko=reject]')!.textContent).toBe('Não, obrigado');
    expect(doc.querySelector('[data-cko=accept]')!.textContent).toBe('Aceitar todos');
    expect(doc.querySelector('.cko-text p')!.textContent).toContain('LGPD');
    expect(doc.querySelector('.cko-text a')!.getAttribute('href')).toBe('/privacidade');
    expect((doc.querySelector('.cko') as HTMLElement).style.getPropertyValue('--seed')).toBe('#2f6fed');
    expect((doc.querySelector('script[src*="fbevents"]') as HTMLScriptElement).type).toBe('text/plain');
    const dl = (dom.window as unknown as { dataLayer: IArguments[] }).dataLayer;
    expect([...dl[0]!].slice(0, 2)).toEqual(['consent', 'default']);
    dom.window.close();
  });
});

const standalone = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'cookieowl-snippet.js');

describe.skipIf(!existsSync(standalone))('dist/cookieowl-snippet.js', () => {
  it('exposes the same generator on window.CookieOwlSnippet', () => {
    const code = readFileSync(standalone, 'utf8').replace(/<\/script/gi, '<' + String.fromCharCode(92) + '/script');
    const dom = new JSDOM(`<!doctype html><head><script>${code}</script></head><body></body>`, { runScripts: 'dangerously' });
    const g = (dom.window as unknown as { CookieOwlSnippet: { scriptTag: typeof scriptTag; initCode: typeof initCode } }).CookieOwlSnippet;
    for (const c of CASES) {
      expect(g.scriptTag(c)).toBe(scriptTag(c));
      expect(g.initCode(c)).toBe(initCode(c));
    }
    dom.window.close();
  });
});
