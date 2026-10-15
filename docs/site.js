// Interactive parts of the cookieowl site, built with Voodoo.js
// (https://kwy404.github.io/Voodoo.js/). Voodoo is loaded with data-manual:
// this module publishes reactive stores and helpers on V.config.globals, then
// calls V.start(). Pages declare behavior in HTML (v-data, v-model, @click,
// v-for, v-show, v-copy-from, v-theme-toggle, v-hotkey). Plain JavaScript runs
// the banner generator and its live preview, the live demo (a real cookieowl
// instance inside a pretend shop, tracker bugs that wait at the gate or fly
// in, the logbook fed by the fake trackers), the reveal on scroll and the
// parallax of the hero town.

const V = window.V;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const S = V.reactive({ ready: 0 });
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
// The site root, so search also works from the 404 page at any depth.
const BASE = new URL('./', import.meta.url);

// ---------- Search (Ctrl K) ----------

let index = [];
let loading = null;
function loadSearch() {
  if (!loading) {
    loading = fetch(new URL('search.json', BASE))
      .then((r) => r.json())
      .then((j) => {
        index = j.map((e) => ({ ...e, url: new URL(e.url, BASE).href, hay: `${e.title} ${e.sub} ${e.kind}`.toLowerCase() }));
        S.ready++;
      })
      .catch(() => {
        loading = null;
      });
  }
  return loading;
}
function hits(q) {
  const query = String(q || '').trim().toLowerCase();
  if (!query) return index.filter((e) => e.kind === 'Page' || e.kind === 'Guide').slice(0, 9);
  const words = query.split(/\s+/);
  return index
    .map((e) => {
      if (!words.every((w) => e.hay.includes(w))) return null;
      const t = e.title.toLowerCase();
      return { e, score: (t.startsWith(query) ? 4 : t.includes(query) ? 2 : 0) + (e.kind === 'Guide' ? 1 : 0) };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((x) => x.e);
}
const dialog = $('#search');
function openSearch() {
  if (!dialog) return;
  loadSearch();
  if (!dialog.open) dialog.showModal();
  requestAnimationFrame(() => $('#search-input')?.focus());
}
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-search-open]')) openSearch();
  if (dialog?.open && e.target.closest('#search a[href]')) dialog.close();
});
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !e.target.closest('input, textarea, select, [contenteditable]')) {
    e.preventDefault();
    openSearch();
  }
});

// ---------- Checklist ----------

const CL_KEY = 'cookieowl:checklist';
const CL = V.reactive({ done: {} });
for (const input of $$('.checklist input[type=checkbox]')) {
  const m = /CL\.done\.(\w+)/.exec(input.getAttribute('v-model') || '');
  if (m) CL.done[m[1]] = false;
}
try {
  Object.assign(CL.done, JSON.parse(localStorage.getItem(CL_KEY) || '{}'));
} catch {
  // private mode: the list still works for this visit
}
V.effect(() => {
  const snapshot = JSON.stringify(CL.done);
  try {
    localStorage.setItem(CL_KEY, snapshot);
  } catch {
    // ignore
  }
});

// ---------- Live demo ----------

const M = V.reactive({ rows: [], gcm: [], cookies: [], status: 'idle', acc: { preferences: false, analytics: false, marketing: false, any: false } });
let rowId = 0;
const stops = [];
const site = $('[data-demo-site]');
const siteHtml = site ? site.innerHTML : '';
const scriptsTpl = $('#demo-scripts');

/** The API the fake trackers in demo/trackers/ report to. */
window.demoNet = {
  ran(src) {
    const row = M.rows.find((r) => r.url === src && r.state !== 'sent');
    if (row) row.state = 'ran';
    readCookies();
  },
  request(name, url, cat) {
    M.rows.push({ id: ++rowId, name, url, cat, state: 'sent' });
    readCookies();
  },
  onStop(fn) {
    stops.push(fn);
  },
  cookiePath: location.pathname.replace(/[^/]*$/, '') || '/',
};

