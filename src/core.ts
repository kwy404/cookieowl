// The consent engine: resolves the configuration, keeps the record, drives
// Google Consent Mode, the blocker and the UI, and emits events.
import { Blocker } from './blocker';
import { normalizeConsentMode, pushEvent, sendDefaults, sendUpdate } from './consent-mode';
import { LANGS, detectLang, matchLang } from './i18n';
import { cookieStore, eraseCookies, localStore, memoryStore, uuid, type Store } from './storage';
import { TRACKERS } from './trackers';
import type {
  AutoBlockConfig,
  CategoryConfig,
  ChangeDetail,
  ConsentMethod,
  ConsentRecord,
  CookieOwlConfig,
  EventMap,
  Layout,
  Position,
  ResolvedCategory,
  Text,
  Texts,
  TrackerPattern,
} from './types';
import { UI } from './ui';

declare const __VERSION__: string;
export const VERSION: string = typeof __VERSION__ === 'string' ? __VERSION__ : '0.0.0';

export const DEFAULT_CATEGORIES = ['necessary', 'preferences', 'analytics', 'marketing'];
const BUILTIN = new Set(DEFAULT_CATEGORIES);
const DAY = 86400000;

type Listener<K extends keyof EventMap> = (detail: EventMap[K]) => void;

/** Picks the string for a language from a Text, falling back to the base language, English, then the first entry. */
export function pickText(text: Text | undefined | null, lang: string): string {
  if (text == null) return '';
  if (typeof text === 'string') return text;
  const keys = Object.keys(text);
  const l = lang.toLowerCase();
  const hit = keys.find((k) => k.toLowerCase() === l) || keys.find((k) => k.split('-')[0]!.toLowerCase() === l.split('-')[0]);
  return text[hit || 'en'] ?? text[keys[0]!] ?? '';
}

/** Builds the auto blocker list from the built in trackers and the options. */
export function trackerList(opt: boolean | AutoBlockConfig | undefined, skipGoogle: boolean): TrackerPattern[] | null {
  if (!opt) return null;
  const o = opt === true ? {} : opt;
  const ignore = new Set(o.ignore || []);
  const builtIn = TRACKERS.filter((t) => !ignore.has(t.id) && !(skipGoogle && t.google)).map((t) => ({ ...t, category: o.categories?.[t.id] || t.category }));
  return [...(o.patterns || []), ...builtIn];
}

interface Resolved {
  categories: ResolvedCategory[];
  lang: string;
  version: string;
  days: number;
  layout: Layout;
  position: Position;
  raw: CookieOwlConfig;
}

export class CookieOwl {
  readonly version = VERSION;
  private cfg: Resolved | null = null;
  private store: Store = memoryStore();
  private record: ConsentRecord | null = null;
  private lastId: string | null = null;
  private state: Record<string, boolean> = {};
  private listeners = new Map<string, Set<(d: never) => void>>();
  private blocker: Blocker | null = null;
  private ui: UI | null = null;
  private gcm: ReturnType<typeof normalizeConsentMode> = null;
  private signalNow: 'gpc' | 'dnt' | null = null;
  private texts: Texts | null = null;
  private onDocClick = (e: Event) => {
    const t = (e.target as Element | null)?.closest?.('[data-cookieowl-open]');
    if (t) {
      e.preventDefault();
      this.showPreferences();
    }
  };
  private onReady: (() => void) | null = null;

