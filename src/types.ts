/** A text that is the same in every language, or one string per language code. */
export type Text = string | Record<string, string>;

/** One cookie a service sets, shown in the preferences dialog and erased when consent is withdrawn. */
export interface CookieInfo {
  /** Exact name, a name ending in `*` for a prefix, or a regular expression. */
  name: string | RegExp;
  /** How long it lives, as shown to the visitor, for example `"13 months"`. */
  duration?: Text;
  description?: Text;
}

/** A third party or first party service that belongs to a category. */
export interface ServiceInfo {
  name: string;
  provider?: string;
  description?: Text;
  /** Link to the provider privacy policy. */
  policyUrl?: string;
  cookies?: CookieInfo[];
}

/** A consent category. The four built in ids have translated labels in every language. */
export interface CategoryConfig {
  id: string;
  label?: Text;
  description?: Text;
  /** Required categories are always on and cannot be switched off. `necessary` is required. */
  required?: boolean;
  services?: ServiceInfo[];
}

export interface ResolvedCategory {
  id: string;
  label: string;
  description: string;
  required: boolean;
  services: ServiceInfo[];
}

export type ConsentMethod = 'accept-all' | 'reject-all' | 'custom' | 'signal';

/** What is stored on the device and passed to `onConsent` for your audit log. */
export interface ConsentRecord {
  /** Random id of this consent, kept across updates on the same device. */
  id: string;
  /** The policy version the visitor agreed to. A different version shows the banner again. */
  version: string;
  /** ISO 8601 time of the choice. */
  timestamp: string;
  /** ISO 8601 time after which the banner is shown again. */
  expires: string;
  /** Every configured category and whether it was accepted. */
  categories: Record<string, boolean>;
  method: ConsentMethod;
  /** Set when the choice came from a browser privacy signal. */
  signal?: 'gpc' | 'dnt';
  /** Language the banner was shown in. */
  lang: string;
  /** Path of the page where the choice was made. */
  page: string;
}

export type ConsentType =
  | 'ad_storage'
  | 'ad_user_data'
  | 'ad_personalization'
  | 'analytics_storage'
  | 'functionality_storage'
  | 'personalization_storage'
  | 'security_storage';

export type ConsentValue = 'granted' | 'denied';

/** A region specific default, for example `{ region: ['US-CA'], analytics_storage: 'granted' }`. */
export type ConsentModeRegion = { region: string[] } & Partial<Record<ConsentType, ConsentValue>>;

export interface ConsentModeConfig {
  /** Milliseconds tags wait for the update after the default. Default 500. */
  waitForUpdate?: number;
  /** Which categories grant each consent type. A type is granted when all its categories are accepted. */
  mapping?: Partial<Record<ConsentType, string[]>>;
  /** Region specific defaults, set before the global default. */
  regions?: ConsentModeRegion[];
  /** Redact ad click identifiers while ad_storage is denied. Default true. */
  adsDataRedaction?: boolean;
  /** Pass ad click information through URLs while storage is denied. Default false. */
  urlPassthrough?: boolean;
  /**
   * Advanced mode: Google tags load before consent and send cookieless pings,
   * so the auto blocker does not hold gtag.js and gtm.js. Default false (basic mode).
   */
  advanced?: boolean;
}

/** A tracker the auto blocker recognizes by URL. */
export interface TrackerPattern {
  id: string;
  name: string;
  category: string;
  /** Tested against the absolute URL of a script or iframe. */
  match: RegExp;
  /** `embed` iframes get a click to load placeholder. */
  kind?: 'script' | 'embed';
  /** First party cookies it sets, erased when its category is withdrawn. */
  cookies?: (string | RegExp)[];
  /** A Google tag that Consent Mode advanced lets through. */
  google?: boolean;
}

export interface AutoBlockConfig {
  /** Extra patterns, checked before the built in list. */
  patterns?: TrackerPattern[];
  /** Move a built in tracker to another category, for example `{ gtm: 'marketing' }`. */
  categories?: Record<string, string>;
  /** Built in tracker ids to leave alone. */
  ignore?: string[];
}

export interface CookieOptions {
  /** Default `cookieowl`. */
  name?: string;
  domain?: string;
  /** Default `/`. */
  path?: string;
  /** Default `Lax`. */
  sameSite?: 'Lax' | 'Strict' | 'None';
}

