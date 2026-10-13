import { describe, expect, it } from 'vitest';
import { DEFAULT_MAPPING, consentState, getGtag, normalizeConsentMode, pushEvent, sendDefaults, sendUpdate } from '../src/consent-mode';
import { gtagCalls, win } from './helpers';

describe('Google Consent Mode v2', () => {
  it('is off unless configured', () => {
    expect(normalizeConsentMode(undefined)).toBeNull();
    expect(normalizeConsentMode(false)).toBeNull();
  });

  it('normalizes the defaults', () => {
    expect(normalizeConsentMode(true)).toEqual({
      waitForUpdate: 500,
      mapping: DEFAULT_MAPPING,
      regions: [],
      adsDataRedaction: true,
      urlPassthrough: false,
      advanced: false,
    });
    const c = normalizeConsentMode({ waitForUpdate: 1000, mapping: { analytics_storage: ['stats'] }, urlPassthrough: true, adsDataRedaction: false, advanced: true })!;
    expect(c.waitForUpdate).toBe(1000);
    expect(c.mapping.analytics_storage).toEqual(['stats']);
    expect(c.mapping.ad_storage).toEqual(['marketing']);
    expect(c.urlPassthrough).toBe(true);
    expect(c.adsDataRedaction).toBe(false);
    expect(c.advanced).toBe(true);
  });

  it('defines the standard gtag stub that pushes arguments objects', () => {
    const gtag = getGtag();
    gtag('event', 'x');
    const pushed = win.dataLayer![0] as IArguments;
    expect(Object.prototype.toString.call(pushed)).toBe('[object Arguments]');
    expect([...pushed]).toEqual(['event', 'x']);
  });

  it('reuses a gtag function the page already has', () => {
    const calls: unknown[][] = [];
    win.gtag = (...a: unknown[]) => calls.push(a);
    getGtag()('consent', 'update', {});
    expect(calls).toEqual([['consent', 'update', {}]]);
  });

  it('sends denied defaults with wait_for_update, security granted', () => {
    sendDefaults(normalizeConsentMode(true)!);
    expect(gtagCalls()).toEqual([
      [
        'consent',
        'default',
        {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'denied',
          personalization_storage: 'denied',
          security_storage: 'granted',
          wait_for_update: 500,
        },
      ],
      ['set', 'ads_data_redaction', true],
    ]);
  });

  it('sends region defaults before the global one', () => {
    sendDefaults(normalizeConsentMode({ regions: [{ region: ['US-CA', 'BR'], analytics_storage: 'granted' }], urlPassthrough: true, adsDataRedaction: false })!);
    const calls = gtagCalls();
    expect(calls[0]![2]).toMatchObject({ region: ['US-CA', 'BR'], analytics_storage: 'granted', ad_storage: 'denied' });
    expect(calls[1]![2]).not.toHaveProperty('region');
    expect(calls[1]![2]).toMatchObject({ analytics_storage: 'denied' });
    expect(calls[2]).toEqual(['set', 'url_passthrough', true]);
    expect(calls).toHaveLength(3);
  });

  it('updates from category states', () => {
    const cfg = normalizeConsentMode(true)!;
    sendUpdate(cfg, (c) => c === 'necessary' || c === 'analytics');
    expect(gtagCalls()[0]).toEqual([
      'consent',
      'update',
      {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted',
      },
    ]);
  });

  it('needs every mapped category for a type', () => {
    expect(consentState({ ad_storage: ['marketing', 'analytics'] }, (c) => c === 'marketing')).toEqual({ ad_storage: 'denied' });
    expect(consentState({ ad_storage: ['marketing', 'analytics'] }, () => true)).toEqual({ ad_storage: 'granted' });
  });

  it('pushes a dataLayer event for Tag Manager triggers', () => {
    pushEvent({ necessary: true, analytics: true });
    expect(win.dataLayer).toEqual([{ event: 'cookieowl_consent', cookieowl: { necessary: true, analytics: true } }]);
  });
});
