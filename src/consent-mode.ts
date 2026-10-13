// Google Consent Mode v2: denied defaults before any Google tag runs, then an
// update every time the visitor chooses.
import type { ConsentModeConfig, ConsentType, ConsentValue } from './types';

type Gtag = (...args: unknown[]) => void;
type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag };

export const DEFAULT_MAPPING: Record<ConsentType, string[]> = {
  ad_storage: ['marketing'],
  ad_user_data: ['marketing'],
  ad_personalization: ['marketing'],
  analytics_storage: ['analytics'],
  functionality_storage: ['preferences'],
  personalization_storage: ['preferences'],
  security_storage: ['necessary'],
};

export function normalizeConsentMode(cfg: boolean | ConsentModeConfig | undefined): Required<Omit<ConsentModeConfig, 'regions'>> & { regions: NonNullable<ConsentModeConfig['regions']> } | null {
  if (!cfg) return null;
  const c = cfg === true ? {} : cfg;
  return {
    waitForUpdate: c.waitForUpdate ?? 500,
    mapping: { ...DEFAULT_MAPPING, ...c.mapping },
    regions: c.regions || [],
    adsDataRedaction: c.adsDataRedaction ?? true,
    urlPassthrough: c.urlPassthrough ?? false,
    advanced: c.advanced ?? false,
  };
}

/**
 * Returns window.gtag, defining the standard stub when the page has none.
 * The stub pushes the `arguments` object, which is what gtag.js expects in dataLayer.
 */
export function getGtag(win: GtagWindow = window as GtagWindow): Gtag {
  win.dataLayer = win.dataLayer || [];
  if (typeof win.gtag !== 'function') {
    win.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      (win.dataLayer as unknown[]).push(arguments);
    };
  }
  return win.gtag;
}

/** Consent type states for the given category states. */
export function consentState(mapping: Partial<Record<ConsentType, string[]>>, accepted: (id: string) => boolean): Record<ConsentType, ConsentValue> {
  const out = {} as Record<ConsentType, ConsentValue>;
  for (const [type, cats] of Object.entries(mapping) as [ConsentType, string[]][]) {
    out[type] = cats.every((c) => accepted(c)) ? 'granted' : 'denied';
  }
  return out;
}

/** Sends the region defaults, the global default (everything denied but security) and the page settings. */
export function sendDefaults(cfg: NonNullable<ReturnType<typeof normalizeConsentMode>>, win?: GtagWindow): void {
  const gtag = getGtag(win);
  const denied = consentState(cfg.mapping, (c) => c === 'necessary');
  for (const r of cfg.regions) {
    const { region, ...types } = r;
    gtag('consent', 'default', { ...denied, ...types, region, wait_for_update: cfg.waitForUpdate });
  }
  gtag('consent', 'default', { ...denied, wait_for_update: cfg.waitForUpdate });
  if (cfg.adsDataRedaction) gtag('set', 'ads_data_redaction', true);
  if (cfg.urlPassthrough) gtag('set', 'url_passthrough', true);
}

export function sendUpdate(cfg: NonNullable<ReturnType<typeof normalizeConsentMode>>, accepted: (id: string) => boolean, win?: GtagWindow): void {
  getGtag(win)('consent', 'update', consentState(cfg.mapping, accepted));
}

/** Pushes a `cookieowl_consent` event so Google Tag Manager triggers can fire on a choice. */
export function pushEvent(categories: Record<string, boolean>, win: GtagWindow = window as GtagWindow): void {
  (win.dataLayer = win.dataLayer || []).push({
    event: 'cookieowl_consent',
    cookieowl: { ...categories },
  });
}
