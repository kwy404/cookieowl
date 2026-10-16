// The snippet generator behind the visual configurator: turns the choices of a
// form (preset, colors, texts, categories...) into the one line script tag, the
// npm code and the configuration for a live preview. Pure functions with no DOM,
// so it runs in a page, in Node and in tests. It is not part of the script tag
// build: import it from `cookieowl/snippet`.
import { applyPreset, PRESETS, type PresetName } from './presets';
import type { CookieOwlConfig, Layout, Position, TextKey, Theme } from './types';

declare const __VERSION__: string;
const VERSION: string = typeof __VERSION__ === 'string' ? __VERSION__ : '0.0.0';

export { PRESETS, applyPreset, type PresetName };

/** The script tag build on jsDelivr, pinned to this version. */
export const CDN_URL = `https://cdn.jsdelivr.net/npm/cookieowl@${VERSION}/dist/cookieowl.js`;

/** The optional categories a generator offers. `necessary` is always on. */
export const OPTIONAL_CATEGORIES = ['preferences', 'analytics', 'marketing'] as const;

/** What a generator can set. Everything the script tag can express, and nothing else. */
export interface SnippetOptions {
  preset?: PresetName;
  /** A language code or `auto`. */
  lang?: string;
  template?: 'lgpd' | 'gdpr';
  policyUrl?: string;
  version?: string | number;
  /** Optional category ids to show. An empty list leaves only `necessary`. */
  categories?: string[];
  layout?: Layout;
  position?: Position;
  theme?: Theme;
  /** Accent color of the buttons and switches. */
  accent?: string;
  /** Texts for every language, for example `{ title: 'Cookies?' }`. Empty strings are skipped. */
  text?: Partial<Record<TextKey, string>>;
  /** `true` for basic mode, `'advanced'` for advanced mode. */
  consentMode?: boolean | 'advanced';
  autoBlock?: boolean;
  respectGPC?: boolean;
  respectDNT?: boolean;
  reopenButton?: boolean | 'left' | 'right';
  expiresDays?: number;
  storage?: 'cookie' | 'localStorage' | 'memory';
}

export interface ScriptTagOptions {
  /** Where the script is served from. Default `CDN_URL`. */
  src?: string;
}

const DEFAULT_CATS = OPTIONAL_CATEGORIES.join(',');

/** The language a choice resolves to, or null for `auto`. */
const fixedLang = (o: SnippetOptions, base: CookieOwlConfig) => {
  const l = o.lang ?? base.lang;
  return l && l !== 'auto' ? l : null;
};

/**
 * The configuration the generated snippet produces, with every default left
 * out. Pass it to `init()` (with `container` and `storage: 'memory'`) for a live
 * preview that matches the copied code exactly.
 */
export function snippetConfig(o: SnippetOptions): CookieOwlConfig {
  const c: CookieOwlConfig = {};
  // What the preset (or the library) uses when an option is left out.
  const base = applyPreset({ preset: o.preset });
  if (o.preset) c.preset = o.preset;
  if (o.accent?.trim()) c.accent = o.accent.trim();
  if (o.lang && o.lang !== (base.lang || 'auto')) c.lang = o.lang;
  const lang = fixedLang(o, base);
  const impliedTemplate = base.template || (lang ? (/^pt/i.test(lang) ? 'lgpd' : 'gdpr') : undefined);
  if (o.template && o.template !== impliedTemplate) c.template = o.template;
  if (o.policyUrl?.trim()) c.policyUrl = o.policyUrl.trim();
  if (o.version != null && String(o.version) !== '' && String(o.version) !== '1') c.version = String(o.version);
  if (o.categories) {
    const ids = o.categories.map((x) => x.trim()).filter((x) => x && x !== 'necessary');
    if (ids.join(',') !== DEFAULT_CATS) c.categories = ids.length ? ids : ['necessary'];
  }
  const layout = o.layout || 'box';
  if (layout !== 'box') c.layout = layout;
  if (o.position && o.position !== (layout === 'bar' ? 'bottom' : 'bottom-right')) c.position = o.position;
  if (o.theme && o.theme !== 'auto') c.theme = o.theme;
  if (o.expiresDays && o.expiresDays > 0 && o.expiresDays !== 365) c.expiresDays = Math.round(o.expiresDays);
  if (o.storage && o.storage !== 'cookie') c.storage = o.storage;
  if (o.consentMode !== undefined) {
    const on = Boolean(o.consentMode);
    const advanced = o.consentMode === 'advanced';
    if (on !== Boolean(base.consentMode) || advanced) c.consentMode = on && { advanced };
  }
  if (o.autoBlock !== undefined && o.autoBlock !== Boolean(base.autoBlock)) c.autoBlock = o.autoBlock;
  if (o.respectGPC === false) c.respectGPC = false;
  if (o.respectDNT) c.respectDNT = true;
  const r = o.reopenButton;
  if (r === false || r === 'right') c.reopenButton = r;
  const text: Partial<Record<TextKey, string>> = {};
  for (const [k, v] of Object.entries(o.text || {})) if (v?.trim()) text[k as TextKey] = v;
  if (Object.keys(text).length) c.text = text;
  return c;
}

