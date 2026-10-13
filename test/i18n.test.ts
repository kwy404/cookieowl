import { describe, expect, it } from 'vitest';
import { LANGS, detectLang, matchLang } from '../src/i18n';
import { pickText } from '../src/core';

describe('languages', () => {
  const codes = Object.keys(LANGS);

  it('ships pt-BR, en, es, fr and de', () => {
    expect(codes.sort()).toEqual(['de', 'en', 'es', 'fr', 'pt-BR']);
  });

  it('translates every key of every pack', () => {
    const keys = Object.keys(LANGS.en!.t).sort();
    for (const code of codes) {
      const p = LANGS[code]!;
      expect(Object.keys(p.t).sort(), code).toEqual(keys);
      for (const [k, v] of Object.entries(p.t)) expect(v.trim(), `${code}.${k}`).not.toBe('');
      expect(p.t.description, code).toContain('{law}');
      expect(p.t.prefsDescription, code).toContain('{law}');
      expect(p.t.policySentence, code).toContain('{policy}');
      expect(p.t.embedTitle, code).toContain('{name}');
      expect(p.lgpd[0], code).toMatch(/LGPD/);
      expect(p.lgpd[0], code).toMatch(/13[.,]709\/2018/);
      expect(p.gdpr[1], code).toMatch(/7/);
      for (const id of ['necessary', 'preferences', 'analytics', 'marketing'] as const) {
        expect(p.cats[id][0], `${code}.${id}`).not.toBe('');
        expect(p.cats[id][1], `${code}.${id}`).not.toBe('');
      }
    }
  });

  it('keeps Accept and Reject labels of similar length so neither stands out', () => {
    for (const code of codes) {
      const { acceptAll, rejectAll } = LANGS[code]!.t;
      expect(Math.abs(acceptAll.length - rejectAll.length), code).toBeLessThan(6);
    }
  });

  it('matches language codes loosely', () => {
    expect(matchLang('pt-br')).toBe('pt-BR');
    expect(matchLang('pt_PT')).toBe('pt-BR');
    expect(matchLang('PT')).toBe('pt-BR');
    expect(matchLang('de-AT')).toBe('de');
    expect(matchLang('fr-CA')).toBe('fr');
    expect(matchLang('it')).toBeNull();
    expect(matchLang('')).toBeNull();
    expect(matchLang(null)).toBeNull();
  });

  it('detects from <html lang>, then the browser, then English', () => {
    document.documentElement.setAttribute('lang', 'es-MX');
    expect(detectLang(document, navigator)).toBe('es');
    document.documentElement.setAttribute('lang', 'ja');
    expect(detectLang(document, { languages: ['ja', 'de-CH'] } as unknown as Navigator)).toBe('de');
    expect(detectLang(document, { language: 'fr' } as unknown as Navigator)).toBe('fr');
    expect(detectLang(document, { languages: ['ja'] } as unknown as Navigator)).toBe('en');
    expect(detectLang()).toBe('en');
    document.documentElement.removeAttribute('lang');
  });
});

describe('pickText', () => {
  it('returns plain strings as they are', () => {
    expect(pickText('Hi', 'de')).toBe('Hi');
    expect(pickText(undefined, 'de')).toBe('');
  });

  it('picks the exact language, then the base language, then English, then the first entry', () => {
    const t = { en: 'Hello', 'pt-BR': 'Olá', de: 'Hallo' };
    expect(pickText(t, 'pt-BR')).toBe('Olá');
    expect(pickText(t, 'pt-PT')).toBe('Olá');
    expect(pickText(t, 'de-AT')).toBe('Hallo');
    expect(pickText(t, 'ja')).toBe('Hello');
    expect(pickText({ it: 'Ciao' }, 'ja')).toBe('Ciao');
    expect(pickText({}, 'ja')).toBe('');
  });
});
