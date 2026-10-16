import { describe, expect, it, vi } from 'vitest';
import { CookieOwl, createCookieOwl, trackerList } from '../src/core';
import { readCookie } from '../src/storage';
import type { ChangeDetail, ConsentRecord } from '../src/types';
import { $, $$, click, gtagCalls, owl, win } from './helpers';

const stored = (): ConsentRecord => JSON.parse(readCookie('cookieowl')!);

describe('init and the first visit', () => {
  it('shows the banner and keeps optional categories off', () => {
    const o = owl({ lang: 'en' });
    expect($('.cko [role=dialog]')).not.toBeNull();
    expect(o.accepted('necessary')).toBe(true);
    expect(o.accepted('analytics')).toBe(false);
    expect(o.accepted(['necessary', 'marketing'])).toBe(false);
    expect(o.accepted('unknown')).toBe(false);
    expect(o.getConsent()).toBeNull();
  });

  it('always includes necessary as a required category', () => {
    const o = owl({ categories: ['analytics'] });
    expect(o.categories().map((c) => [c.id, c.required])).toEqual([
      ['necessary', true],
      ['analytics', false],
    ]);
  });

  it('accepts custom categories, a custom necessary and drops duplicates', () => {
    const o = owl({
      lang: 'pt-BR',
      categories: [
        { id: 'necessary', label: 'Essenciais', services: [{ name: 'Sessão' }] },
        'analytics',
        'analytics',
        { id: 'chat', label: { en: 'Support chat', 'pt-BR': 'Chat de suporte' }, description: 'Intercom' },
        { id: 'fraud', required: true },
      ],
    });
    const cats = o.categories();
    expect(cats.map((c) => c.id)).toEqual(['necessary', 'analytics', 'chat', 'fraud']);
    expect(cats[0]!.label).toBe('Essenciais');
    expect(cats[0]!.services).toHaveLength(1);
    expect(cats[1]!.label).toBe('Estatísticas');
    expect(cats[2]!.label).toBe('Chat de suporte');
    expect(cats[3]).toMatchObject({ label: 'fraud', required: true, description: '' });
    expect(o.accepted('fraud')).toBe(true);
  });

  it('does not show the banner with autoShow false', () => {
    owl({ autoShow: false });
    expect($('.cko [role=dialog]')).toBeNull();
  });

  it('exposes the version and language', () => {
    const o = owl({ lang: 'de' });
    expect(o.version).toBe('0.2.0');
    expect(o.lang).toBe('de');
    expect(new CookieOwl().lang).toBe('en');
  });

  it('creates separate instances', () => {
    const a = createCookieOwl();
    expect(a.categories()).toEqual([]);
    a.init({ storage: 'memory', autoShow: false });
    expect(a.categories()).toHaveLength(4);
    a.destroy();
  });
});

