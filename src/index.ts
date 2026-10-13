// cookieowl: cookie consent for LGPD and GDPR that blocks trackers until consent.
import { CookieOwl } from './core';

export { CookieOwl, createCookieOwl, pickText, trackerList, DEFAULT_CATEGORIES, VERSION } from './core';
export { TRACKERS } from './trackers';
export { LANGS, matchLang, detectLang } from './i18n';
export { DEFAULT_MAPPING as CONSENT_MODE_MAPPING } from './consent-mode';
export type * from './types';

/** The shared instance. Call `cookieowl.init(config)` once, as early as possible. */
export const cookieowl: CookieOwl = new CookieOwl();
export default cookieowl;
