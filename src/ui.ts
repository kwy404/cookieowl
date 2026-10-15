// The banner, the preferences dialog, the reopen button and the embed
// placeholder. Built with DOM calls only (never innerHTML with text), so
// configured text cannot inject markup.
import { CSS } from './styles';
import type { Layout, Position, ResolvedCategory, ServiceInfo, Texts, Theme } from './types';

type Child = Node | string | null | undefined | false;
type Props = Record<string, unknown>;

export function h(doc: Document, tag: string, props?: Props | null, ...kids: (Child | Child[])[]): HTMLElement {
  const el = doc.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v as EventListener);
    else if (k === 'class') el.className = String(v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid);
  return el;
}

const NS = 'http://www.w3.org/2000/svg';
/** Builds an icon from trusted, static path data. */
function icon(doc: Document, view: string, shapes: [string, Record<string, string>][]): SVGSVGElement {
  const svg = doc.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', view);
  svg.setAttribute('aria-hidden', 'true');
  for (const [tag, attrs] of shapes) {
    const s = doc.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
    svg.append(s);
  }
  return svg;
}

const owl = (doc: Document) =>
  icon(doc, '0 0 32 32', [
    ['path', { d: 'M6 9 9 3l4 4h6l4-4 3 6v11c0 6-4.5 10-10 10S6 26 6 20Z', fill: '#1b2547' }],
    ['circle', { cx: '11.5', cy: '15', r: '4.6', fill: '#fff' }],
    ['circle', { cx: '20.5', cy: '15', r: '4.6', fill: '#fff' }],
    ['circle', { cx: '12', cy: '15.4', r: '2.2', fill: '#1b2547' }],
    ['circle', { cx: '20', cy: '15.4', r: '2.2', fill: '#1b2547' }],
    ['path', { d: 'm14.6 20 1.4 2.2 1.4-2.2Z', fill: '#f2b134' }],
    ['circle', { cx: '24', cy: '25', r: '5', fill: '#f2b134' }],
    ['circle', { cx: '22.4', cy: '24', r: '.9', fill: '#8a4b14' }],
    ['circle', { cx: '25.4', cy: '26.4', r: '.9', fill: '#8a4b14' }],
  ]);