function label(state) {
  return { held: 'Held', ran: 'Let in', sent: 'Sent', note: 'Note' }[state] || state;
}

/** Where a tracker bug is: waiting outside the gate (held) or inside the shop (ran). */
function bugCls(rows, key, where) {
  const row = rows.find((r) => r.state !== 'sent' && r.state !== 'note' && r.url.includes(`trackers/${key}.js`));
  if (!row) return '';
  return (where === 'out' ? row.state === 'held' : row.state === 'ran') ? 'is-here' : '';
}

/** Lights the gate lamps from the current choice. */
function readAccepted() {
  if (!demo) return;
  let any = false;
  for (const c of ['preferences', 'analytics', 'marketing']) {
    const on = demoCfg.cats.includes(c) && demo.accepted(c);
    M.acc[c] = on;
    any = any || on;
  }
  M.acc.any = any;
}

function readCookies() {
  M.cookies = document.cookie
    .split(';')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const i = c.indexOf('=');
      let value = c.slice(i + 1);
      try {
        value = decodeURIComponent(value);
      } catch {
        // keep the raw value
      }
      return { name: c.slice(0, i), value: value.length > 60 ? `${value.slice(0, 57)}...` : value };
    });
}

function addScriptRow(s) {
  const url = s.getAttribute('data-cookieowl-src') || s.getAttribute('src') || 'inline script';
  if (M.rows.some((r) => r.url === url && r.state !== 'sent')) return;
  M.rows.push({ id: ++rowId, name: s.dataset.demo || s.getAttribute('data-cookieowl-auto') || 'Script', url, cat: s.getAttribute('data-cookieowl') || '', state: s.hasAttribute('data-cookieowl-done') ? 'ran' : 'held' });
}

const SERVICES = {
  analytics: [
    { name: 'StarStats analytics', provider: 'Demo', description: 'Counts page views.', cookies: [{ name: '_starstats_id', duration: '1 year', description: 'Visitor id' }] },
    { name: 'Heatmap recorder', provider: 'Demo', description: 'Records clicks and scrolls.', cookies: [{ name: '_heat_session', duration: 'Session', description: 'Recording id' }] },
  ],
  marketing: [
    { name: 'Retargeting ads', provider: 'Demo', description: 'Shows you the beans again elsewhere.', cookies: [{ name: '_nightads_uid', duration: '90 days', description: 'Ad id' }] },
    { name: 'NightPixel', provider: 'Demo', description: 'A pixel injected by a vendor snippet.', cookies: [{ name: '_nightpixel', duration: '90 days', description: 'Pixel id' }] },
    { name: 'StarTube', provider: 'Demo', description: 'The embedded video.' },
  ],
  preferences: [{ name: 'Live chat widget', provider: 'Demo', description: 'Remembers your chat language.', cookies: [{ name: 'chat_lang', duration: '30 days', description: 'Chat language' }] }],
};

const demoCfg = {
  lang: 'en',
  layout: 'box',
  theme: 'auto',
  consentMode: true,
  respectGPC: true,
  cats: ['preferences', 'analytics', 'marketing'],
};

function demoConfig() {
  return {
    container: site,
    storage: 'localStorage',
    cookie: { name: 'cookieowl-demo' },
    lang: demoCfg.lang,
    template: demoCfg.template || undefined,
    text: demoCfg.text,
    layout: demoCfg.layout,
    theme: demoCfg.theme,
    consentMode: demoCfg.consentMode,
    respectGPC: demoCfg.respectGPC,
    autoBlock: { patterns: [{ id: 'demo-pixel', name: 'NightPixel', category: 'marketing', match: /\/demo\/trackers\/pixel\.js/, cookies: ['_nightpixel'] }] },
    categories: demoCfg.cats.map((id) => ({ id, services: SERVICES[id] || [] })),
    reloadOnWithdraw: (cats) => simulateReload(cats),
  };
}

let demo = null;

