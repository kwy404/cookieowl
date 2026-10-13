// The script tag build (dist/cookieowl.js). Load it first, synchronously, in
// <head>, before any tracker:
//   <script src="https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js"
//     data-lang="pt-BR" data-policy-url="/privacidade" data-consent-mode data-auto-block></script>
// Options come from window.cookieowlConfig (set before the tag) and the data
// attributes, which win. Add data-manual to skip the automatic init.
import { CookieOwl, TRACKERS, VERSION, cookieowl, createCookieOwl } from './index';
import type { CookieOwlConfig } from './types';

type Win = Window & { cookieowl?: CookieOwl; CookieOwl?: unknown; cookieowlConfig?: CookieOwlConfig };

/** Reads the configuration from the data attributes of a script tag. */
export function configFromScript(el: HTMLOrSVGScriptElement | null): CookieOwlConfig {
  const c: Record<string, unknown> = {};
  if (!el) return c;
  const d = (el as HTMLElement).dataset;
  const flag = (v: string | undefined) => v !== undefined && v !== 'false';
  for (const k of ['lang', 'template', 'layout', 'position', 'theme', 'dir', 'policyUrl', 'version', 'storage', 'container'] as const) {
    if (d[k] !== undefined && d[k] !== '') c[k] = d[k];
  }
  if (d.categories) c.categories = d.categories.split(/[\s,]+/).filter(Boolean);
  if (Number(d.expiresDays) > 0) c.expiresDays = Number(d.expiresDays);
  if (d.consentMode !== undefined) c.consentMode = flag(d.consentMode) && { advanced: d.consentMode === 'advanced' };
  if (d.autoBlock !== undefined) c.autoBlock = flag(d.autoBlock);
  if (d.gpc !== undefined) c.respectGPC = flag(d.gpc);
  if (d.dnt !== undefined) c.respectDNT = flag(d.dnt);
  if (d.reopen !== undefined) c.reopenButton = d.reopen === 'right' || d.reopen === 'left' ? d.reopen : flag(d.reopen);
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
