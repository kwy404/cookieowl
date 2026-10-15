// The script tag build (dist/cookieowl.js). Load it first, synchronously, in
// <head>, before any tracker:
//   <script src="https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js"
//     data-preset="lgpd" data-policy-url="/privacidade" data-accent="#2f6fed"></script>
// Options come from window.cookieowlConfig (set before the tag) and the data
// attributes, which win. Add data-manual to skip the automatic init.
import { CookieOwl, TRACKERS, VERSION, cookieowl, createCookieOwl } from './index';
import type { CookieOwlConfig } from './types';

type Win = Window & { cookieowl?: CookieOwl; CookieOwl?: unknown; cookieowlConfig?: CookieOwlConfig };

/** Reads the configuration from the data attributes of a script tag. */
export function configFromScript(el: HTMLOrSVGScriptElement | null): CookieOwlConfig {
  const c: Record<string, unknown> = {};
  const d: DOMStringMap = el ? (el as HTMLElement).dataset : {};
  // Only called for attributes that are present: `data-x` and `data-x="true"` are on.
  const flag = (v: string) => v !== 'false';
  for (const k of ['preset', 'accent', 'lang', 'template', 'layout', 'position', 'theme', 'dir', 'policyUrl', 'version', 'storage', 'container']) {
    if (d[k]) c[k] = d[k];
  }
  if (d.categories) c.categories = d.categories.split(/[\s,]+/).filter(Boolean);
  if (Number(d.expiresDays) > 0) c.expiresDays = Number(d.expiresDays);
  const cm = d.consentMode;
  if (cm != null) c.consentMode = flag(cm) && { advanced: cm === 'advanced' };
  if (d.autoBlock != null) c.autoBlock = flag(d.autoBlock);
  if (d.gpc != null) c.respectGPC = flag(d.gpc);
  if (d.dnt != null) c.respectDNT = flag(d.dnt);
  const r = d.reopen;
  if (r != null) c.reopenButton = r === 'right' || r === 'left' ? r : flag(r);
  // data-text-accept-all="OK" (dataset key textAcceptAll) overrides the acceptAll text.
  for (const k in d) {
    if (/^text./.test(k) && d[k]) ((c.text as Record<string, string>) ||= {})[k[4]!.toLowerCase() + k.slice(5)] = d[k]!;
  }
  return c as CookieOwlConfig;
}

const w = window as Win;
const script = document.currentScript;
w.cookieowl = cookieowl;
w.CookieOwl = { CookieOwl, createCookieOwl, TRACKERS, VERSION };
if (!(script as HTMLElement | null)?.hasAttribute('data-manual')) {
  const fromAttrs = configFromScript(script);
  const base = w.cookieowlConfig || {};
  const cm = fromAttrs.consentMode;
  cookieowl.init({
    ...base,
    ...fromAttrs,
    ...(cm && typeof base.consentMode === 'object' && typeof cm === 'object' ? { consentMode: { ...base.consentMode, ...cm } } : {}),
  });
}
