// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { cookieowl, createCookieOwl } from '../src/index';

describe('server rendering', () => {
  it('imports and initializes without a DOM', () => {
    expect(typeof document).toBe('undefined');
    const o = createCookieOwl({ lang: 'de', autoBlock: true, consentMode: true });
    expect(o.lang).toBe('de');
    expect(o.accepted('necessary')).toBe(true);
    expect(o.accepted('analytics')).toBe(false);
    expect(o.getConsent()).toBeNull();
    expect(() => o.show()).not.toThrow();
    expect(() => o.showPreferences()).not.toThrow();
    expect(() => o.acceptAll()).not.toThrow();
    expect(() => o.reset()).not.toThrow();
    expect(() => o.destroy()).not.toThrow();
  });

  it('detects English without a browser and keeps the shared instance idle', () => {
    expect(createCookieOwl({}).lang).toBe('en');
    expect(cookieowl.categories()).toEqual([]);
  });
});
