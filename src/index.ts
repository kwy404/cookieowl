// cookieowl: cookie consent for LGPD and GDPR that blocks trackers until consent.
import { CookieOwl } from './core';

export { CookieOwl, createCookieOwl, pickText, trackerList, DEFAULT_CATEGORIES, VERSION } from './core';
export { TRACKERS } from './trackers';
export { PRESETS, applyPreset, type PresetName } from './presets';
export { LANGS, matchLang, detectLang } from './i18n';
export { DEFAULT_MAPPING as CONSENT_MODE_MAPPING } from './consent-mode';
export type * from './types';

const existing = typeof window !== 'undefined' ? (window as { cookieowl?: CookieOwl }).cookieowl : undefined;

/**
 * The shared instance. Call `cookieowl.init(config)` once, as early as possible.
 * When the script tag build already created `window.cookieowl`, this is that
 * same instance, so the React and Vue helpers see the choice it manages.
 */
export const cookieowl: CookieOwl = existing && typeof existing.accepted === 'function' && typeof existing.on === 'function' ? existing : new CookieOwl();
export default cookieowl;