export type Layout = 'bar' | 'box' | 'modal';
export type Position = 'bottom' | 'top' | 'bottom-left' | 'bottom-right';
export type Theme = 'auto' | 'light' | 'dark';

export interface CookieOwlConfig {
  /**
   * Region preset. `lgpd` sets Portuguese texts, the LGPD wording, Consent Mode
   * and auto blocking; `gdpr` sets the GDPR wording, Consent Mode and auto
   * blocking. Your own options always win over the preset.
   */
  preset?: 'lgpd' | 'gdpr';
  /** Category ids or objects. Default `['necessary', 'preferences', 'analytics', 'marketing']`. */
  categories?: (string | CategoryConfig)[];
  /** `auto` (default) reads `<html lang>` and then the browser language. */
  lang?: string;
  /** Legal wording. Default `lgpd` for Portuguese and `gdpr` for the other languages. */
  template?: 'lgpd' | 'gdpr';
  /** Link to your privacy or cookie policy, shown in the banner. */
  policyUrl?: string;
  /** Your policy version. Change it to ask everyone again. Default `1`. */
  version?: string | number;
  /** Days until the choice expires and the banner shows again. Default 365. */
  expiresDays?: number;
  /** Where the record is kept. Default `cookie`. */
  storage?: 'cookie' | 'localStorage' | 'memory';
  cookie?: CookieOptions;
  layout?: Layout;
  position?: Position;
  theme?: Theme;
  /** Accent color of the buttons and switches, any CSS color. Default: the page `--seed`, or amber. */
  accent?: string;
  /** Text direction. `auto` (default) follows `<html dir>`. */
  dir?: 'auto' | 'ltr' | 'rtl';
  /** Show the floating button that reopens the preferences. Default true. */
  reopenButton?: boolean | 'left' | 'right';
  /** Element or selector to mount into instead of `document.body` (the UI is then positioned inside it). */
  container?: HTMLElement | string;
  /** Override any text, for every language or per language. */
  text?: Partial<Record<TextKey, Text>>;
  /** Google Consent Mode v2. `true` uses the defaults. */
  consentMode?: boolean | ConsentModeConfig;
  /** Block known trackers by URL until their category is accepted. */
  autoBlock?: boolean | AutoBlockConfig;
  /** Treat Global Privacy Control as a refusal of optional categories. Default true. */
  respectGPC?: boolean;
  /** Treat Do Not Track as a refusal of optional categories. Default false. */
  respectDNT?: boolean;
  /** Erase the cookies of withdrawn categories. Default true. */
  clearCookies?: boolean;
  /**
   * Reload the page when a category whose scripts already ran is withdrawn, so
   * they stop. Pass a function to handle it yourself (a single page app can
   * tear the trackers down instead). Default true.
   */
  reloadOnWithdraw?: boolean | ((categories: string[]) => void);
  /** Show the banner on init when there is no valid choice. Default true. */
  autoShow?: boolean;
  /** Called with the record every time the visitor makes a choice. Send it to your audit log. */
  onConsent?: (record: ConsentRecord) => void;
}

export type TextKey =
  | 'title'
  | 'description'
  | 'policySentence'
  | 'policyLink'
  | 'acceptAll'
  | 'rejectAll'
  | 'customize'
  | 'save'
  | 'close'
  | 'prefsTitle'
  | 'prefsDescription'
  | 'alwaysOn'
  | 'cookies'
  | 'duration'
  | 'policy'
  | 'reopen'
  | 'saved'
  | 'signal'
  | 'embedTitle'
  | 'embedText'
  | 'loadOnce'
  | 'allowAlways';

export type Texts = Record<TextKey, string>;

export interface ChangeDetail {
  /** Every category and its state after the change. */
  categories: Record<string, boolean>;
  /** Accepted category ids. */
  accepted: string[];
  /** Categories whose state changed. */
  changed: string[];
  record: ConsentRecord | null;
}

export interface EventMap {
  change: ChangeDetail;
  consent: ConsentRecord;
  show: 'banner' | 'preferences';
  hide: 'banner' | 'preferences';
  ready: ChangeDetail;
  reset: undefined;
}
