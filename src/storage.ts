// Reads and writes the consent record in a first party cookie, localStorage or memory,
// and erases tracker cookies when consent is withdrawn.
import type { ConsentRecord, CookieOptions } from './types';

export interface Store {
  read(): ConsentRecord | null;
  write(record: ConsentRecord, maxAgeSeconds: number): void;
  clear(): void;
}

function parse(raw: string | null | undefined): ConsentRecord | null {
  if (!raw) return null;
  try {
    const r = JSON.parse(raw) as ConsentRecord;
    if (!r || typeof r !== 'object' || typeof r.id !== 'string' || !r.categories || typeof r.categories !== 'object') return null;
    return r;
  } catch {
    return null;
  }
}

/** Reads one cookie by exact name. */
export function readCookie(name: string, doc: Document = document): string | null {
  for (const part of doc.cookie ? doc.cookie.split(';') : []) {
    const i = part.indexOf('=');
    if (part.slice(0, i).trim() === name) {
      try {
        return decodeURIComponent(part.slice(i + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function cookieStore(opts: CookieOptions = {}, doc: Document = document): Store {
  const name = opts.name || 'cookieowl';
  const attrs = (maxAge: number) => {
    let s = `; Path=${opts.path || '/'}; Max-Age=${maxAge}; SameSite=${opts.sameSite || 'Lax'}`;
    if (opts.domain) s += `; Domain=${opts.domain}`;
    if (opts.sameSite === 'None' || doc.location?.protocol === 'https:') s += '; Secure';
    return s;
  };
  return {
    read: () => parse(readCookie(name, doc)),
    write(record, maxAge) {
      doc.cookie = `${name}=${encodeURIComponent(JSON.stringify(record))}${attrs(Math.max(0, Math.round(maxAge)))}`;
    },
    clear() {
      doc.cookie = `${name}=${attrs(0)}`;
    },
  };
}

export function localStore(key = 'cookieowl', win: Window = window): Store {
  const ls = (): Storage | null => {
    try {
      return win.localStorage;
    } catch {
      return null;
    }
  };
  return {
    read: () => parse(ls()?.getItem(key)),
    write(record) {
      try {
        ls()?.setItem(key, JSON.stringify(record));
      } catch {
        // storage full or blocked: the choice still applies for this page view
      }
    },
    clear() {
      try {
        ls()?.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
}

export function memoryStore(): Store {
  let saved: string | null = null;
  return {
    read: () => parse(saved),
    write(record) {
      saved = JSON.stringify(record);
    },
    clear() {
      saved = null;
    },
  };
}

/** True when a cookie name matches an exact name, a `prefix*` or a regular expression. */
export function cookieMatches(name: string, pattern: string | RegExp): boolean {
  if (pattern instanceof RegExp) return pattern.test(name);
  return pattern.endsWith('*') ? name.startsWith(pattern.slice(0, -1)) : name === pattern;
}

/**
 * Erases every cookie matching one of the patterns, on the current host and each
 * parent domain (trackers often set cookies on `.example.com`). Returns the names erased.
 */
export function eraseCookies(patterns: (string | RegExp)[], doc: Document = document): string[] {
  if (!patterns.length || !doc.cookie) return [];
  const host = doc.location?.hostname || '';
  const parts = host.split('.');
  const domains: (string | null)[] = [null];
  for (let i = 0; i < parts.length - 1; i++) domains.push(parts.slice(i).join('.'));
  const erased: string[] = [];
  for (const part of doc.cookie.split(';')) {
    const name = part.split('=')[0]!.trim();
    if (!name || !patterns.some((p) => cookieMatches(name, p))) continue;
    for (const d of domains) {
      for (const path of ['/', doc.location?.pathname || '/']) {
        doc.cookie = `${name}=; Path=${path}; Max-Age=0${d ? `; Domain=${d}` : ''}`;
      }
    }
    erased.push(name);
  }
  return erased;
}

/**
 * A random consent id: a UUID where available, otherwise 32 random hex digits.
 * Very old browsers and Node 18 without the global Web Crypto object fall back
 * to Math.random, which is fine for an audit id (it is not a secret).
 */
export function uuid(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  const bytes = new Uint8Array(16);
  if (c && typeof c.getRandomValues === 'function') c.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return [...bytes].map((x) => x.toString(16).padStart(2, '0')).join('');
}
