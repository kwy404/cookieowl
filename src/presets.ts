// Ready made starting points per region. A preset only fills options you did
// not set yourself, so `{ preset: 'lgpd', lang: 'en' }` keeps the LGPD wording
// in English. Kept free of runtime imports so the snippet generator can use it
// alone, and written tightly because it ships in the script tag build.
import type { CookieOwlConfig } from './types';

export type PresetName = NonNullable<CookieOwlConfig['preset']>;

/**
 * The configuration with the preset filled in under your own options:
 * - `lgpd` (Brazil): Portuguese texts, the LGPD wording, Google Consent Mode v2 and auto blocking.
 * - `gdpr` (EU, EEA and UK): the visitor's language, the GDPR and ePrivacy wording, Google Consent Mode v2 and auto blocking.
 *
 * Both keep the defaults for everything else: necessary, preferences, analytics
 * and marketing categories, nothing pre-ticked, Reject as visible as Accept,
 * Global Privacy Control respected and the choice kept for 12 months.
 * Unknown presets are ignored.
 */
export function applyPreset(config: CookieOwlConfig): CookieOwlConfig {
  const p = config.preset;
  return p === 'lgpd' || p === 'gdpr' ? { template: p, consentMode: true, autoBlock: true, ...(p === 'lgpd' && { lang: 'pt-BR' }), ...config } : config;
}

/** What each preset sets, for documentation and generators. */
export const PRESETS: Record<PresetName, CookieOwlConfig> = /* @__PURE__ */ (() => {
  const out = {} as Record<PresetName, CookieOwlConfig>;
  for (const name of ['lgpd', 'gdpr'] as const) {
    const c = applyPreset({ preset: name });
    delete c.preset;
    out[name] = c;
  }
  return out;
})();
