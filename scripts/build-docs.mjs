// Builds the docs site in docs/ from the sources in site/.
//   site/guides/*.html   guide sources: a meta comment, then prose sections
//   site/*.mjs           layout, home, guides, API reference and 404 templates
//   scripts/storybook.mjs the palette, icons and illustrations; every drawing
//                        is written to docs/assets/art/ in a light (dawn) and
//                        a dark (night) version and inlined where it animates
//   docs/site.css, docs/site.js and docs/demo/ are written by hand
// Code samples are highlighted at build time with Shiki (light-plus and
// dark-plus) so the pages ship no highlighter. dist/cookieowl.js (npm run
// build) is copied to docs/assets/ for the live demo.
// Usage: npm run docs, or npm run docs:check to verify docs/ is current.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { apiBody, apiJsonLd } from '../site/api.mjs';
import { FAQ, homeBody, homeJsonLd } from '../site/home.mjs';
import { CDN, GUIDES, SITE, esc, page } from '../site/layout.mjs';
import { CHECKLIST, guideBody, guideJsonLd, indexBody, indexJsonLd, notFoundBody } from '../site/pages.mjs';
import { UPDATED } from '../site/layout.mjs';
import { DAWN, ICON_NAMES, NIGHT, SPOT_NAMES, bugSprite, demoGate, heroScene, iconFile, iconSheet, paletteCss, readmeBanner, spotSvg, streetScene } from './storybook.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const docs = join(root, 'docs');
const check = process.argv.includes('--check');

// Shiki: the local dev dependency, or a sibling checkout that has it installed.
async function loadShiki() {
  const require = createRequire(import.meta.url);
  try {
    require.resolve('shiki');
    return await import('shiki');
  } catch {
    const sibling = join(root, '..', 'graphemely', 'node_modules', 'shiki', 'dist', 'index.mjs');
    if (existsSync(sibling)) return import(pathToFileURL(sibling).href);
  }
  throw new Error('shiki is not installed: run npm install');
}
const shiki = await loadShiki();
const highlighter = await shiki.createHighlighter({ themes: ['light-plus', 'dark-plus'], langs: ['html', 'css', 'js', 'ts', 'tsx', 'php', 'bash', 'json', 'vue'] });

// ---------- Code frames ----------

const FILE_ICONS = {
  html: ['#e34c26', '<>'],
  css: ['#663399', '#'],
  js: ['#c9a400', 'JS'],
  ts: ['#3178c6', 'TS'],
  tsx: ['#1f8fbf', 'TSX'],
  php: ['#777bb3', 'PHP'],
  json: ['#8a6d00', 'JSON'],
  vue: ['#3f9b6e', 'V'],
  bash: ['#3f8f4f', '$_'],
};
function fileIcon(lang) {
  const [color, label] = FILE_ICONS[lang] || FILE_ICONS.bash;
  const size = label.length > 3 ? 4.3 : label.length > 2 ? 5.2 : 6.4;
  return `<svg class="file-ic" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect width="16" height="16" rx="3" fill="${color}"/><text x="8" y="11" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="700" fill="#fff">${esc(label)}</text></svg>`;
}

let codeId = 0;
let idPrefix = 'c';
/** A VS Code style frame around Shiki output. kind: editor (file tab) or terminal. */
function frame(code, opts = {}) {
  const lang = opts.lang || 'bash';
  const kind = opts.kind || 'editor';
  const title = opts.title || (kind === 'terminal' ? 'Terminal' : 'snippet');
  const ok = new Set(opts.ok || []);
  const html = highlighter.codeToHtml(code, {
    lang,
    themes: { light: 'light-plus', dark: 'dark-plus' },
    defaultColor: false,
    transformers: [
      {
        line(node, line) {
          if (ok.has(line)) this.addClassToHast(node, 'ok');
        },
      },
    ],
  });
  const inner = /<code>([\s\S]*)<\/code>/.exec(html)[1];
  const id = `${idPrefix}-${++codeId}`;
  const cls = ['frame', `frame-${kind}`, opts.compact ? 'frame-compact' : ''].filter(Boolean).join(' ');
  return `<figure class="${cls}" data-lang="${lang}"><div class="frame-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="frame-tab">${fileIcon(kind === 'terminal' ? 'bash' : lang)}<span>${esc(title)}</span></span><button type="button" class="frame-copy" v-copy-from="#${id}" aria-label="Copy ${esc(title)}"><svg class="ic" aria-hidden="true"><use href="#i-copy"/></svg><span>Copy</span></button></div><pre class="shiki" tabindex="0"><code id="${id}">${inner}</code></pre></figure>`;
}