const line = (doc: Document, d: string) => icon(doc, '0 0 24 24', [['path', { d, stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', fill: 'none' }]]);

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Focusable elements inside a container, skipping hidden ones. */
export function focusables(root: Element): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => !el.closest('[hidden]'));
}

/** Keeps Tab and Shift Tab inside a modal container. */
export function trapFocus(root: HTMLElement, e: KeyboardEvent): void {
  if (e.key !== 'Tab') return;
  const items = focusables(root);
  const doc = root.ownerDocument;
  if (!items.length) {
    e.preventDefault();
    return;
  }
  const first = items[0]!;
  const last = items[items.length - 1]!;
  const active = doc.activeElement;
  const outside = active === root || !root.contains(active);
  if (e.shiftKey && (active === first || outside)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (active === last || outside)) {
    e.preventDefault();
    first.focus();
  }
}

export interface UIHost {
  texts(): Texts;
  lang(): string;
  categories(): ResolvedCategory[];
  state(): Record<string, boolean>;
  hasChoice(): boolean;
  signal(): boolean;
  policyUrl(): string | undefined;
  acceptAll(): void;
  rejectAll(): void;
  save(choices: Record<string, boolean>): void;
  shown(what: 'banner' | 'preferences', open: boolean): void;
  pick(text: unknown): string;
}

export interface UIOptions {
  layout: Layout;
  position: Position;
  theme: Theme;
  accent?: string;
  dir: 'auto' | 'ltr' | 'rtl';
  reopen: false | 'left' | 'right';
  container: HTMLElement | null;
}

let uid = 0;

export class UI {
  root: HTMLElement | null = null;
  banner: HTMLElement | null = null;
  prefs: HTMLElement | null = null;
  reopenBtn: HTMLElement | null = null;
  private live: HTMLElement | null = null;
  private returnFocus: HTMLElement | null = null;
  private id = `cko${++uid}`;

  constructor(
    private doc: Document,
    private host: UIHost,
    private opts: UIOptions,
  ) {}

  /** The .cko wrapper, painted with the accent color when one is set. */
  private wrap(props: Props, ...kids: Child[]): HTMLElement {
    const el = this.el('div', { ...props, 'data-cko-theme': this.opts.theme, lang: this.host.lang() }, ...kids);
    el.style.setProperty('--seed', this.opts.accent || null);
    return el;
  }

  private el = (tag: string, props?: Props | null, ...kids: (Child | Child[])[]) => h(this.doc, tag, props, ...kids);

  /** Injects the stylesheet once per document. */
  static styles(doc: Document): void {
    if (doc.getElementById('cookieowl-css')) return;
    const style = doc.createElement('style');
    style.id = 'cookieowl-css';
    style.textContent = CSS;
    (doc.head || doc.documentElement).append(style);
  }

  mount(): HTMLElement {
    if (this.root?.isConnected) return this.root;
    UI.styles(this.doc);
    const dir = this.opts.dir === 'auto' ? this.doc.documentElement.getAttribute('dir') || 'ltr' : this.opts.dir;
    const c = this.opts.container;
    this.live = this.el('div', { class: 'cko-sr', 'aria-live': 'polite', role: 'status' });
    this.root = this.wrap({ class: `cko${c ? ' cko-in' : ''}`, id: this.id, dir }, this.live);
    if (c && /^(static)?$/.test(this.doc.defaultView?.getComputedStyle(c).position || '')) c.style.position = 'relative';
    (c || this.doc.body).append(this.root);
    return this.root;
  }

  unmount(): void {
    this.root?.remove();
    this.root = this.banner = this.prefs = this.reopenBtn = null;
  }

  announce(msg: string): void {
    if (!this.live) return;
    this.live.textContent = '';
    // A separate task so screen readers notice the change.
    setTimeout(() => {
      if (this.live) this.live.textContent = msg;
    }, 50);
  }

  /** The policy sentence with its link, or nothing when no policyUrl is set. */
  private policyNodes(t: Texts): (Node | string)[] {
    const url = this.host.policyUrl();
    if (!url) return [];
    const [before = '', after = ''] = t.policySentence.split('{policy}');
    return [' ', before, this.el('a', { href: url }, t.policyLink), after];
  }

  private actions(t: Texts, extra?: HTMLElement): HTMLElement {
    // Reject and Accept share one style and size: neither is easier to press.
    return this.el(
      'div',
      { class: 'cko-acts' },
      this.el('button', { type: 'button', class: 'cko-btn', 'data-cko': 'reject', onclick: () => this.host.rejectAll() }, t.rejectAll),
      this.el('button', { type: 'button', class: 'cko-btn', 'data-cko': 'accept', onclick: () => this.host.acceptAll() }, t.acceptAll),
      extra,
    );
  }

  showBanner(): void {
    if (this.banner) return;
    const root = this.mount();
    const t = this.host.texts();
    const { layout, position } = this.opts;
    const modal = layout === 'modal';
    const tid = `${this.id}-t`;
    const did = `${this.id}-d`;
    const card = this.el(
      'div',
      {
        class: `cko-${layout} cko-${position}`,
        role: 'dialog',
        'aria-modal': modal ? 'true' : 'false',
        'aria-labelledby': tid,
        'aria-describedby': did,
        tabindex: '-1',
      },
      this.el(
        'div',
        { class: 'cko-in2' },
        this.el('div', { class: 'cko-text' }, this.el('h2', { class: 'cko-title', id: tid }, owl(this.doc), t.title), this.el('p', { id: did }, t.description, ...this.policyNodes(t))),
        this.actions(t, this.el('button', { type: 'button', class: 'cko-btn cko-ghost', 'data-cko': 'customize', onclick: () => this.showPrefs() }, t.customize)),
      ),
    );
    this.banner = modal ? this.el('div', { class: 'cko-veil', onkeydown: (e: KeyboardEvent) => trapFocus(card, e) }, card) : card;
    root.append(this.banner);
    this.reopenBtn?.setAttribute('hidden', '');
    if (modal) {
      this.returnFocus = this.doc.activeElement as HTMLElement | null;
      card.focus();
    }
    this.host.shown('banner', true);
  }

  hideBanner(): void {
    if (!this.banner) return;
    this.banner.remove();
    this.banner = null;
    this.host.shown('banner', false);
    this.syncReopen();
  }

  private serviceBlock(s: ServiceInfo, t: Texts): HTMLElement {
    const pick = (x: unknown) => this.host.pick(x);
    const rows = (s.cookies || []).map((c) =>
      this.el('tr', null, this.el('td', null, String(c.name instanceof RegExp ? c.name.source : c.name)), this.el('td', null, pick(c.duration)), this.el('td', null, pick(c.description))),
    );
    return this.el(
      'div',
      { class: 'cko-svc' },
      this.el('b', null, s.name),
      s.provider ? ` (${s.provider})` : '',
      s.description ? this.el('p', null, pick(s.description)) : null,
      s.policyUrl ? this.el('p', null, this.el('a', { href: s.policyUrl, target: '_blank', rel: 'noopener' }, t.policy)) : null,
      rows.length
        ? this.el(
            'table',
            null,
            this.el('thead', null, this.el('tr', null, this.el('th', { scope: 'col' }, t.cookies), this.el('th', { scope: 'col' }, t.duration), this.el('th', { scope: 'col' }, ''))),
            this.el('tbody', null, rows),
          )
        : null,
    );
  }

  showPrefs(): void {
    if (this.prefs) return;
    const root = this.mount();
    const t = this.host.texts();
    const state = this.host.state();
    const known = this.host.hasChoice();
    if (!this.returnFocus || !root.contains(this.doc.activeElement)) this.returnFocus = this.doc.activeElement as HTMLElement | null;
    const tid = `${this.id}-pt`;
    const items = this.host.categories().map((c) => {
      const did = `${this.id}-c-${c.id}`;
      const control = c.required
        ? this.el('span', { class: 'cko-always' }, t.alwaysOn)
        : this.el('input', {
            type: 'checkbox',
            role: 'switch',
            class: 'cko-sw',
            name: c.id,
            'aria-label': c.label,
            // No pre-ticked boxes: a category is on only after the visitor chose it.
            checked: known && state[c.id] === true,
          });
      const detail = this.el(
        'div',
        { class: 'cko-detail', id: did, hidden: true },
        this.el('p', null, c.description),
        c.services.map((s) => this.serviceBlock(s, t)),
      );
      const more = this.el('button', { type: 'button', class: 'cko-more', 'aria-expanded': 'false', 'aria-controls': did }, line(this.doc, 'm6 9 6 6 6-6'), c.label);
      more.addEventListener('click', () => {
        const open = more.getAttribute('aria-expanded') !== 'true';
        more.setAttribute('aria-expanded', String(open));
        detail.hidden = !open;
      });
      return this.el('li', { class: 'cko-cat', 'data-category': c.id }, this.el('div', { class: 'cko-row' }, more, control), detail);
    });
    const dialog = this.el(
      'div',
      { class: 'cko-prefs', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': tid, tabindex: '-1' },
      this.el('div', { class: 'cko-head' }, this.el('h2', { class: 'cko-title', id: tid }, owl(this.doc), t.prefsTitle), this.el('button', { type: 'button', class: 'cko-x', 'aria-label': t.close, onclick: () => this.hidePrefs() }, line(this.doc, 'M6 6l12 12M18 6 6 18'))),
      this.el(
        'div',
        { class: 'cko-body' },
        this.el('p', { class: 'cko-lead' }, t.prefsDescription, ...this.policyNodes(t)),
        this.host.signal() ? this.el('p', { class: 'cko-note' }, t.signal) : null,
        this.el('ul', { class: 'cko-cats' }, items),
      ),
      this.el(
        'div',
        { class: 'cko-foot' },
        this.actions(t, this.el('button', { type: 'button', class: 'cko-btn cko-ghost', 'data-cko': 'save', onclick: () => this.host.save(this.choices()) }, t.save)),
      ),
    );
    this.prefs = this.el(
      'div',
      {
        class: 'cko-veil',
        onkeydown: (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            this.hidePrefs();
          } else trapFocus(dialog, e);
        },
      },
      dialog,
    );
    if (this.banner) this.banner.hidden = true;
    this.reopenBtn?.setAttribute('hidden', '');
    root.append(this.prefs);
    // Focus lands on the dialog itself so its title is read first.
    dialog.focus();
    this.host.shown('preferences', true);
  }

  /** Current switch states in the open dialog. */
  choices(): Record<string, boolean> {
    const out: Record<string, boolean> = {};
    this.prefs?.querySelectorAll<HTMLInputElement>('input.cko-sw').forEach((i) => (out[i.name] = i.checked));
    return out;
  }

  hidePrefs(): void {
    if (!this.prefs) return;
    this.prefs.remove();
    this.prefs = null;
    if (this.banner) {
      this.banner.hidden = false;
      const card = this.banner.matches('.cko-veil') ? (this.banner.firstElementChild as HTMLElement) : this.banner;
      (card.querySelector('[data-cko=customize]') as HTMLElement | null)?.focus();
    } else {
      const back = this.returnFocus;
      this.returnFocus = null;
      if (back?.isConnected && back !== this.doc.body) back.focus();
      else this.reopenBtn?.focus();
    }
    this.host.shown('preferences', false);
    this.syncReopen();
  }

  /** Shows the floating reopen button while no banner or dialog is open. */
  syncReopen(): void {
    if (!this.opts.reopen || !this.root) return;
    if (!this.reopenBtn) {
      const t = this.host.texts();
      this.reopenBtn = this.el(
        'button',
        { type: 'button', class: `cko-reopen${this.opts.reopen === 'right' ? ' cko-right' : ''}`, 'aria-label': t.reopen, title: t.reopen, 'data-cko': 'reopen', onclick: () => this.showPrefs() },
        owl(this.doc),
      );
      this.root.append(this.reopenBtn);
    }
    this.reopenBtn.hidden = Boolean(this.banner || this.prefs);
  }

  /** The click to load placeholder shown in place of a blocked embed. */
  placeholder(iframe: HTMLIFrameElement, name: string, onOnce: () => void, onAllow: () => void): HTMLElement {
    UI.styles(this.doc);
    const t = this.host.texts();
    const w = iframe.getAttribute('width');
    const hgt = iframe.getAttribute('height');
    const title = t.embedTitle.replace('{name}', name);
    const box = this.el(
      'div',
      { class: 'cko-embed', role: 'group', 'aria-label': title },
      this.el('strong', null, title),
      this.el('p', null, t.embedText),
      this.el(
        'div',
        { class: 'cko-acts' },
        this.el('button', { type: 'button', class: 'cko-btn', 'data-cko': 'once', onclick: onOnce }, t.loadOnce),
        this.el('button', { type: 'button', class: 'cko-btn cko-ghost', 'data-cko': 'allow', onclick: onAllow }, t.allowAlways),
      ),
    );
    const wrap = this.wrap({ class: 'cko' }, box);
    // display: contents on .cko keeps the placeholder in the flow of the page.
    if (w && /^\d+$/.test(w)) box.style.width = `${w}px`;
    if (w && hgt && /^\d+$/.test(w) && /^\d+$/.test(hgt)) box.style.aspectRatio = `${w} / ${hgt}`;
    else box.style.minHeight = '200px';
    return wrap;
  }
}