// Line breaks become character references so the tag stays on one line.
const attr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '&#10;').replace(/\r/g, '&#13;');
const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** The `[name, value]` attributes of the script tag, `null` for a bare flag. Handy for custom highlighting. */
export function scriptAttributes(o: SnippetOptions): [string, string | null][] {
  const c = snippetConfig(o);
  const out: [string, string | null][] = [];
  const add = (name: string, v: string | null) => out.push([`data-${name}`, v]);
  for (const k of ['preset', 'lang', 'template', 'policyUrl', 'version', 'layout', 'position', 'theme', 'accent', 'storage'] as const) {
    if (c[k] !== undefined) add(kebab(k), String(c[k]));
  }
  if (c.categories) add('categories', c.categories.join(','));
  if (c.expiresDays) add('expires-days', String(c.expiresDays));
  if (c.consentMode !== undefined) add('consent-mode', c.consentMode === false ? 'false' : typeof c.consentMode === 'object' && c.consentMode.advanced ? 'advanced' : null);
  if (c.autoBlock !== undefined) add('auto-block', c.autoBlock ? null : 'false');
  if (c.respectGPC === false) add('gpc', 'false');
  if (c.respectDNT) add('dnt', null);
  if (c.reopenButton !== undefined) add('reopen', String(c.reopenButton));
  for (const [k, v] of Object.entries(c.text || {})) add(`text-${kebab(k)}`, String(v));
  return out;
}

/**
 * The one line to paste first in `<head>`, without async or defer, for example
 * `<script src="https://cdn.jsdelivr.net/npm/cookieowl@0.2.0/dist/cookieowl.js" data-preset="lgpd"></script>`.
 */
export function scriptTag(o: SnippetOptions, opts: ScriptTagOptions = {}): string {
  const attrs = scriptAttributes(o).map(([k, v]) => (v === null ? ` ${k}` : ` ${k}="${attr(v)}"`));
  return `<script src="${attr(opts.src || CDN_URL)}"${attrs.join('')}></script>`;
}

const js = (v: unknown): string => {
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/<\//g, '<\\/')}'`;
  if (Array.isArray(v)) return `[${v.map(js).join(', ')}]`;
  if (v && typeof v === 'object') {
    const parts = Object.entries(v).map(([k, x]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : js(k)}: ${js(x)}`);
    return parts.length ? `{ ${parts.join(', ')} }` : '{}';
  }
  return String(v);
};

/** The same setup for a bundler: `import { cookieowl } from 'cookieowl'` and one `init()` call. */
export function initCode(o: SnippetOptions): string {
  const c = snippetConfig(o) as Record<string, unknown>;
  // Basic Consent Mode reads better as `consentMode: true`.
  if (typeof c.consentMode === 'object' && !(c.consentMode as { advanced: boolean }).advanced) c.consentMode = true;
  const entries = Object.entries(c).map(([k, v]) => `${k}: ${js(v)}`);
  const one = `cookieowl.init({ ${entries.join(', ')} });`;
  const call = !entries.length ? 'cookieowl.init();' : one.length <= 80 ? one : `cookieowl.init({\n${entries.map((e) => `  ${e},`).join('\n')}\n});`;
  return `import { cookieowl } from 'cookieowl';\n\n${call}\n`;
}
