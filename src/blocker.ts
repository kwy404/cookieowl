// Keeps scripts and embeds inert until their category is accepted.
//
// Manual markup (always on):
//   <script type="text/plain" data-cookieowl="analytics" src="..."></script>
//   <iframe data-cookieowl="marketing" data-cookieowl-src="..."></iframe>
// Released elements run in document order: each external script finishes
// loading before the next one is inserted, as if the page had them from the start.
//
// Auto mode: a MutationObserver changes the type of parser inserted tracker
// scripts before they run (the parser performs a microtask checkpoint before
// preparing a script, which delivers the mutation records first), and a hooked
// document.createElement catches trackers that snippets inject at runtime.
import type { TrackerPattern } from './types';

export const ATTR = 'data-cookieowl';
const SRC = `${ATTR}-src`;
const TYPE = `${ATTR}-type`;
const AUTO = `${ATTR}-auto`;
const DONE = `${ATTR}-done`;
const BLOCKED = 'text/plain';

export interface BlockerOptions {
  /** Trackers to recognize; null disables auto mode. */
  trackers: TrackerPattern[] | null;
  /** Category accepted check. */
  allowed: (categories: string[]) => boolean;
  /** Builds the click to load placeholder for a blocked embed. */
  placeholder?: (iframe: HTMLIFrameElement, info: { name: string; category: string }) => HTMLElement;
}

/** Categories required by an element: `data-cookieowl="analytics marketing"` needs both. */
export function categoriesOf(el: Element): string[] {
  return (el.getAttribute(ATTR) || '').split(/[\s,]+/).filter(Boolean);
}

// Read lazily so the module can be imported during server rendering.
const nativeSetAttribute = {
  call: (el: Element, name: string, value: string) => Element.prototype.setAttribute.call(el, name, value),
};

export class Blocker {
  /** Categories whose scripts ran on this page view. */
  readonly ran = new Set<string>();
  private observer: MutationObserver | null = null;
  private queue: Promise<void> = Promise.resolve();
  private placeholders = new WeakMap<Element, HTMLElement>();
  private restoreCreate: (() => void) | null = null;
  private onBeforeExecute = (e: Event) => {
    const s = e.target as HTMLScriptElement;
    if (s.type === BLOCKED || this.block(s, s.src)) e.preventDefault();
  };

  constructor(
    private doc: Document,
    private opts: BlockerOptions,
  ) {}

  /** Finds the tracker an absolute or relative URL belongs to. */
  match(url: string | null | undefined): TrackerPattern | null {
    if (!url || !this.opts.trackers) return null;
    let abs = url;
    try {
      abs = new URL(url, this.doc.baseURI).href;
    } catch {
      // keep the raw value
    }
    return this.opts.trackers.find((t) => t.match.test(abs)) || null;
  }

