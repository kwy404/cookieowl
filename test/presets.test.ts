import { describe, expect, it } from 'vitest';
import { PRESETS, applyPreset } from '../src/presets';
import { $, gtagCalls, owl } from './helpers';

describe('region presets', () => {
  it('documents exactly what each preset sets', () => {
    expect(PRESETS).toEqual({
      lgpd: { lang: 'pt-BR', template: 'lgpd', consentMode: true, autoBlock: true },
      gdpr: { template: 'gdpr', consentMode: true, autoBlock: true },
    });
  });

  it('fills only the options you left out', () => {
    expect(applyPreset({ preset: 'lgpd', lang: 'en', autoBlock: false })).toEqual({
      preset: 'lgpd',
      lang: 'en',
      template: 'lgpd',
      consentMode: true,
      autoBlock: false,
    });
    expect(applyPreset({ lang: 'fr' })).toEqual({ lang: 'fr' });
    expect(applyPreset({ preset: 'ccpa' as never, lang: 'fr' })).toEqual({ preset: 'ccpa', lang: 'fr' });
  });

  it('lgpd shows the Portuguese LGPD banner, sends Consent Mode defaults and holds known trackers', () => {
    const o = owl({ preset: 'lgpd', storage: 'memory' });
    // What a vendor snippet does after cookieowl has started.
    const s = document.createElement('script');
    s.dataset.test = '';
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-1';
    document.head.append(s);
    expect(o.lang).toBe('pt-BR');
    expect($('.cko-title')!.textContent).toBe('Sua privacidade importa');
    expect($('.cko-text p')!.textContent).toContain('Lei 13.709/2018');
    expect(gtagCalls()[0]!.slice(0, 2)).toEqual(['consent', 'default']);
    expect(s.type).toBe('text/plain');
  });

  it('gdpr keeps the visitor language and uses the GDPR wording, also in Portuguese', () => {
    document.documentElement.lang = 'de';
    owl({ preset: 'gdpr', storage: 'memory' });
    expect($('.cko-text p')!.textContent).toContain('DSGVO');
    expect(gtagCalls()).not.toHaveLength(0);
  });

  it('lets a template from the page win over the preset in another language', () => {
    owl({ preset: 'gdpr', lang: 'pt-BR', storage: 'memory' });
    expect($('.cko-text p')!.textContent).toContain('RGPD');
  });
});

describe('accent color', () => {
  it('paints the banner and the embed placeholders', () => {
    const o = owl({ accent: '#2f6fed', storage: 'memory', autoBlock: true });
    expect($('.cko')!.style.getPropertyValue('--seed')).toBe('#2f6fed');
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube.com/embed/x';
    document.body.append(f);
    return new Promise<void>((r) => setTimeout(r, 0)).then(() => {
      const wraps = [...document.querySelectorAll<HTMLElement>('.cko')];
      expect(wraps).toHaveLength(2);
      for (const w of wraps) expect(w.style.getPropertyValue('--seed')).toBe('#2f6fed');
      o.destroy();
    });
  });

  it('leaves --seed to the page when unset', () => {
    owl({ storage: 'memory' });
    expect($('.cko')!.getAttribute('style')).toBeNull();
  });
});