function fillScripts() {
  if (!scriptsTpl) return;
  site.append(scriptsTpl.content.cloneNode(true));
  $$('script[data-cookieowl]', site).forEach(addScriptRow);
}

function startDemo() {
  if (!site || !window.CookieOwl) return;
  window.dataLayer = window.dataLayer || [];
  hookDataLayer();
  fillScripts();
  demo = window.CookieOwl.createCookieOwl(demoConfig());
  demo.on('consent', (r) => {
    M.status = `Saved: ${r.method}`;
    readCookies();
    readAccepted();
  });
  demo.on('change', readAccepted);
  demo.on('show', (w) => (M.status = w === 'banner' ? 'Waiting for a choice' : 'Preferences open'));
  M.status = demo.getConsent() ? `Stored choice: ${demo.getConsent().method}` : 'Waiting for a choice';
  new MutationObserver((records) => {
    for (const r of records) for (const n of r.addedNodes) if (n.nodeType === 1 && n.matches('script[data-cookieowl]') && !n.hasAttribute('data-cookieowl-done')) addScriptRow(n);
  }).observe(site, { childList: true, subtree: true });
  readCookies();
  readAccepted();
}

/** A page reload, without reloading the docs: stop the trackers and rebuild the shop. */
function simulateReload(cats) {
  M.rows.push({ id: ++rowId, name: `Withdrawn: ${cats.join(', ')}`, url: 'On a real site cookieowl reloads the page now, so these scripts stop.', cat: '', state: 'note' });
  setTimeout(() => rebuild(false), 900);
}

function rebuild(clear) {
  while (stops.length) stops.pop()();
  site.innerHTML = siteHtml;
  M.rows = clear ? [] : M.rows.filter((r) => r.state === 'note').slice(-1);
  fillScripts();
  demo.init(demoConfig());
  readCookies();
  readAccepted();
}