  /**
   * Starts cookieowl. Call it as early as possible: Consent Mode defaults and the
   * auto blocker are installed synchronously, the UI when the DOM is ready.
   * Calling it again replaces the previous configuration.
   */
  init(config: CookieOwlConfig = {}): this {
    if (this.cfg) this.destroy();
    const hasDom = typeof document !== 'undefined' && typeof window !== 'undefined';
    const lang = config.lang && config.lang !== 'auto' ? config.lang : hasDom ? detectLang(document, navigator) : 'en';
    const pack = LANGS[matchLang(lang) || 'en']!;
    const template = config.template || (pack === LANGS['pt-BR'] ? 'lgpd' : 'gdpr');
    const pick = (x: Text | undefined) => pickText(x, lang);
    const ids = new Set<string>();
    const categories: ResolvedCategory[] = [];
    for (const c of ['necessary', ...(config.categories || DEFAULT_CATEGORIES)]) {
      const cc: CategoryConfig = typeof c === 'string' ? { id: c } : c;
      if (!cc.id || ids.has(cc.id)) {
        // `necessary` given as an object replaces the implicit one.
        if (cc.id === 'necessary' && typeof c !== 'string') categories[0] = this.resolveCategory(cc, pack, pick);
        continue;
      }
      ids.add(cc.id);
      categories.push(this.resolveCategory(cc, pack, pick));
    }
    const layout = config.layout || 'box';
    const position: Position = config.position || (layout === 'bar' ? 'bottom' : 'bottom-right');
    this.cfg = {
      categories,
      lang,
      version: String(config.version ?? 1),
      days: config.expiresDays ?? 365,
      layout,
      position,
      raw: config,
    };
    const [law, prefsLaw] = pack[template];
    const t: Texts = { ...pack.t, description: pack.t.description.replace('{law}', law), prefsDescription: pack.t.prefsDescription.replace('{law}', prefsLaw) };
    for (const [k, v] of Object.entries(config.text || {})) (t as Record<string, string>)[k] = pick(v);
    this.texts = t;
    this.state = this.defaults();
    this.record = null;
    if (!hasDom) return this;

    this.store = config.storage === 'memory' ? memoryStore() : config.storage === 'localStorage' ? localStore(config.cookie?.name) : cookieStore(config.cookie);
    const saved = this.store.read();
    this.lastId = saved?.id || null;
    if (saved && this.isValid(saved)) {
      this.record = saved;
      for (const c of categories) this.state[c.id] = c.required || saved.categories[c.id] === true;
    }

    this.gcm = normalizeConsentMode(config.consentMode);
    if (this.gcm) {
      sendDefaults(this.gcm);
      if (this.record) sendUpdate(this.gcm, (c) => this.accepted(c));
    }

    this.blocker = new Blocker(document, {
      trackers: trackerList(config.autoBlock, Boolean(this.gcm?.advanced)),
      allowed: (cats) => this.accepted(cats),
      placeholder: (frame, info) =>
        this.getUI().placeholder(
          frame,
          info.name,
          () => this.blocker?.loadOnce(frame),
          () => this.save({ ...this.state, ...Object.fromEntries(info.category.split(' ').map((c) => [c, true])) }),
        ),
    });
    this.blocker.start();

    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (config.respectGPC !== false && nav.globalPrivacyControl === true) this.signalNow = 'gpc';
    else if (config.respectDNT && nav.doNotTrack === '1') this.signalNow = 'dnt';
    if (!this.record && this.signalNow) this.commit(this.defaults(), 'signal', this.signalNow);
    else if (this.record) void this.blocker.release();

    document.addEventListener('click', this.onDocClick);
    const ready = () => {
      this.onReady = null;
      if (!this.cfg) return;
      if (!this.record && config.autoShow !== false) return this.show();
      this.getUI().mount();
      this.getUI().syncReopen();
    };
    if (document.readyState === 'loading') {
      this.onReady = ready;
      document.addEventListener('DOMContentLoaded', ready, { once: true });
    } else ready();
    this.emit('ready', this.detail([]));
    return this;
  }

  private resolveCategory(cc: CategoryConfig, pack: (typeof LANGS)[string], pick: (x: Text | undefined) => string): ResolvedCategory {
    const builtIn = BUILTIN.has(cc.id) ? pack.cats[cc.id as keyof typeof pack.cats] : null;
    return {
      id: cc.id,
      label: cc.label ? pick(cc.label) : builtIn ? builtIn[0] : cc.id,
      description: cc.description ? pick(cc.description) : builtIn ? builtIn[1] : '',
      required: cc.id === 'necessary' || cc.required === true,
      services: cc.services || [],
    };
  }

  private defaults(): Record<string, boolean> {
    const s: Record<string, boolean> = {};
    for (const c of this.cfg?.categories || []) s[c.id] = c.required;
    return s;
  }

  private isValid(r: ConsentRecord): boolean {
    const cfg = this.cfg!;
    return String(r.version) === cfg.version && Date.parse(r.expires) > Date.now() && cfg.categories.every((c) => c.required || typeof r.categories[c.id] === 'boolean');
  }