  start(): void {
    if (this.observer) return;
    const MO = this.doc.defaultView?.MutationObserver || MutationObserver;
    this.observer = new MO((records) => {
      let release = false;
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          const el = n as Element;
          const found = [el, ...el.querySelectorAll('script,iframe,[data-cookieowl]')];
          for (const x of found) if (this.visit(x)) release = true;
        });
      }
      if (release) void this.release();
    });
    this.observer.observe(this.doc.documentElement, { childList: true, subtree: true });
    if (this.opts.trackers) {
      this.hookCreate();
      this.doc.addEventListener('beforescriptexecute', this.onBeforeExecute, true);
    }
    // Embeds that were parsed before cookieowl started.
    this.doc.querySelectorAll('iframe').forEach((f) => this.visit(f));
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.restoreCreate?.();
    this.restoreCreate = null;
    this.doc.removeEventListener('beforescriptexecute', this.onBeforeExecute, true);
  }

  /** Neutralizes an auto detected tracker; returns true when the element can be released now. */
  private visit(el: Element): boolean {
    if (el.hasAttribute(DONE)) return false;
    const tag = el.tagName;
    if (this.opts.trackers && !el.hasAttribute(ATTR)) {
      if (tag === 'SCRIPT') {
        const s = el as HTMLScriptElement;
        if (s.type !== BLOCKED && this.block(s, s.getAttribute('src'))) return false;
      } else if (tag === 'IFRAME') {
        const f = el as HTMLIFrameElement;
        const src = f.getAttribute('src');
        const t = this.match(src);
        if (t && t.kind === 'embed' && !this.opts.allowed([t.category])) {
          this.mark(f, t);
          nativeSetAttribute.call(f, SRC, src!);
          nativeSetAttribute.call(f, 'src', 'about:blank');
        }
      }
    }
    if (tag === 'IFRAME' && el.hasAttribute(SRC) && !this.placeholders.has(el)) this.addPlaceholder(el as HTMLIFrameElement);
    return el.hasAttribute(ATTR) && this.opts.allowed(categoriesOf(el));
  }

  private mark(el: Element, t: TrackerPattern): void {
    nativeSetAttribute.call(el, ATTR, t.category);
    nativeSetAttribute.call(el, AUTO, t.id);
  }

  /** Turns a tracker script into an inert one. Returns true when it was blocked. */
  private block(s: HTMLScriptElement, url: string | null): boolean {
    const t = this.match(url);
    if (!t || t.kind === 'embed' || this.opts.allowed([t.category])) return false;
    const type = s.getAttribute('type');
    if (type && type !== BLOCKED && !s.hasAttribute(TYPE)) nativeSetAttribute.call(s, TYPE, type);
    nativeSetAttribute.call(s, 'type', BLOCKED);
    this.mark(s, t);
    return true;
  }

  private addPlaceholder(f: HTMLIFrameElement): void {
    const cats = categoriesOf(f);
    if (!this.opts.placeholder || !cats.length || this.opts.allowed(cats)) return;
    const auto = this.opts.trackers?.find((x) => x.id === f.getAttribute(AUTO));
    let name = f.getAttribute(`${ATTR}-name`) || auto?.name;
    if (!name) {
      try {
        name = new URL(f.getAttribute(SRC)!, this.doc.baseURI).hostname.replace(/^www\./, '');
      } catch {
        name = f.title || 'Embed';
      }
    }
    const ph = this.opts.placeholder(f, { name, category: cats.join(' ') });
    this.placeholders.set(f, ph);
    f.hidden = true;
    f.parentNode?.insertBefore(ph, f);
  }

  /** Hooks document.createElement so injected tracker scripts and embeds are created inert. */
  private hookCreate(): void {
    const doc = this.doc;
    const win = doc.defaultView;
    if (!win) return;
    const original = doc.createElement;
    const hadOwn = Object.prototype.hasOwnProperty.call(doc, 'createElement');
    const scriptSrc = Object.getOwnPropertyDescriptor(win.HTMLScriptElement.prototype, 'src')!;
    const frameSrc = Object.getOwnPropertyDescriptor(win.HTMLIFrameElement.prototype, 'src')!;
    // Returns true when the native src should not be set.
    const check = (el: HTMLElement, url: string): boolean => {
      if (el.tagName === 'SCRIPT') {
        this.block(el as HTMLScriptElement, url);
        return false;
      }
      const t = this.match(url);
      if (!t || t.kind !== 'embed' || this.opts.allowed([t.category])) return false;
      this.mark(el, t);
      nativeSetAttribute.call(el, SRC, url);
      return true;
    };
    doc.createElement = function createElement(this: Document, tag: string, options?: ElementCreationOptions) {
      const el = original.call(this, tag, options);
      const name = el.tagName;
      if (name !== 'SCRIPT' && name !== 'IFRAME') return el;
      const desc = name === 'SCRIPT' ? scriptSrc : frameSrc;
      Object.defineProperty(el, 'src', {
        configurable: true,
        get: () => desc.get!.call(el),
        set: (v: string) => {
          if (!check(el, String(v))) desc.set!.call(el, v);
        },
      });
      el.setAttribute = function setAttribute(n: string, v: string) {
        if (n.toLowerCase() !== 'src' || !check(el, String(v))) nativeSetAttribute.call(el, n, v);
      };
      return el;
    } as typeof doc.createElement;
    this.restoreCreate = () => {
      if (hadOwn) doc.createElement = original;
      else delete (doc as { createElement?: unknown }).createElement;
    };
  }

  /** Activates every element whose categories are now accepted, in document order. */
  release(): Promise<void> {
    this.queue = this.queue.then(() => this.run()).catch(() => undefined);
    return this.queue;
  }

  private async run(): Promise<void> {
    const els = [...this.doc.querySelectorAll(`[${ATTR}]:not([${DONE}])`)].filter((el) => this.opts.allowed(categoriesOf(el)));
    for (const el of els) {
      if (!el.isConnected || el.hasAttribute(DONE)) continue;
      nativeSetAttribute.call(el, DONE, '');
      for (const c of categoriesOf(el)) this.ran.add(c);
      if (el.tagName === 'SCRIPT') await this.exec(el as HTMLScriptElement);
      else this.reveal(el);
    }
  }

  /** Shows a blocked embed or element. `once` loads it without consent, for this page view only. */
  reveal(el: Element): void {
    const src = el.getAttribute(SRC);
    if (src !== null) {
      nativeSetAttribute.call(el, 'src', src);
      el.removeAttribute(SRC);
    }
    const ph = this.placeholders.get(el);
    if (ph) {
      ph.remove();
      this.placeholders.delete(el);
      (el as HTMLElement).hidden = false;
    }
  }

  /** Loads one blocked embed now, without recording consent. */
  loadOnce(el: Element): void {
    nativeSetAttribute.call(el, DONE, '');
    this.reveal(el);
  }

  private exec(old: HTMLScriptElement): Promise<void> {
    const doc = this.doc;
    const s = doc.createElement('script');
    for (const a of [...old.attributes]) {
      if (a.name !== 'type' && a.name !== TYPE && a.name !== SRC && a.name !== 'src') nativeSetAttribute.call(s, a.name, a.value);
    }
    const type = old.getAttribute(TYPE);
    if (type) s.type = type;
    const src = old.getAttribute(SRC) || old.getAttribute('src');
    let done: Promise<void> = Promise.resolve();
    if (src) {
      // Markup scripts wait for each other so the next one sees what this one
      // defined. Async ones, and scripts a snippet created (async by default),
      // do not hold the queue.
      if (!old.async && !old.hasAttribute('async')) {
        s.async = false;
        done = new Promise((resolve) => {
          s.addEventListener('load', () => resolve(), { once: true });
          s.addEventListener('error', () => resolve(), { once: true });
        });
      }
      s.src = src;
    } else {
      s.text = old.text;
    }
    old.replaceWith(s);
    return done;
  }
}
