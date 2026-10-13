import { describe, expect, it } from 'vitest';
import { cookieMatches, cookieStore, eraseCookies, localStore, memoryStore, readCookie, uuid } from '../src/storage';
import type { ConsentRecord } from '../src/types';
import './helpers';

const record = (over: Partial<ConsentRecord> = {}): ConsentRecord => ({
  id: 'abc',
  version: '1',
  timestamp: '2026-01-01T00:00:00.000Z',
  expires: '2099-01-01T00:00:00.000Z',
  categories: { necessary: true, analytics: false },
  method: 'reject-all',
  lang: 'en',
  page: '/',
  ...over,
});

describe('cookie store', () => {
  it('writes, reads and clears a first party cookie', () => {
    const s = cookieStore();
    expect(s.read()).toBeNull();
    s.write(record(), 3600);
    expect(document.cookie).toContain('cookieowl=');
    expect(s.read()).toEqual(record());
    s.clear();
    expect(s.read()).toBeNull();
  });

  it('uses the configured name and survives values with separators', () => {
    const s = cookieStore({ name: 'consent', sameSite: 'Strict' });
    s.write(record({ page: '/a;b=c' }), 60);
    expect(readCookie('consent')).toContain('/a;b=c');
    expect(s.read()?.page).toBe('/a;b=c');
    expect(cookieStore().read()).toBeNull();
  });

  it('can be scoped to a parent domain', () => {
    const s = cookieStore({ domain: 'example.com' });
    s.write(record(), 60);
    expect(s.read()?.id).toBe('abc');
  });

  it('ignores malformed values', () => {
    document.cookie = 'cookieowl=%7Bbroken; Path=/';
    expect(cookieStore().read()).toBeNull();
    document.cookie = `cookieowl=${encodeURIComponent('{"id":1}')}; Path=/`;
    expect(cookieStore().read()).toBeNull();
    document.cookie = 'cookieowl=%E0%A4%A; Path=/';
    expect(readCookie('cookieowl')).toBeNull();
  });
});

describe('localStorage and memory stores', () => {
  it('round trips through localStorage', () => {
    const s = localStore('k');
    s.write(record(), 0);
    expect(JSON.parse(localStorage.getItem('k')!).id).toBe('abc');
    expect(s.read()?.method).toBe('reject-all');
    s.clear();
    expect(localStorage.getItem('k')).toBeNull();
  });

  it('survives a blocked localStorage', () => {
    const fake = { get localStorage(): Storage {
      throw new Error('blocked');
    } } as unknown as Window;
    const s = localStore('k', fake);
    expect(() => s.write(record(), 0)).not.toThrow();
    expect(s.read()).toBeNull();
    expect(() => s.clear()).not.toThrow();
  });

  it('keeps memory records per store', () => {
    const a = memoryStore();
    const b = memoryStore();
    a.write(record(), 0);
    expect(a.read()?.id).toBe('abc');
    expect(b.read()).toBeNull();
    a.clear();
    expect(a.read()).toBeNull();
  });
});

describe('cookie erasing', () => {
  it('matches exact names, prefixes and regular expressions', () => {
    expect(cookieMatches('_ga', '_ga')).toBe(true);
    expect(cookieMatches('_ga_ABC', '_ga')).toBe(false);
    expect(cookieMatches('_ga_ABC', '_ga_*')).toBe(true);
    expect(cookieMatches('_hjSession_1', /^_hj/)).toBe(true);
  });

  it('erases matching cookies on the host and parent domains', () => {
    document.cookie = '_ga=1; Path=/';
    document.cookie = '_ga_X1=2; Path=/; Domain=example.com';
    document.cookie = 'keep=3; Path=/';
    const erased = eraseCookies(['_ga', '_ga_*']);
    expect(erased.sort()).toEqual(['_ga', '_ga_X1']);
    expect(document.cookie).toBe('keep=3');
  });

  it('does nothing without patterns', () => {
    document.cookie = '_ga=1; Path=/';
    expect(eraseCookies([])).toEqual([]);
    expect(document.cookie).toContain('_ga=1');
  });
});

describe('uuid', () => {
  it('returns unique random ids', () => {
    const ids = new Set(Array.from({ length: 50 }, uuid));
    expect(ids.size).toBe(50);
    expect(uuid()).toMatch(/^[0-9a-f-]{32,36}$/);
  });

  it('falls back to random hex without randomUUID', () => {
    const c = globalThis.crypto;
    const orig = c.randomUUID;
    Object.defineProperty(c, 'randomUUID', { value: undefined, configurable: true });
    try {
      expect(uuid()).toMatch(/^[0-9a-f]{32}$/);
    } finally {
      Object.defineProperty(c, 'randomUUID', { value: orig, configurable: true });
    }
  });
});