  private getUI(): UI {
    if (!this.ui) {
      const raw = this.cfg!.raw;
      const c = raw.container;
      const container = typeof c === 'string' ? document.querySelector<HTMLElement>(c) : c || null;
      const reopen = raw.reopenButton === false ? false : raw.reopenButton === 'right' ? 'right' : 'left';
      this.ui = new UI(
        document,
        {
          texts: () => this.texts!,
          lang: () => this.cfg!.lang,
          categories: () => this.categories(),
          state: () => ({ ...this.state }),
          hasChoice: () => this.record !== null && this.record.method !== 'signal',
          signal: () => this.signalNow !== null,
          policyUrl: () => this.cfg?.raw.policyUrl,
          acceptAll: () => this.acceptAll(),
          rejectAll: () => this.rejectAll(),
          save: (choices) => this.save(choices),
          shown: (what, open) => this.emit(open ? 'show' : 'hide', what),
          pick: (x) => pickText(x as Text, this.cfg!.lang),
        },
        { layout: this.cfg!.layout, position: this.cfg!.position, theme: raw.theme || 'auto', dir: raw.dir || 'auto', reopen, container },
      );
    }
    return this.ui;
  }

  private detail(changed: string[]): ChangeDetail {
    return {
      categories: { ...this.state },
      accepted: Object.keys(this.state).filter((k) => this.state[k]),
      changed,
      record: this.record ? { ...this.record, categories: { ...this.record.categories } } : null,
    };
  }

  // ---------- Events ----------

  /** Listens to `change`, `consent`, `show`, `hide`, `ready` or `reset`. Returns a function that stops listening. */
  on<K extends keyof EventMap>(event: K, fn: Listener<K>): () => void {
    let set = this.listeners.get(event);
    if (!set) this.listeners.set(event, (set = new Set()));
    set.add(fn as (d: never) => void);
    return () => this.off(event, fn);
  }

  off<K extends keyof EventMap>(event: K, fn: Listener<K>): void {
    this.listeners.get(event)?.delete(fn as (d: never) => void);
  }