describe('choosing', () => {
  it('accepts all and stores a full record', () => {
    const onConsent = vi.fn();
    const o = owl({ version: '2026-10', onConsent, lang: 'en' });
    click('[data-cko=accept]');
    expect(o.accepted(['analytics', 'marketing', 'preferences'])).toBe(true);
    const r = stored();
    expect(r).toMatchObject({ version: '2026-10', method: 'accept-all', lang: 'en', page: '/products/owl' });
    expect(r.categories).toEqual({ necessary: true, preferences: true, analytics: true, marketing: true });
    expect(r.id).toMatch(/^[0-9a-f-]{32,36}$/);
    expect(Date.parse(r.expires) - Date.parse(r.timestamp)).toBe(365 * 86400000);
    expect(onConsent).toHaveBeenCalledWith(r);
    expect($('.cko [role=dialog]')).toBeNull();
  });

  it('rejects all as easily as it accepts', () => {
    const o = owl();
    click('[data-cko=reject]');
    expect(o.accepted('analytics')).toBe(false);
    expect(stored().method).toBe('reject-all');
    expect(stored().categories).toEqual({ necessary: true, preferences: false, analytics: false, marketing: false });
  });

  it('saves a custom choice from a map or a list and names the method', () => {
    const o = owl();
    o.save({ analytics: true, necessary: false });
    expect(o.accepted('necessary')).toBe(true);
    expect(stored().method).toBe('custom');
    o.save(['analytics', 'marketing', 'preferences']);
    expect(stored().method).toBe('accept-all');
    o.save([]);
    expect(stored().method).toBe('reject-all');
  });

  it('keeps the consent id across updates', () => {
    const o = owl();
    o.acceptAll();
    const id = stored().id;
    o.rejectAll();
    expect(stored().id).toBe(id);
  });

  it('emits change only for categories that changed, and consent every time', () => {
    const o = owl();
    const changes: ChangeDetail[] = [];
    const consents: ConsentRecord[] = [];
    o.on('change', (d) => changes.push(d));
    const off = o.on('consent', (r) => consents.push(r));
    o.save({ analytics: true });
    o.save({ analytics: true });
    off();
    o.save({ analytics: true, marketing: true });
    expect(consents).toHaveLength(2);
    expect(changes.map((c) => c.changed)).toEqual([['analytics'], ['marketing']]);
    expect(changes[1]!.accepted).toEqual(['necessary', 'analytics', 'marketing']);
    expect(changes[1]!.categories.marketing).toBe(true);
    expect(changes[1]!.record?.method).toBe('custom');
  });

  it('also dispatches DOM events', () => {
    const o = owl();
    const seen: string[] = [];
    const h = (e: Event) => seen.push(e.type);
    document.addEventListener('cookieowl:consent', h);
    document.addEventListener('cookieowl:change', h);
    o.acceptAll();
    document.removeEventListener('cookieowl:consent', h);
    document.removeEventListener('cookieowl:change', h);
    expect(seen).toEqual(['cookieowl:consent', 'cookieowl:change']);
  });

  it('keeps going when a listener or onConsent throws', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const o = owl({
      onConsent: () => {
        throw new Error('log down');
      },
    });
    o.on('consent', () => {
      throw new Error('boom');
    });
    expect(() => o.acceptAll()).not.toThrow();
    expect(o.accepted('analytics')).toBe(true);
    expect(err).toHaveBeenCalledTimes(2);
    err.mockRestore();
  });
});