/** Replaces raw code blocks in guide sources with highlighted frames. */
function renderBlocks(body) {
  return body.replace(/<pre data-kind="(\w+)"([^>]*)>\n([\s\S]*?)\n<\/pre>/g, (_, kind, attrs, code) => {
    const attr = (name) => (new RegExp(`data-${name}="([^"]*)"`).exec(attrs) || [])[1];
    return frame(code, { kind, lang: attr('lang'), title: attr('title'), ok: (attr('ok') || '').split(',').filter(Boolean).map(Number) });
  });
}

// ---------- Library facts ----------

const distFile = join(root, 'dist', 'cookieowl.js');
if (!existsSync(distFile)) throw new Error('dist/cookieowl.js is missing: run npm run build first');
const dist = readFileSync(distFile, 'utf8');
const gz = gzipSync(dist, { level: 9 }).length;
const sizeLabel = `${(gz / 1000).toFixed(1)} kB`;
const { TRACKERS } = await import(pathToFileURL(join(root, 'dist', 'index.js')).href);
const { LANGS, CONSENT_MODE_MAPPING } = await import(pathToFileURL(join(root, 'dist', 'index.js')).href);
const trackerNames = [...new Set(TRACKERS.map((t) => t.name))];
const nameList = `${trackerNames.slice(0, -1).join(', ')} and ${trackerNames.at(-1)}`;

// ---------- Guides ----------

const guides = readdirSync(join(root, 'site', 'guides'))
  .filter((f) => f.endsWith('.html'))
  .map((f) => {
    const src = readFileSync(join(root, 'site', 'guides', f), 'utf8').replace(/\r\n/g, '\n');
    const m = /^<!--meta\n([\s\S]*?)\n-->\n([\s\S]*)$/.exec(src);
    if (!m) throw new Error(`site/guides/${f}: missing meta comment`);
    const meta = JSON.parse(m[1]);
    if (`${meta.slug}.html` !== f) throw new Error(`site/guides/${f}: slug ${meta.slug} does not match the file name`);
    return { meta, body: m[2] };
  });
for (const g of GUIDES) if (!guides.find((x) => x.meta.slug === g.slug)) throw new Error(`missing guide source ${g.slug}`);