  private emit<K extends keyof EventMap>(event: K, detail: EventMap[K]): void {
    for (const fn of [...(this.listeners.get(event) || [])]) {
      try {
        (fn as Listener<K>)(detail);
      } catch (err) {
        console.error('[cookieowl]', err);
      }
    }
    if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent(`cookieowl:${event}`, { detail }));
  }

  // ---------- Reading ----------

  /** True when every given category is accepted. Required categories are always accepted. */
  accepted(category: string | string[]): boolean {
    const list = Array.isArray(category) ? category : [category];
    return list.every((id) => this.state[id] === true);
  }

  /** A copy of the stored record, or null before the visitor chooses. */
  getConsent(): ConsentRecord | null {
    return this.detail([]).record;
  }

  /** The configured categories with their labels in the current language. */
  categories(): ResolvedCategory[] {
    return (this.cfg?.categories || []).map((c) => ({ ...c }));
  }

  /** The current language code. */
  get lang(): string {
    return this.cfg?.lang || 'en';
  }

  // ---------- Choosing ----------

  acceptAll(): void {
    const all: Record<string, boolean> = {};
    for (const c of this.cfg?.categories || []) all[c.id] = true;
    this.commit(all, 'accept-all');
  }

  rejectAll(): void {
    this.commit(this.defaults(), 'reject-all');
  }

  /** Saves a choice: a map of category to boolean, or the list of accepted categories. */
  save(choices: Record<string, boolean> | string[]): void {
    const map: Record<string, boolean> = Array.isArray(choices) ? Object.fromEntries(choices.map((c) => [c, true])) : choices;
    const cats = this.cfg?.categories || [];
    const optional = cats.filter((c) => !c.required);
    const method: ConsentMethod = optional.length && optional.every((c) => map[c.id] === true) ? 'accept-all' : optional.every((c) => map[c.id] !== true) ? 'reject-all' : 'custom';
    this.commit(map, method);
  }

  private commit(next: Record<string, boolean>, method: ConsentMethod, signal?: 'gpc' | 'dnt'): void {
    const cfg = this.cfg;
    if (!cfg) return;
    const prev = { ...this.state };
    const state: Record<string, boolean> = {};
    for (const c of cfg.categories) state[c.id] = c.required || next[c.id] === true;
    const now = Date.now();
    const record: ConsentRecord = {
      id: this.record?.id || this.lastId || uuid(),
      version: cfg.version,
      timestamp: new Date(now).toISOString(),
      expires: new Date(now + cfg.days * DAY).toISOString(),
      categories: { ...state },
      method,
      lang: cfg.lang,
      page: typeof location !== 'undefined' ? location.pathname : '',
    };
    if (signal) record.signal = signal;
    this.state = state;
    this.record = record;
    this.lastId = record.id;
    this.store.write(record, cfg.days * 86400);
    const changed = cfg.categories.map((c) => c.id).filter((id) => prev[id] !== state[id]);
    const withdrawn = changed.filter((id) => prev[id] && !state[id]);

    if (this.gcm) sendUpdate(this.gcm, (c) => this.accepted(c));
    if (this.gcm || (typeof window !== 'undefined' && Array.isArray((window as { dataLayer?: unknown }).dataLayer))) pushEvent(state);
    if (this.ui) {
      this.ui.hidePrefs();
      this.ui.hideBanner();
      if (!signal) this.ui.announce(this.texts!.saved);
    }
    const copy = this.getConsent()!;
    this.emit('consent', copy);
    if (changed.length) this.emit('change', this.detail(changed));
    try {
      cfg.raw.onConsent?.(copy);
    } catch (err) {
      console.error('[cookieowl] onConsent failed', err);
    }
    if (withdrawn.length) this.withdraw(withdrawn);
    void this.blocker?.release();
  }

  /** Erases the cookies of withdrawn categories and reloads when their scripts already ran. */
  private withdraw(ids: string[]): void {
    const raw = this.cfg!.raw;
    if (raw.clearCookies !== false && typeof document !== 'undefined') {
      const patterns: (string | RegExp)[] = [];
      for (const c of this.cfg!.categories) {
        if (!ids.includes(c.id)) continue;
        for (const s of c.services) for (const k of s.cookies || []) patterns.push(k.name);
      }
      for (const t of trackerList(raw.autoBlock || true, false) || []) if (ids.includes(t.category)) patterns.push(...(t.cookies || []));
      eraseCookies(patterns);
    }
    const ran = ids.filter((id) => this.blocker?.ran.has(id));
    if (!ran.length || raw.reloadOnWithdraw === false) return;
    if (typeof raw.reloadOnWithdraw === 'function') raw.reloadOnWithdraw(ran);
    else location.reload();
  }

  // ---------- UI ----------

  /** Shows the banner. */
  show(): void {
    if (this.cfg && typeof document !== 'undefined') this.getUI().showBanner();
  }

  /** Hides the banner and the preferences dialog without recording a choice. */
  hide(): void {
    this.ui?.hidePrefs();
    this.ui?.hideBanner();
  }

  /** Opens the preferences dialog. Bind it to a "Cookie settings" link in your footer, or use `data-cookieowl-open`. */
  showPreferences(): void {
    if (this.cfg && typeof document !== 'undefined') this.getUI().showPrefs();
  }

  hidePreferences(): void {
    this.ui?.hidePrefs();
  }

  /** Forgets the choice: clears the record, turns optional categories off and shows the banner again. */
  reset(): void {
    if (!this.cfg) return;
    const prev = { ...this.state };
    this.store.clear();
    this.record = null;
    this.state = this.defaults();
    if (this.gcm) sendUpdate(this.gcm, (c) => this.accepted(c));
    const changed = Object.keys(prev).filter((k) => prev[k] !== this.state[k]);
    this.emit('reset', undefined);
    if (changed.length) this.emit('change', this.detail(changed));
    this.hide();
    if (this.cfg.raw.autoShow !== false) this.show();
  }

  /** Removes the UI, the observers and the createElement hook. Listeners are kept. */
  destroy(): void {
    this.blocker?.stop();
    this.blocker = null;
    this.ui?.unmount();
    this.ui = null;
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.onDocClick);
      if (this.onReady) document.removeEventListener('DOMContentLoaded', this.onReady);
    }
    this.onReady = null;
    this.cfg = null;
    this.signalNow = null;
  }
}

/** Creates a separate instance. Most pages use the shared `cookieowl` instance instead. */
export function createCookieOwl(config?: CookieOwlConfig): CookieOwl {
  const c = new CookieOwl();
  return config ? c.init(config) : c;
}