let dlHooked = false;
function hookDataLayer() {
  if (dlHooked) return;
  dlHooked = true;
  const dl = window.dataLayer;
  const record = (item) => {
    let cmd;
    let title;
    let detail;
    if (item && typeof item === 'object' && 'event' in item) {
      cmd = 'event';
      title = item.event;
      detail = Object.entries(item.cookieowl || {})
        .map(([k, v]) => `${k}: ${v ? 'yes' : 'no'}`)
        .join(', ');
    } else {
      const a = Array.from(item || []);
      cmd = a.slice(0, 2).join(' ');
      const obj = a[2] && typeof a[2] === 'object' ? a[2] : null;
      if (obj) {
        const granted = Object.keys(obj).filter((k) => obj[k] === 'granted');
        title = granted.length ? `granted: ${granted.join(', ')}` : 'everything denied but security';
        detail = Object.entries(obj)
          .filter(([k]) => k !== 'security_storage')
          .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(' ') : v}`)
          .join(' ');
        if (granted.length === 1 && granted[0] === 'security_storage') title = 'everything denied but security';
      } else {
        title = String(a[2] ?? '');
        detail = '';
      }
    }
    M.gcm.push({ id: M.gcm.length + 1, cmd, title, detail });
  };
  dl.forEach(record);
  const push = dl.push.bind(dl);
  dl.push = (...items) => {
    items.forEach(record);
    return push(...items);
  };
}

document.addEventListener('click', (e) => {
  if (!demo) return;
  if (e.target.closest('[data-demo-reset]')) {
    demo.reset();
    M.gcm.splice(0);
    rebuild(true);
  } else if (e.target.closest('[data-demo-prefs]')) {
    demo.showPreferences();
  } else if (e.target.closest('[data-demo-pixel]')) {
    // What a vendor snippet does: create a script element and insert it.
    const s = document.createElement('script');
    s.async = true;
    s.src = 'demo/trackers/pixel.js';
    s.dataset.demo = 'NightPixel (injected)';
    site.append(s);
    if (s.getAttribute('type') !== 'text/plain') addScriptRow(s);
    M.status = 'A snippet tried to sneak in a pixel';
  }
});
document.addEventListener('change', (e) => {
  if (!demo) return;
  const t = e.target;
  if (t.matches('[data-demo-layout]')) demoCfg.layout = t.value;
  else if (t.matches('[data-demo-lang]')) demoCfg.lang = t.value;
  else return;
  demo.init(demoConfig());
});

// ---------- Banner generator ----------
// The form in the Generator chapter is bound to G. Every change renders the
// live preview: the real script in an iframe, with the same attributes as the
// line to copy (plus memory storage, so nothing is kept between renders).
// Two iframes take turns so the new banner fades in over the old one.

const DEFAULT_ACCENT = '#f2b134';
const G = V.reactive({
  preset: 'gdpr',
  lang: 'auto',
  layout: 'box',
  theme: 'auto',
  accent: DEFAULT_ACCENT,
  title: '',
  description: '',
  rejectAll: '',
  acceptAll: '',
  preferences: true,
  analytics: true,
  marketing: true,
  policy: '/privacy',
  consentMode: true,
  advanced: false,
  autoBlock: true,
  gpc: true,
  mode: 'tag',
  page: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  copied: false,
});

const genCode = $('#gen-code');
// The CDN address comes from the build, through the default line in the page.
const CDN = (/src="([^"]+)"/.exec(genCode?.textContent || '') || [])[1] || 'https://cdn.jsdelivr.net/npm/cookieowl/dist/cookieowl.js';
// What the region presets set, as in src/presets.ts: the line only adds what differs.
const PRESETS = { lgpd: { lang: 'pt-BR', consentMode: true, autoBlock: true }, gdpr: { consentMode: true, autoBlock: true } };
const TEXT_ATTRS = [
  ['title', 'data-text-title'],
  ['description', 'data-text-description'],
  ['rejectAll', 'data-text-reject-all'],
  ['acceptAll', 'data-text-accept-all'],
];
let TEXTS = {};
try {
  TEXTS = JSON.parse($('#gen-texts')?.textContent || '{}');
} catch {
  // placeholders stay empty
}

const genCats = (g) => ['preferences', 'analytics', 'marketing'].filter((k) => g[k]);
const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** The data attributes of the line, as [name, value] pairs (true for a bare attribute). */
function genAttrs(g) {
  const p = PRESETS[g.preset] || {};
  const a = [];
  if (g.preset) a.push(['data-preset', g.preset]);
  if (g.lang !== 'auto') a.push(['data-lang', g.lang]);
  const policy = g.policy.trim();
  if (policy) a.push(['data-policy-url', policy]);
  const cats = genCats(g);
  if (cats.length < 3) a.push(['data-categories', cats.length ? cats.join(',') : 'necessary']);
  if (g.layout !== 'box') a.push(['data-layout', g.layout]);
  if (g.theme !== 'auto') a.push(['data-theme', g.theme]);
  if (g.accent.toLowerCase() !== DEFAULT_ACCENT) a.push(['data-accent', g.accent]);
  if (g.consentMode && g.advanced) a.push(['data-consent-mode', 'advanced']);
  else if (g.consentMode && !p.consentMode) a.push(['data-consent-mode', true]);
  else if (!g.consentMode && p.consentMode) a.push(['data-consent-mode', 'false']);
  if (g.autoBlock && !p.autoBlock) a.push(['data-auto-block', true]);
  else if (!g.autoBlock && p.autoBlock) a.push(['data-auto-block', 'false']);
  if (!g.gpc) a.push(['data-gpc', 'false']);
  for (const [key, attr] of TEXT_ATTRS) {
    const v = g[key].trim();
    if (v) a.push([attr, v]);
  }
  return a;
}

const attrText = (attrs) => attrs.map(([n, v]) => (v === true ? ` ${n}` : ` ${n}="${escAttr(v)}"`)).join('');
const genLine = (g, src = CDN, extra = []) => `<script src="${src}"${attrText([...genAttrs(g), ...extra])}></script>`;

/** The same setup for npm. */
function genNpm(g) {
  const p = PRESETS[g.preset] || {};
  const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  const lines = [];
  if (g.preset) lines.push(`preset: ${q(g.preset)},`);
  if (g.lang !== 'auto') lines.push(`lang: ${q(g.lang)},`);
  if (g.policy.trim()) lines.push(`policyUrl: ${q(g.policy.trim())},`);
  const cats = genCats(g);
  if (cats.length < 3) lines.push(`categories: [${(cats.length ? cats : ['necessary']).map(q).join(', ')}],`);
  if (g.layout !== 'box') lines.push(`layout: ${q(g.layout)},`);
  if (g.theme !== 'auto') lines.push(`theme: ${q(g.theme)},`);
  if (g.accent.toLowerCase() !== DEFAULT_ACCENT) lines.push(`accent: ${q(g.accent)},`);
  if (g.consentMode && g.advanced) lines.push('consentMode: { advanced: true },');
  else if (g.consentMode !== Boolean(p.consentMode)) lines.push(`consentMode: ${g.consentMode},`);
  if (g.autoBlock !== Boolean(p.autoBlock)) lines.push(`autoBlock: ${g.autoBlock},`);
  if (!g.gpc) lines.push('respectGPC: false,');
  const texts = TEXT_ATTRS.filter(([key]) => g[key].trim()).map(([key]) => `  ${key}: ${q(g[key].trim())},`);
  if (texts.length) lines.push('text: {', ...texts, '},');
  const body = lines.length ? `{\n${lines.map((l) => `  ${l}`).join('\n')}\n}` : '';
  return `import { cookieowl } from 'cookieowl';\n\ncookieowl.init(${body});\n`;
}

const genText = (g) => (g.mode === 'npm' ? genNpm(g) : genLine(g));

// Attributes that changed since the last render get a short highlight.
let prevAttrs = null;
function genTagHtml(g) {
  const attrs = genAttrs(g);
  const next = new Map(attrs.map(([n, v]) => [n, String(v)]));
  let html = `${tok('tag', '<script')} <span class="at">${tok('attr', 'src')}${tok('txt', '=')}${tok('str', `"${CDN}"`)}</span>`;
  for (const [n, v] of attrs) {
    const part = `<span class="at">${tok('attr', n)}${v === true ? '' : tok('txt', '=') + tok('str', `"${escAttr(v)}"`)}</span>`;
    html += ` ${prevAttrs && prevAttrs.get(n) !== String(v) ? `<mark class="chg">${part}</mark>` : part}`;
  }
  prevAttrs = next;
  return `<span class="line">${html}${tok('tag', '></script>')}</span>`;
}

function genHtml(g) {
  return g.mode === 'npm' ? highlight(genNpm(g), 'npm') : genTagHtml(g);
}

/** The built in text of the chosen language, shown as a placeholder. */
function genPh(g, key) {
  const lang = g.lang !== 'auto' ? g.lang : g.preset === 'lgpd' ? 'pt-BR' : 'en';
  return (TEXTS[lang] || TEXTS.en || {})[key] || '';
}

let copyTimer = 0;
async function genCopy() {
  try {
    await navigator.clipboard.writeText(genText(G));
  } catch {
    // Clipboard blocked: select the code so Ctrl C works.
    const range = document.createRange();
    range.selectNodeContents(genCode);
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    return;
  }
  G.copied = true;
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => (G.copied = false), 1800);
}

// The pretend page around the banner in the preview.
const PV_CSS = `*{box-sizing:border-box}html,body{margin:0;height:100%}body{font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f7f5f0;color:#1d2433;overflow:hidden}.dark body{background:#121729;color:#e6e9f2}
.top{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid rgb(128 128 128/.18)}.logo{width:22px;height:22px;border-radius:7px;background:var(--a)}.top nav{display:flex;gap:12px;margin-left:auto}
.s{display:block;height:9px;border-radius:9px;background:rgb(128 128 128/.22)}.top .s{width:42px}
.hero{padding:30px 20px 12px;max-width:560px}.h{height:20px;border-radius:8px;background:rgb(128 128 128/.38);margin:0 0 12px}.h+.h{width:70%}.hero .s{margin:0 0 9px}.btn{display:inline-block;width:120px;height:34px;margin-top:10px;border-radius:9px;background:var(--a)}
.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:16px 20px}.card{height:96px;border-radius:12px;background:rgb(128 128 128/.12)}`;
const PV_BODY = '<header class="top"><span class="logo"></span><b>Your site</b><nav><span class="s"></span><span class="s"></span><span class="s"></span></nav></header><main class="hero"><p class="h"></p><p class="h"></p><span class="s"></span><span class="s" style="width:85%"></span><span class="s" style="width:60%"></span><span class="btn"></span></main><section class="cards"><span class="card"></span><span class="card"></span><span class="card"></span></section>';
const SCRIPT_URL = new URL('assets/cookieowl.js', BASE).href;

const stage = $('[data-gen-preview]');
const frames = stage ? $$('iframe', stage) : [];
let live = 0;
let nonce = 0;
if (frames[0]) frames[0].classList.add('is-live');

/** The preview document: the line itself, but never stored and always shown (even with Global Privacy Control). */
function previewDoc(g) {
  const line = genLine({ ...g, gpc: true }, SCRIPT_URL, [['data-storage', 'memory'], ['data-gpc', 'false']]);
  return `<!doctype html><html lang="en" class="${g.page}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="${g.page}"><style>:root{--a:${escAttr(g.accent)}}${PV_CSS}</style>${line}</head><body><!--${++nonce}-->${PV_BODY}</body></html>`;
}

function renderPreview() {
  if (!frames.length) return;
  const next = frames[1 - live];
  next.onload = () => {
    next.onload = null;
    const old = frames[live];
    old.classList.remove('is-live');
    old.setAttribute('aria-hidden', 'true');
    old.tabIndex = -1;
    next.classList.add('is-live');
    next.removeAttribute('aria-hidden');
    next.removeAttribute('tabindex');
    live = 1 - live;
  };
  next.srcdoc = previewDoc(G);
}

let pvTimer = 0;
let pvFirst = true;
if (frames.length) {
  V.effect(() => {
    // Reading the attributes and the page color subscribes this effect to them.
    void (JSON.stringify(genAttrs(G)) + G.page);
    stage.closest('.gen')?.style.setProperty('--g-accent', G.accent);
    clearTimeout(pvTimer);
    pvTimer = setTimeout(renderPreview, pvFirst ? 0 : 180);
    pvFirst = false;
  });
}

function tryInDemo() {
  if (!demo) return;
  demoCfg.lang = G.lang === 'auto' ? (G.preset === 'lgpd' ? 'pt-BR' : 'en') : G.lang;
  demoCfg.template = G.preset;
  demoCfg.layout = G.layout;
  demoCfg.theme = G.theme;
  demoCfg.consentMode = G.consentMode;
  demoCfg.respectGPC = G.gpc;
  demoCfg.cats = genCats(G);
  demoCfg.text = Object.fromEntries(TEXT_ATTRS.filter(([key]) => G[key].trim()).map(([key]) => [key, G[key].trim()]));
  site.style.setProperty('--seed', G.accent);
  const layoutSel = $('[data-demo-layout]');
  const langSel = $('[data-demo-lang]');
  if (layoutSel) layoutSel.value = demoCfg.layout;
  if (langSel) langSel.value = demoCfg.lang;
  demo.reset();
  M.gcm.splice(0);
  rebuild(true);
  $('#demo').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

// A tiny highlighter for the generated code, with the light-plus and
// dark-plus colors used by the Shiki frames on the rest of the site.
const TOK = {
  com: ['#008000', '#6A9955'],
  tag: ['#800000', '#569CD6'],
  attr: ['#E50000', '#9CDCFE'],
  str: ['#0000FF', '#CE9178'],
  kw: ['#AF00DB', '#C586C0'],
  fn: ['#795E26', '#DCDCAA'],
  key: ['#001080', '#9CDCFE'],
  lit: ['#0000FF', '#569CD6'],
  txt: ['#000000', '#D4D4D4'],
};
const tok = (kind, s) => `<span style="--shiki-light:${TOK[kind][0]};--shiki-dark:${TOK[kind][1]}">${esc(s)}</span>`;

function highlight(code, mode) {
  return code
    .split('\n')
    .map((line) => {
      let html = '';
      const re =
        mode === 'npm'
          ? /(\/\/.*$)|('(?:[^'\\]|\\.)*')|\b(import|from|true|false)\b|\b(cookieowl)\b(?=\.)|\b(init)\b|(\w+)(?=:)|([^\s'/\w]+|\s+|\w+)/g
          : /(<!--.*?-->)|("[^"]*")|(<\/?[\w]+|\/?>)|([\w-]+)(?==)|(=)|([\w-]+)|(\s+|[^\s<"=\w-]+)/g;
      let m;
      while ((m = re.exec(line))) {
        if (mode === 'npm') {
          if (m[1]) html += tok('com', m[1]);
          else if (m[2]) html += tok('str', m[2]);
          else if (m[3]) html += tok(m[3] === 'true' || m[3] === 'false' ? 'lit' : 'kw', m[3]);
          else if (m[4]) html += tok('key', m[4]);
          else if (m[5]) html += tok('fn', m[5]);
          else if (m[6]) html += tok('key', m[6]);
          else html += tok('txt', m[7]);
        } else if (m[1]) html += tok('com', m[1]);
        else if (m[2]) html += tok('str', m[2]);
        else if (m[3]) html += tok('tag', m[3]);
        else if (m[4]) html += tok('attr', m[4]);
        else if (m[5]) html += tok('txt', m[5]);
        else if (m[6]) html += tok('attr', m[6]);
        else html += tok('txt', m[7]);
      }
      return `<span class="line">${html}</span>`;
    })
    .join('\n');
}