const words = (html) =>
  html
    .replace(/<pre[\s\S]*?<\/pre>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter((w) => /[a-z]/i.test(w)).length;

// ---------- Pages ----------

const out = {};

idPrefix = 'h';
codeId = 0;
const fwCode = {
  html: frame(`<!doctype html>\n<html lang="en">\n<head>\n  <script src="${CDN}"\n    data-policy-url="/privacy" data-consent-mode data-auto-block></script>\n\n  <script type="text/plain" data-cookieowl="analytics" src="/js/analytics.js"></script>\n</head>\n<body>\n  <a href="#" data-cookieowl-open>Cookie settings</a>\n</body>\n</html>`, { lang: 'html', title: 'index.html' }),
  react: frame(`import { cookieowl } from 'cookieowl';\nimport { ConsentGate, useConsent } from 'cookieowl/react';\n\ncookieowl.init({ policyUrl: '/privacy', consentMode: true });\n\nexport function Video() {\n  const marketing = useConsent('marketing');\n  return (\n    <ConsentGate category="marketing" fallback={<p>Accept marketing cookies to watch.</p>}>\n      <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Tour" />\n    </ConsentGate>\n  );\n}`, { lang: 'tsx', title: 'src/Video.tsx' }),
  next: frame(`import Script from 'next/script';\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>\n        {children}\n        <Script\n          src="${CDN}"\n          strategy="beforeInteractive"\n          data-policy-url="/privacy"\n          data-consent-mode=""\n        />\n      </body>\n    </html>\n  );\n}`, { lang: 'tsx', title: 'app/layout.tsx' }),
  vue: frame(`import { createApp } from 'vue';\nimport { CookieOwlPlugin } from 'cookieowl/vue';\nimport App from './App.vue';\n\ncreateApp(App)\n  .use(CookieOwlPlugin, { policyUrl: '/privacy', consentMode: true })\n  .mount('#app');\n\n// In a template:\n// <ConsentGate category="marketing">\n//   <iframe src="https://player.vimeo.com/video/123" />\n//   <template #fallback>Accept marketing cookies to watch.</template>\n// </ConsentGate>`, { lang: 'ts', title: 'src/main.ts' }),
  angular: frame(`import { bootstrapApplication } from '@angular/platform-browser';\nimport { cookieowl } from 'cookieowl';\nimport { AppComponent } from './app/app.component';\n\ncookieowl.init({ policyUrl: '/privacy', consentMode: true });\n\nbootstrapApplication(AppComponent);\n\n// Anywhere: cookieowl.on('change', ({ accepted }) => console.log(accepted));`, { lang: 'ts', title: 'src/main.ts' }),
  wordpress: frame(`<?php\n// wp-content/mu-plugins/cookieowl.php\nadd_action('wp_head', function () {\n    $policy = esc_url(get_privacy_policy_url());\n    echo '<script src="${CDN}"'\n        . ' data-policy-url="' . $policy . '" data-consent-mode data-auto-block></script>';\n}, 1);`, { lang: 'php', title: 'cookieowl.php' }),
};
// The built in texts per language, for the placeholders of the generator.
const genTexts = Object.fromEntries(Object.entries(LANGS).map(([code, pack]) => [code, Object.fromEntries(['title', 'description', 'acceptAll', 'rejectAll'].map((k) => [k, pack.t[k].replace('{law}', '')]))]));
const homeCtx = {
  frame,
  texts: genTexts,
  size: sizeLabel,
  trackers: TRACKERS.length,
  langs: Object.keys(LANGS).length,
  trackerNames: nameList,
  suspects: [...new Map(TRACKERS.map((t) => [t.name, [t.id, t.name, t.category]])).values()],
  guideMeta: Object.fromEntries(guides.map((g) => [g.meta.slug, g.meta])),
  frameworks: [
    ['html', 'HTML'],
    ['react', 'React'],
    ['next', 'Next.js'],
    ['vue', 'Vue'],
    ['angular', 'Angular'],
    ['wordpress', 'WordPress'],
  ],
  fwCode,
  how: [
    frame(`<script src="${CDN}"\n  data-consent-mode data-auto-block></script>`, { lang: 'html', title: 'head', compact: true }),
    frame(`<script type="text/plain" data-cookieowl="analytics"\n  src="https://www.googletagmanager.com/gtag/js?id=G-X"></script>\n<iframe data-cookieowl="marketing"\n  data-cookieowl-src="https://youtube.com/embed/ID"></iframe>`, { lang: 'html', title: 'tracker markup', compact: true }),
    frame(`cookieowl.on('change', ({ accepted }) => {\n  console.log('now allowed:', accepted);\n});`, { lang: 'js', title: 'events.js', compact: true }),
  ],
};
out['index.html'] = page(
  {
    kind: 'home',
    path: '',
    nav: '',
    title: 'cookieowl: free cookie consent banner for LGPD and GDPR',
    description: 'An open source cookie banner that keeps trackers from loading until visitors agree. Set it up with one script tag.',
    jsonld: homeJsonLd(),
    // The live demo runs the real script, without the automatic init.
    extraHead: `<script src="assets/cookieowl.js" data-manual></script>
`,
  },
  homeBody(homeCtx),
);

for (const g of guides) {
  idPrefix = `g${GUIDES.findIndex((x) => x.slug === g.meta.slug) + 1}`;
  codeId = 0;
  const rendered = { ...g, body: renderBlocks(g.body) };
  out[`${g.meta.slug}.html`] = page(
    { kind: 'guide', path: `${g.meta.slug}.html`, nav: g.meta.slug === 'lgpd-gdpr-cookie-checklist' ? 'checklist' : 'guides', ogType: 'article', title: g.meta.title, description: g.meta.description, jsonld: guideJsonLd(g.meta) },
    guideBody(rendered, guides),
  );
}

out['guides.html'] = page(
  {
    kind: 'index',
    path: 'guides.html',
    nav: 'guides',
    title: 'Guides | cookieowl',
    description: 'Short guides for cookieowl: a consent checklist, Google Consent Mode v2, Google Analytics and React.',
    jsonld: indexJsonLd(guides),
  },
  indexBody(guides),
);

idPrefix = 'a';
codeId = 0;
const apiCtx = {
  code: {
    quick: frame(`<script src="${CDN}"\n  data-lang="auto" data-policy-url="/privacy"></script>`, { lang: 'html', title: 'index.html' }),
    npm: frame(`import { cookieowl } from 'cookieowl';\n\ncookieowl.init({\n  lang: 'auto',\n  policyUrl: '/privacy',\n  version: '2026-10',\n  consentMode: true,\n  autoBlock: true,\n  onConsent(record) {\n    navigator.sendBeacon('/api/consent', JSON.stringify(record));\n  },\n});\n\nif (cookieowl.accepted('analytics')) startAnalytics();\ncookieowl.on('change', ({ accepted }) => console.log(accepted));`, { lang: 'js', title: 'consent.js' }),
    markup: frame(`<script type="text/plain" data-cookieowl="analytics" src="/stats.js"></script>\n<script type="text/plain" data-cookieowl="analytics marketing">trackBoth();</script>\n<script type="text/plain" data-cookieowl="analytics" data-cookieowl-type="module" src="/app-stats.mjs"></script>\n<iframe data-cookieowl="marketing" data-cookieowl-name="YouTube"\n  data-cookieowl-src="https://www.youtube-nocookie.com/embed/ID" width="560" height="315"></iframe>\n<img data-cookieowl="marketing" data-cookieowl-src="https://ads.example.com/pixel.gif" alt="">\n<a href="#" data-cookieowl-open>Cookie settings</a>`, { lang: 'html', title: 'markup.html' }),
    events: frame(`const off = cookieowl.on('change', ({ categories, changed }) => {\n  if (changed.includes('marketing') && !categories.marketing) removeAdSlots();\n});\n\ndocument.addEventListener('cookieowl:consent', (e) => console.log(e.detail.method));`, { lang: 'js', title: 'events.js' }),
    gcm: frame(`cookieowl.init({\n  consentMode: {\n    waitForUpdate: 500,\n    regions: [{ region: ['US'], analytics_storage: 'granted' }],\n    mapping: { analytics_storage: ['analytics'], ad_storage: ['marketing'] },\n    adsDataRedaction: true,\n    urlPassthrough: false,\n    advanced: false,\n  },\n});`, { lang: 'js', title: 'consent-mode.js' }),
    auto: frame(`cookieowl.init({\n  autoBlock: {\n    patterns: [{ id: 'chat', name: 'Support chat', category: 'preferences', match: /widget\\.chat\\.example/ }],\n    categories: { gtm: 'marketing' },\n    ignore: ['hotjar'],\n  },\n});`, { lang: 'js', title: 'auto-block.js' }),
    record: frame(`interface ConsentRecord {\n  id: string;          // random, kept across updates\n  version: string;     // your policy version\n  timestamp: string;   // ISO 8601\n  expires: string;     // ISO 8601\n  categories: Record<string, boolean>;\n  method: 'accept-all' | 'reject-all' | 'custom' | 'signal';\n  signal?: 'gpc' | 'dnt';\n  lang: string;\n  page: string;\n}`, { lang: 'ts', title: 'types.ts' }),
    css: frame(`:root { --seed: #2f6fed; }\n.cko { --cko-font: Inter, sans-serif; }\n.cko-btn { border-radius: 999px; }`, { lang: 'css', title: 'theme.css' }),
    react: frame(`import { ConsentGate, useConsent, useCookieOwl } from 'cookieowl/react';\n\nfunction Footer() {\n  const owl = useCookieOwl();\n  const all = useConsent(); // { necessary: true, analytics: false, ... }\n  return <button onClick={() => owl.showPreferences()}>Cookie settings</button>;\n}`, { lang: 'tsx', title: 'Footer.tsx' }),
    vue: frame(`<script setup>\nimport { useConsent } from 'cookieowl/vue';\nconst analytics = useConsent('analytics');\n</script>\n\n<template>\n  <ConsentGate category="marketing">\n    <iframe src="https://player.vimeo.com/video/123" title="Video" />\n    <template #fallback>Video hidden until marketing cookies are allowed.</template>\n  </ConsentGate>\n  <p v-if="analytics">Thanks for helping us improve the site.</p>\n</template>`, { lang: 'vue', title: 'Video.vue' }),
  },
  mapping: Object.entries(CONSENT_MODE_MAPPING).map(([k, v]) => [k, v.join(', ')]),
  trackerRows: TRACKERS.map((t) => [t.id, t.name, t.category]),
};
out['api.html'] = page(
  {
    kind: 'api',
    path: 'api.html',
    nav: 'api',
    title: 'cookieowl API reference: options, methods and events',
    description: 'Options, script tag attributes, methods and events of cookieowl.',
    jsonld: apiJsonLd(),
  },
  apiBody(apiCtx),
);

// The 404 page is served at any missing path, so its links are rooted.
// Only plain attributes: Voodoo bindings like :href="r.url" stay expressions.
const rootLinks = (html) => html.replace(/(\s)(href|src)="(?![a-z]+:|#|\/)([^"]*)"/g, (_, sp, a, v) => `${sp}${a}="/cookieowl/${v.replace(/^\.\//, '')}"`);
out['404.html'] = rootLinks(
  page(
    {
      kind: 'notfound',
      path: '404.html',
      noindex: true,
      title: 'Page not found | cookieowl',
      description: 'This page could not be found.',
    },
    notFoundBody(),
  ),
);

// ---------- Search index ----------

const search = [];
search.push({ kind: 'Page', title: 'Banner generator with a live preview', sub: 'Pick a region, a color and your words, copy one line', url: './#configurator' });
search.push({ kind: 'Page', title: 'Live demo: watch the gate hold trackers', sub: 'Accept a category and watch trackers get in', url: './#demo' });
search.push({ kind: 'Page', title: 'API reference', sub: 'Options, methods and events', url: 'api.html' });
search.push({ kind: 'Page', title: 'All guides', sub: 'The storybook shelf', url: 'guides.html' });
for (const g of GUIDES) {
  const src = guides.find((x) => x.meta.slug === g.slug);
  search.push({ kind: 'Guide', title: src.meta.h1, sub: src.meta.description, url: `${g.slug}.html` });
  for (const m of src.body.matchAll(/<section id="([^"]+)"><h2>([\s\S]*?)<\/h2>/g)) search.push({ kind: 'Section', title: m[2].replace(/<[^>]+>/g, ''), sub: g.short, url: `${g.slug}.html#${m[1]}` });
  for (const f of src.meta.faq) search.push({ kind: 'Question', title: f.q.replace(/<[^>]+>/g, ''), sub: g.short, url: `${g.slug}.html#faq` });
}
for (const [q] of FAQ) search.push({ kind: 'Question', title: q.replace(/<[^>]+>/g, ''), sub: 'Home FAQ', url: './#faq' });
for (const grp of CHECKLIST) for (const [, title] of grp.items) search.push({ kind: 'Check', title, sub: grp.group, url: 'lgpd-gdpr-cookie-checklist.html#checklist' });
for (const id of ['options', 'attributes', 'markup', 'methods', 'events', 'consent-mode', 'auto-block', 'record', 'css', 'react', 'vue']) {
  const m = new RegExp(`\\['${id}', '([^']+)'`).exec(readFileSync(join(root, 'site', 'api.mjs'), 'utf8'));
  if (m) search.push({ kind: 'API', title: m[1], sub: 'API reference', url: `api.html#${id}` });
}

// ---------- Sitemap ----------

const urls = ['', 'guides.html', 'api.html', ...GUIDES.map((g) => `${g.slug}.html`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${UPDATED}</lastmod><changefreq>${u ? 'monthly' : 'weekly'}</changefreq><priority>${u ? (u === 'guides.html' ? '0.9' : '0.8') : '1.0'}</priority></url>`).join('\n')}
</urlset>
`;

// ---------- Files ----------

const files = {
  ...out,
  'search.json': `${JSON.stringify(search)}\n`,
  'sitemap.xml': sitemap,
  'robots.txt': `User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${SITE}sitemap.xml\n`,
  '.nojekyll': '',
  'assets/cookieowl.js': dist,
  'favicon.svg': readFileSync(join(root, 'assets', 'favicon.svg'), 'utf8'),
};
for (const f of ['mascot.svg', 'mascot-dark.svg', 'mascot-head.svg', 'mascot-head-dark.svg', 'banner.svg', 'banner-dark.svg']) files[`assets/${f}`] = readFileSync(join(root, 'assets', f), 'utf8');

// The storybook art: every icon and illustration in a light and a dark file.
files['assets/art/palette.css'] = paletteCss();
const THEMES = [
  ['light', DAWN],
  ['dark', NIGHT],
];
const DEMO_BUG_ART = [
  ['analytics', 'binoculars'],
  ['pixel', 'camera'],
  ['heatmap', 'flame'],
  ['chat', 'bubble'],
  ['ads', 'megaphone'],
  ['video', 'reel'],
];
for (const [theme, P] of THEMES) {
  for (const name of ICON_NAMES) files[`assets/art/icons/${name}-${theme}.svg`] = iconFile(name, theme);
  files[`assets/art/icons-sheet-${theme}.svg`] = iconSheet(theme);
  for (const name of SPOT_NAMES) files[`assets/art/spots/${name}-${theme}.svg`] = spotSvg(name, P, { id: `${name}-${theme[0]}` });
  for (const [label, prop] of DEMO_BUG_ART) files[`assets/art/bugs/${label}-${theme}.svg`] = bugSprite(P, { label, prop, id: `bug-${label}-${theme[0]}` });
  files[`assets/art/scenes/hero-${theme}.svg`] = heroScene(P, { id: `hero-${theme[0]}` });
  files[`assets/art/scenes/street-${theme}.svg`] = streetScene(P, { id: `street-${theme[0]}` });
  files[`assets/art/scenes/gate-closed-${theme}.svg`] = demoGate(P, { id: `gc-${theme[0]}` });
  files[`assets/art/scenes/gate-open-${theme}.svg`] = demoGate(P, { id: `go-${theme[0]}`, open: 1 });
  files[`assets/art/scenes/readme-banner-${theme}.svg`] = readmeBanner(P, theme);
}

// House rules for every generated file.
const problems = [];
const dash = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`);
for (const [name, content] of Object.entries(files)) {
  if (name === 'assets/cookieowl.js') continue;
  if (dash.test(content)) problems.push(`${name}: contains an en or em dash`);
  if (/\p{Extended_Pictographic}/u.test(content)) problems.push(`${name}: contains an emoji`);
  if (new RegExp(['tail', 'wind'].join(''), 'i').test(content)) problems.push(`${name}: names another CSS framework`);
  if (name.endsWith('.html')) {
    // Voodoo reads { expressions } in text, so braces must stay inside code.
    const text = content.replace(/<(script|style|pre|code|kbd|samp|textarea|template|noscript)\b[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '');
    const brace = /.{0,40}[{}].{0,40}/.exec(text);
    if (brace) problems.push(`${name}: braces outside code would be read by Voodoo: ${brace[0]}`);
  }
}
for (const g of guides) {
  const n = words(g.body) + words(g.meta.faq.map((f) => `${f.q} ${f.a}`).join(' ')) + words(g.meta.lead);
  if (n < 600) problems.push(`site/guides/${g.meta.slug}.html: only ${n} words, guides need 600 or more`);
}
const titles = new Set();
for (const [name, content] of Object.entries(out)) {
  const t = /<title>([^<]*)<\/title>/.exec(content)[1];
  if (titles.has(t)) problems.push(`${name}: duplicate title ${t}`);
  titles.add(t);
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

if (check) {
  const stale = Object.entries(files).filter(([name, content]) => !existsSync(join(docs, name)) || readFileSync(join(docs, name), 'utf8') !== content);
  if (stale.length) {
    console.error(`docs/ is out of date, run npm run docs:\n${stale.map(([n]) => `  ${n}`).join('\n')}`);
    process.exit(1);
  }
  console.log('docs/ is up to date');
} else {
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(join(docs, name, '..'), { recursive: true });
    writeFileSync(join(docs, name), content);
  }
  const counts = guides.map((g) => `${g.meta.slug} ${words(g.body) + words(g.meta.faq.map((f) => `${f.q} ${f.a}`).join(' ')) + words(g.meta.lead)}`);
  console.log(`built ${Object.keys(out).length} pages and ${Object.keys(files).length - Object.keys(out).length} other files in docs/ (script ${sizeLabel} gzip)\nguide words: ${counts.join(', ')}`);
}