describe('returning visitors', () => {
  it('reads a valid record and skips the banner', () => {
    owl().save({ analytics: true });
    const ready = vi.fn();
    const o = new CookieOwl();
    o.on('ready', ready);
    o.init();
    expect(o.accepted('analytics')).toBe(true);
    expect(o.accepted('marketing')).toBe(false);
    expect($$('.cko [role=dialog]')).toHaveLength(0);
    expect(ready.mock.calls[0]![0].accepted).toEqual(['necessary', 'analytics']);
    o.destroy();
  });

  it('asks again when the policy version changes', () => {
    owl({ version: 1 }).acceptAll();
    const o = owl({ version: 2 });
    expect(o.accepted('analytics')).toBe(false);
    expect($('[data-cko=accept]')).not.toBeNull();
  });

  it('asks again after the record expires', () => {
    owl({ expiresDays: 30 }).acceptAll();
    vi.useFakeTimers({ now: Date.now() + 31 * 86400000, toFake: ['Date'] });
    try {
      expect(owl({ expiresDays: 30 }).accepted('analytics')).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('asks again when a new category is added', () => {
    owl({ categories: ['analytics'] }).acceptAll();
    const o = owl({ categories: ['analytics', 'marketing'] });
    expect(o.getConsent()).toBeNull();
    expect($('[data-cko=accept]')).not.toBeNull();
  });

  it('can store in localStorage or only in memory', () => {
    owl({ storage: 'localStorage' }).acceptAll();
    expect(readCookie('cookieowl')).toBeNull();
    expect(JSON.parse(localStorage.getItem('cookieowl')!).method).toBe('accept-all');
    expect(owl({ storage: 'localStorage' }).accepted('marketing')).toBe(true);
    owl({ storage: 'memory' }).acceptAll();
    expect(owl({ storage: 'memory' }).accepted('marketing')).toBe(false);
  });

  it('honors a custom cookie name', () => {
    owl({ cookie: { name: 'consent_v1' } }).acceptAll();
    expect(readCookie('consent_v1')).not.toBeNull();
    expect(readCookie('cookieowl')).toBeNull();
  });
});

describe('reset and withdrawal', () => {
  it('reset forgets the choice and shows the banner again', () => {
    const o = owl();
    o.acceptAll();
    const changed = vi.fn();
    const reset = vi.fn();
    o.on('change', changed);
    o.on('reset', reset);
    o.reset();
    expect(readCookie('cookieowl')).toBeNull();
    expect(o.accepted('analytics')).toBe(false);
    expect(reset).toHaveBeenCalled();
    expect(changed.mock.calls[0]![0].changed).toEqual(['preferences', 'analytics', 'marketing']);
    expect($('[data-cko=accept]')).not.toBeNull();
  });

  it('erases tracker and service cookies of withdrawn categories', () => {
    const o = owl({
      categories: ['analytics', { id: 'marketing', services: [{ name: 'Ads', cookies: [{ name: 'ads_id' }, { name: /^adx_/ }] }] }],
    });
    o.acceptAll();
    document.cookie = '_ga=GA1.1; Path=/';
    document.cookie = '_ga_ABC=GS1; Path=/';
    document.cookie = '_fbp=fb.1; Path=/';
    document.cookie = 'ads_id=1; Path=/';
    document.cookie = 'adx_7=1; Path=/';
    document.cookie = 'theme=dark; Path=/';
    o.save({ analytics: false, marketing: true });
    expect(document.cookie).not.toContain('_ga');
    expect(document.cookie).toContain('_fbp');
    o.rejectAll();
    expect(document.cookie).not.toContain('_fbp');
    expect(document.cookie).not.toContain('ads_id');
    expect(document.cookie).not.toContain('adx_7');
    expect(document.cookie).toContain('theme=dark');
  });

  it('keeps cookies with clearCookies false', () => {
    const o = owl({ clearCookies: false });
    o.acceptAll();
    document.cookie = '_ga=1; Path=/';
    o.rejectAll();
    expect(document.cookie).toContain('_ga=1');
  });

  it('calls the withdraw handler only when scripts of that category ran', async () => {
    const handler = vi.fn();
    const o = owl({ reloadOnWithdraw: handler });
    o.acceptAll();
    o.rejectAll();
    expect(handler).not.toHaveBeenCalled();
    document.body.innerHTML = '<script type="text/plain" data-cookieowl="analytics">document.body.dataset.ran = "a"</script>';
    o.acceptAll();
    await new Promise((r) => setTimeout(r, 0));
    expect(document.body.dataset.ran).toBe('a');
    o.save({ marketing: true });
    expect(handler).toHaveBeenCalledWith(['analytics']);
  });

  it('does not reload with reloadOnWithdraw false', async () => {
    const o = owl({ reloadOnWithdraw: false });
    document.body.innerHTML = '<script type="text/plain" data-cookieowl="analytics">document.body.dataset.ran = "b"</script>';
    o.acceptAll();
    await new Promise((r) => setTimeout(r, 0));
    expect(() => o.rejectAll()).not.toThrow();
  });
});

describe('privacy signals', () => {
  const setNav = (key: string, value: unknown) => Object.defineProperty(navigator, key, { value, configurable: true });

  it('treats Global Privacy Control as a refusal without showing the banner', () => {
    setNav('globalPrivacyControl', true);
    try {
      const onConsent = vi.fn();
      const o = owl({ onConsent });
      expect($('[data-cko=accept]')).toBeNull();
      expect(o.accepted('marketing')).toBe(false);
      expect(stored()).toMatchObject({ method: 'signal', signal: 'gpc' });
      expect(onConsent).toHaveBeenCalled();
      o.showPreferences();
      expect($('.cko-note')?.textContent).toMatch(/privacy signal/);
      // No pre-ticked boxes after a signal either.
      expect($$<HTMLInputElement>('.cko-sw').every((i) => !i.checked)).toBe(true);
      // The visitor can still opt in.
      o.save({ analytics: true });
      expect(o.accepted('analytics')).toBe(true);
    } finally {
      setNav('globalPrivacyControl', undefined);
    }
  });

  it('ignores GPC when respectGPC is false', () => {
    setNav('globalPrivacyControl', true);
    try {
      owl({ respectGPC: false });
      expect($('[data-cko=accept]')).not.toBeNull();
    } finally {
      setNav('globalPrivacyControl', undefined);
    }
  });

  it('honors Do Not Track only when asked to', () => {
    setNav('doNotTrack', '1');
    try {
      owl();
      expect($('[data-cko=accept]')).not.toBeNull();
      owl({ respectDNT: true });
      expect(stored()).toMatchObject({ method: 'signal', signal: 'dnt' });
    } finally {
      setNav('doNotTrack', undefined);
    }
  });
});

describe('Consent Mode integration', () => {
  it('sends defaults on init and an update on choice, then a dataLayer event', () => {
    const o = owl({ consentMode: true });
    expect(gtagCalls()[0]!.slice(0, 2)).toEqual(['consent', 'default']);
    o.save({ analytics: true });
    const update = gtagCalls().find((c) => c[1] === 'update')!;
    expect(update[2]).toMatchObject({ analytics_storage: 'granted', ad_storage: 'denied' });
    expect(win.dataLayer!.at(-1)).toEqual({ event: 'cookieowl_consent', cookieowl: { necessary: true, preferences: false, analytics: true, marketing: false } });
  });

  it('sends the stored state right after the defaults for returning visitors', () => {
    owl({ consentMode: true }).acceptAll();
    delete win.dataLayer;
    owl({ consentMode: true });
    const calls = gtagCalls();
    expect(calls.map((c) => c[1])).toEqual(['default', 'ads_data_redaction', 'update']);
    expect(calls[2]![2]).toMatchObject({ ad_storage: 'granted', analytics_storage: 'granted' });
  });

  it('pushes the event to an existing dataLayer even without Consent Mode', () => {
    win.dataLayer = [];
    owl().rejectAll();
    expect(win.dataLayer).toEqual([{ event: 'cookieowl_consent', cookieowl: { necessary: true, preferences: false, analytics: false, marketing: false } }]);
  });

  it('denies again on reset', () => {
    const o = owl({ consentMode: true });
    o.acceptAll();
    o.reset();
    expect(gtagCalls().at(-1)![2]).toMatchObject({ analytics_storage: 'denied' });
  });
});

describe('trackerList', () => {
  it('is null when auto blocking is off', () => {
    expect(trackerList(undefined, false)).toBeNull();
    expect(trackerList(false, false)).toBeNull();
  });

  it('applies ignore, category overrides, custom patterns and advanced mode', () => {
    const list = trackerList({ ignore: ['hotjar'], categories: { gtm: 'marketing' }, patterns: [{ id: 'x', name: 'X', category: 'analytics', match: /x\.js/ }] }, false)!;
    expect(list[0]!.id).toBe('x');
    expect(list.find((t) => t.id === 'hotjar')).toBeUndefined();
    expect(list.find((t) => t.id === 'gtm')!.category).toBe('marketing');
    const adv = trackerList(true, true)!;
    expect(adv.find((t) => t.id === 'gtag')).toBeUndefined();
    expect(adv.find((t) => t.id === 'meta-pixel')).toBeDefined();
  });
});

describe('page lifecycle', () => {
  it('waits for DOMContentLoaded while the document is loading', () => {
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });
    try {
      const o = owl();
      expect($('.cko')).toBeNull();
      document.dispatchEvent(new Event('DOMContentLoaded'));
      expect($('[data-cko=accept]')).not.toBeNull();
      o.destroy();
      const p = owl();
      p.destroy();
      document.dispatchEvent(new Event('DOMContentLoaded'));
      expect($('.cko')).toBeNull();
    } finally {
      delete (document as { readyState?: string }).readyState;
    }
  });

  it('hidePreferences closes the dialog', () => {
    const o = owl();
    o.showPreferences();
    o.hidePreferences();
    expect($('.cko-prefs')).toBeNull();
  });
});

describe('re-init and destroy', () => {
  it('replaces the previous configuration', () => {
    const o = owl({ layout: 'bar' });
    expect($('.cko-bar')).not.toBeNull();
    o.init({ layout: 'modal' });
    expect($$('.cko')).toHaveLength(1);
    expect($('.cko-modal')).not.toBeNull();
  });

  it('removes the UI and stops reacting to data-cookieowl-open', () => {
    const o = owl();
    document.body.insertAdjacentHTML('beforeend', '<a href="#" data-cookieowl-open>Cookies</a>');
    o.destroy();
    expect($('.cko')).toBeNull();
    click('[data-cookieowl-open]');
    expect($('.cko')).toBeNull();
    o.acceptAll();
    expect(o.accepted('analytics')).toBe(false);
  });
});