// ---------- Reveal on scroll ----------

if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px' },
  );
  const seen = new Map();
  for (const el of $$('.chapter .ch-head, .gen-form .gstep, .gen-out, .demo-grid, .panel, .suspects, .spread, .fw-tabs, .shelf, .accordion, .g-cta, .related')) {
    // Siblings arrive one after the other.
    const n = seen.get(el.parentElement) || 0;
    seen.set(el.parentElement, n + 1);
    el.style.setProperty('--rd', `${Math.min(n, 5) * 80}ms`);
    el.classList.add('reveal');
    io.observe(el);
  }
  document.documentElement.classList.add('reveal-on');
}
// ---------- Parallax of the hero town ----------

const layers = $$('.town .px');
if (layers.length && !reduceMotion) {
  const hero = $('.town');
  let ticking = false;
  const move = () => {
    ticking = false;
    const y = Math.min(scrollY, hero.offsetHeight);
    for (const el of layers) el.style.transform = `translateY(${(y * Number(el.dataset.depth || 0)).toFixed(1)}px)`;
  };
  addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(move);
      }
    },
    { passive: true },
  );
}

// ---------- Reading progress on guides ----------

const bar = $('.read-progress');
if (bar && !CSS.supports('animation-timeline: scroll()')) {
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

Object.assign(V.config.globals, {
  S,
  M,
  CL,
  G,
  hits: (q) => hits(q),
  go(q, sel) {
    const r = hits(q)[sel];
    if (!r) return;
    dialog?.close();
    location.href = r.url;
  },
  label,
  bugCls,
  clCount: (cl) => Object.values(cl.done).filter(Boolean).length,
  clReset() {
    for (const k of Object.keys(CL.done)) CL.done[k] = false;
  },
  genHtml,
  genPh,
  genCopy,
  genReplay: () => renderPreview(),
  tryInDemo,
});

startDemo();
setTimeout(loadSearch, 2500);
V.start();
