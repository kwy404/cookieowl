// Thin React helpers. React is an optional peer dependency.
import { createElement, Fragment, useEffect, useState, type ReactNode } from 'react';
import { cookieowl as shared, type CookieOwl } from './index';
import type { ChangeDetail } from './types';

/**
 * Re-renders when consent changes. With a category, returns whether it is
 * accepted; without one, returns the map of every category.
 */
export function useConsent(category: string | string[], owl?: CookieOwl): boolean;
export function useConsent(category?: undefined, owl?: CookieOwl): Record<string, boolean>;
export function useConsent(category?: string | string[], owl: CookieOwl = shared): boolean | Record<string, boolean> {
  const read = () => (category === undefined ? stateOf(owl) : owl.accepted(category));
  const [value, setValue] = useState(read);
  const key = Array.isArray(category) ? category.join(' ') : category;
  useEffect(() => {
    setValue(read());
    const update = (d: ChangeDetail) => setValue(category === undefined ? { ...d.categories } : owl.accepted(category));
    const offChange = owl.on('change', update);
    const offReady = owl.on('ready', update);
    return () => {
      offChange();
      offReady();
    };
  }, [owl, key]);
  return value;
}

function stateOf(owl: CookieOwl): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const c of owl.categories()) out[c.id] = owl.accepted(c.id);
  return out;
}

export interface ConsentGateProps {
  /** One category or several that must all be accepted. */
  category: string | string[];
  children?: ReactNode;
  /** Rendered while the category is not accepted. */
  fallback?: ReactNode;
  owl?: CookieOwl;
}

/** Renders its children only after the category is accepted. */
export function ConsentGate({ category, children, fallback = null, owl = shared }: ConsentGateProps) {
  const ok = useConsent(category, owl);
  return createElement(Fragment, null, ok ? children : fallback);
}

/** Returns the shared instance, for calling showPreferences() and friends. */
export function useCookieOwl(owl: CookieOwl = shared): CookieOwl {
  return owl;
}
