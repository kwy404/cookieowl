// Interactive parts of the cookieowl site, built with Voodoo.js
// (https://kwy404.github.io/Voodoo.js/). Voodoo is loaded with data-manual:
// this module publishes reactive stores and helpers on V.config.globals, then
// calls V.start(). Pages declare behavior in HTML (v-data, v-model, @click,
// v-for, v-show, v-copy-from, v-theme-toggle, v-hotkey). Plain JavaScript runs
// the live demo: a real cookieowl instance inside a pretend shop on the demo
// street, tracker bugs that wait at the gate or fly in, the night watch
// logbook fed by the fake trackers, the lantern workshop (the snippet
// configurator) and the parallax of the hero town.

const V = window.V;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const S = V.reactive({ ready: 0 });
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

// ---------- Configurator ----------

const CFG = V.reactive({
  lang: 'auto',
  template: '',
  policy: '/privacy',
  layout: 'box',
  theme: 'auto',
  seed: '#f2b134',
  preferences: true,
  analytics: true,
  marketing: true,
  consentMode: true,
  advanced: false,
  autoBlock: true,
  gpc: true,
  mode: 'tag',
  copied: false,
});

const CDN = 'https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js';

function cats(c) {
  return ['preferences', 'analytics', 'marketing'].filter((k) => c[k]);
}

/** The snippet as plain text, for the copy button. */
function snippetText(c) {
  const all = cats(c).length === 3;
  if (c.mode === 'npm') {
    const lines = [];
    if (c.lang !== 'auto') lines.push(`  lang: '${c.lang}',`);
    if (c.template) lines.push(`  template: '${c.template}',`);
    if (c.policy) lines.push(`  policyUrl: '${c.policy.replace(/'/g, "\\'")}',`);
    if (!all) lines.push(`  categories: [${cats(c).map((k) => `'${k}'`).join(', ')}],`);
    if (c.layout !== 'box') lines.push(`  layout: '${c.layout}',`);
    if (c.theme !== 'auto') lines.push(`  theme: '${c.theme}',`);
    if (c.consentMode) lines.push(c.advanced ? '  consentMode: { advanced: true },' : '  consentMode: true,');
    if (c.autoBlock) lines.push('  autoBlock: true,');
    if (!c.gpc) lines.push('  respectGPC: false,');
    const seed = c.seed !== '#f2b134' ? `\n// In your CSS: :root { --seed: ${c.seed}; }\n` : '';
    return `import { cookieowl } from 'cookieowl';\n\ncookieowl.init({\n${lines.join('\n')}\n});\n${seed}`;
  }
  const attrs = [];
  if (c.lang) attrs.push(`data-lang="${c.lang}"`);
  if (c.template) attrs.push(`data-template="${c.template}"`);
  if (c.policy) attrs.push(`data-policy-url="${c.policy.replace(/"/g, '&quot;')}"`);
  if (!all) attrs.push(`data-categories="${cats(c).join(',')}"`);
  if (c.layout !== 'box') attrs.push(`data-layout="${c.layout}"`);
  if (c.theme !== 'auto') attrs.push(`data-theme="${c.theme}"`);
  if (c.consentMode) attrs.push(c.advanced ? 'data-consent-mode="advanced"' : 'data-consent-mode');
  if (c.autoBlock) attrs.push('data-auto-block');
  if (!c.gpc) attrs.push('data-gpc="false"');
  const seed = c.seed !== '#f2b134' ? `\n<style>:root { --seed: ${c.seed}; }</style>` : '';
  return `<!-- First thing in <head>, without async or defer -->\n<script src="${CDN}"\n  ${attrs.join('\n  ')}></script>${seed}`;
}

// A tiny highlighter for the generated snippet, with the light-plus and
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

function snippetHtml(c) {
  return highlight(snippetText(c), c.mode);
}

async function copySnippet() {
  try {
    await navigator.clipboard.writeText(snippetText(CFG));
    CFG.copied = true;
    setTimeout(() => (CFG.copied = false), 1600);
  } catch {
    // clipboard blocked: the code stays selectable
  }
}

const LANG_NAMES = { auto: "the visitor's language", 'pt-BR': 'Portuguese', en: 'English', es: 'Spanish', fr: 'French', de: 'German' };
const LAYOUT_NAMES = { box: 'A corner box', bar: 'A bottom bar', modal: 'A center modal' };

/** The handwritten note next to the lantern. */
function lanternNote(c) {
  const law = c.template ? `, ${c.template.toUpperCase()} wording` : '';
  const gcm = c.consentMode ? ', Consent Mode on' : '';
  return `${LAYOUT_NAMES[c.layout] || 'A banner'} in ${LANG_NAMES[c.lang] || c.lang}${law}${gcm}`;
}

const bench = $('[data-lantern]');
if (bench) V.effect(() => bench.style.setProperty('--lamp', CFG.seed));

function tryInDemo() {
  if (!demo) return;
  demoCfg.lang = CFG.lang === 'auto' ? 'en' : CFG.lang;
  demoCfg.template = CFG.template;
  demoCfg.layout = CFG.layout;
  demoCfg.theme = CFG.theme;
  demoCfg.consentMode = CFG.consentMode;
  demoCfg.respectGPC = CFG.gpc;
  demoCfg.cats = cats(CFG);
  site.style.setProperty('--seed', CFG.seed);
  const layoutSel = $('[data-demo-layout]');
  const langSel = $('[data-demo-lang]');
  if (layoutSel) layoutSel.value = demoCfg.layout;
  if (langSel) langSel.value = demoCfg.lang;
  demo.reset();
  M.gcm.splice(0);
  rebuild(true);
  $('#demo').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

// ---------- Parallax of the hero town ----------

const layers = $$('.town .px');
if (layers.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
  CFG,
  hits: (q) => hits(q),
  go(q, sel) {
    const r = hits(q)[sel];
    if (!r) return;
    dialog?.close();
    location.href = r.url;
  },
  label,
  bugCls,
  lanternNote,
  clCount: (cl) => Object.values(cl.done).filter(Boolean).length,
  clReset() {
    for (const k of Object.keys(CL.done)) CL.done[k] = false;
  },
  snippetHtml,
  copySnippet,
  tryInDemo,
});

startDemo();
setTimeout(loadSearch, 2500);
V.start();
