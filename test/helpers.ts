import { afterEach } from 'vitest';
import { CookieOwl } from '../src/core';
import type { CookieOwlConfig } from '../src/types';

type W = Window & { dataLayer?: unknown[]; gtag?: unknown; __order?: unknown[]; __ran?: Record<string, number> };
export const win = window as W;

const live: CookieOwl[] = [];

/** A fresh instance that is destroyed after the test. */
export function owl(config: CookieOwlConfig = {}): CookieOwl {
  const o = new CookieOwl();
  live.push(o);
  return o.init(config);
}

export function clearCookies(): void {
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]!.trim();
    if (!name) continue;
    for (const d of ['', '; Domain=shop.example.com', '; Domain=example.com']) {
      document.cookie = `${name}=; Path=/; Max-Age=0${d}`;
      document.cookie = `${name}=; Path=/products; Max-Age=0${d}`;
    }
  }
}

export const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];
export const click = (sel: string) => {
  const el = $(sel);
  if (!el) throw new Error(`no element ${sel}`);
  el.click();
};
export const tick = () => new Promise((r) => setTimeout(r, 0));
export const flush = async () => {
  for (let i = 0; i < 5; i++) await tick();
};

/** Arguments objects pushed by gtag, as plain arrays. */
export const gtagCalls = () => (win.dataLayer || []).filter((x) => !Array.isArray(x) && typeof x === 'object' && x !== null && 'length' in (x as object)).map((x) => Array.from(x as ArrayLike<unknown>));

afterEach(() => {
  while (live.length) live.pop()!.destroy();
  clearCookies();
  localStorage.clear();
  document.body.innerHTML = '';
  for (const k of Object.keys(document.body.dataset)) delete document.body.dataset[k];
  document.head.querySelectorAll('[data-test]').forEach((n) => n.remove());
  document.documentElement.removeAttribute('lang');
  document.documentElement.removeAttribute('dir');
  document.documentElement.removeAttribute('data-theme');
  delete win.dataLayer;
  delete win.gtag;
  delete win.__order;
  delete win.__ran;
});
