// Shared page chrome for the cookieowl storybook site: head, top bar, search
// dialog, icon sprite and footer. Used by scripts/build-docs.mjs.
import { ICON_NAMES, VARS, divider, iconSymbol } from '../scripts/storybook.mjs';

export const SITE = 'https://kwy404.github.io/cookieowl/';
export const VERSION = '0.1.0';
export const CDN = `https://cdn.jsdelivr.net/npm/cookieowl@${VERSION}/dist/cookieowl.js`;
export const MONSOON_CSS = 'https://cdn.jsdelivr.net/npm/monsooncss@0.2.0/dist/monsoon.min.css';
export const VOODOO_JS = 'https://cdn.jsdelivr.net/npm/voodoojs@1.0.0/dist/voodoo.full.min.js';
export const GITHUB = 'https://github.com/kwy404/cookieowl';
export const NPM = 'https://www.npmjs.com/package/cookieowl';
export const AUTHOR_GH = 'https://github.com/kwy404';
export const AUTHOR_IN = 'https://www.linkedin.com/in/alexandre-silva-173687256/';
export const UPDATED = '2026-10-13';
export const UPDATED_LABEL = 'October 13, 2026';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The guides, in reading order. `short` labels navigation, `icon` comes from the icon set. */
export const GUIDES = [
  { slug: 'lgpd-gdpr-cookie-checklist', short: 'LGPD and GDPR checklist', icon: 'scroll', spot: 'checklist' },
  { slug: 'google-consent-mode-v2-setup', short: 'Google Consent Mode v2', icon: 'consent-mode', spot: 'consent-mode' },
  { slug: 'block-google-analytics-until-consent', short: 'Holding Google Analytics', icon: 'gate', spot: 'block-ga' },
  { slug: 'cookie-consent-in-react', short: 'Using it with React', icon: 'code', spot: 'react' },
];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
export const roman = (n) => ROMAN[n - 1] || String(n);

export const MORE = [
  ['Monsoon', 'https://kwy404.github.io/monsoon/', 'Utility-first CSS with no build step'],
  ['Voodoo.js', 'https://kwy404.github.io/Voodoo.js/', 'Reactive attributes for plain HTML'],
  ['breakhound', 'https://kwy404.github.io/breakhound/', 'Find bugs in JavaScript libraries'],
  ['vueleap', 'https://kwy404.github.io/vueleap/', 'Vue 2 to Vue 3 migration'],
  ['graphemely', 'https://kwy404.github.io/graphemely/', 'Grapheme aware string utilities'],
  ['numberparrot', 'https://kwy404.github.io/numberparrot/', 'Parse localized numbers'],
  ['edgegoat', 'https://kwy404.github.io/edgegoat/', 'Edge case inputs for testing'],
  ['installkite', 'https://kwy404.github.io/installkite/', 'Make any website installable and offline'],
  ['a11ymedic', 'https://kwy404.github.io/a11ymedic/', 'Accessibility checker with exact fixes'],
  ['fontsketch', 'https://kwy404.github.io/fontsketch/', 'Turn your handwriting into a font'],
  ['kastor', 'https://kwy404.github.io/kastor/', 'TypeScript ORM for almost every database'],
];

// UI icons (24 by 24, stroked with currentColor).
const UI = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  github: '<path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  npm: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 17V7h10v10h-3V10h-2v7Z"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>',
  system: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  book: '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h13"/>',
  reset: '<path d="M4 4v6h6"/><path d="M5 15a8 8 0 1 0 2-8.5L4 10"/>',
  play: '<path d="m7 4 13 8-13 8Z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
};

/** An inline UI icon from the sprite. */
export const icon = (name, cls = 'ic') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
/** A storybook icon (navy line, amber tint) from the sprite. */
export const art = (name, cls = 'ki') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#k-${name}"/></svg>`;
/** The hand drawn divider. */
export const rule = () => `<div class="rule" aria-hidden="true">${divider()}</div>`;

/** An exported illustration as a light and a dark image; only the one for the theme is shown and loaded. */
export function pic(path, alt, { w = 320, h = 240, cls = 'pic', lazy = true, only } = {}) {
  const l = lazy ? ' loading="lazy" decoding="async"' : '';
  const a = esc(alt);
  if (only) return `<img class="${cls}" src="assets/art/${path}-${only}.svg" width="${w}" height="${h}" alt="${a}"${l}>`;
  return `<span class="pic${cls === 'pic' ? '' : ` ${cls}`}"><img class="only-light" src="assets/art/${path}-light.svg" width="${w}" height="${h}" alt="${a}"${l}><img class="only-dark" src="assets/art/${path}-dark.svg" width="${w}" height="${h}" alt=""${l}></span>`;
}

export function sprite() {
  const ui = Object.entries(UI)
    .map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`)
    .join('');
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${ui}${ICON_NAMES.map(iconSymbol).join('')}</svg>`;
}

const THEME_SNIPPET = `<script>(function(){try{var t=localStorage.getItem('voodoo:theme');if(t&&t.charAt(0)==='"')t=JSON.parse(t);var r=document.documentElement;if(t==='light'||t==='dark'){r.setAttribute('data-theme',t);r.style.colorScheme=t}else{r.removeAttribute('data-theme')}}catch(e){}})();</script>`;

const FONTS = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600&amp;family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,500..800,100,1;1,9..144,600..800,100,1&amp;family=Nunito+Sans:ital,opsz,wght@0,6..12,400..800;1,6..12,400&amp;display=swap';

/** The document head. */
export function head(p) {
  const url = SITE + (p.path || '');
  const ld = p.jsonld ? `\n<script type="application/ld+json">\n${JSON.stringify(p.jsonld, null, 2)}\n</script>` : '';
  const extra = p.extraHead || '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
${THEME_SNIPPET}
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
${p.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta name="author" content="Alexandre Kohler">
<meta name="theme-color" content="#fbf6ec" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b1030" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="cookieowl">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="cookieowl: Hoot the owl guards a little town of websites while tracker bugs wait at the consent gate">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${SITE}og.png">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${MONSOON_CSS}">
<link rel="stylesheet" href="assets/art/palette.css">
<link rel="stylesheet" href="site.css">
${extra}<script src="${VOODOO_JS}" data-manual defer></script>
<script type="module" src="site.js"></script>${ld}
</head>`;
}

const NAV = [
  ['configurator', 'Generator', './#configurator', 'sparkles'],
  ['demo', 'Live demo', './#demo', 'gate'],
  ['checklist', 'Checklist', 'lgpd-gdpr-cookie-checklist.html', 'scroll'],
  ['guides', 'Guides', 'guides.html', 'book'],
  ['api', 'API', 'api.html', 'key'],
];

/** The top bar. `current` marks the active nav item. */
export function topbar(current = '') {
  const links = NAV.map(([key, label, href, ic]) => `<a href="${href}" class="top-link"${key === current ? ' aria-current="page"' : ''}>${art(ic, 'ki ki-nav')}<span>${label}</span></a>`).join('');
  return `<a href="#main" class="skip-link">Skip to content</a>
<header class="topbar" v-data="{ open: false }" @keydown.escape="open = false">
  <div class="wrap topbar-in">
    <a href="./" class="brand" aria-label="cookieowl home"><img src="assets/mascot-head.svg" class="only-light" width="38" height="38" alt=""><img src="assets/mascot-head-dark.svg" class="only-dark" width="38" height="38" alt=""><span class="brand-name">cookie<b>owl</b></span></a>
    <nav id="topnav" class="topnav" :class="{ 'is-open': open }" aria-label="Main" @click="open = false">${links}</nav>
    <div class="top-right">
      <button type="button" class="search-btn" data-search-open v-hotkey="mod+k" aria-haspopup="dialog" aria-label="Search the site">${icon('search')}<span class="search-label">Search</span><kbd class="kbd kbd-xs">Ctrl K</kbd></button>
      <a href="${GITHUB}" class="icon-btn" aria-label="cookieowl on GitHub">${icon('github')}</a>
      <button type="button" class="icon-btn theme-btn" v-theme-toggle.cycle aria-label="Switch theme" title="Theme: system, dawn or night">${icon('system', 'ic ti-system')}${icon('sun', 'ic ti-light')}${icon('moon', 'ic ti-dark')}</button>
      <button type="button" class="icon-btn nav-btn" aria-controls="topnav" :aria-expanded="open ? 'true' : 'false'" aria-expanded="false" @click="open = !open" aria-label="Menu">${icon('menu')}</button>
    </div>
  </div>
</header>`;
}

/** The Ctrl K search dialog, filled by site.js from search.json. */
export function searchDialog() {
  return `<dialog id="search" class="modal modal-top search-dlg" aria-label="Search the site">
  <div class="command-palette" v-data="{ q: '', sel: 0 }" @keydown.down.prevent="sel = Math.min(sel + 1, hits(q, S.ready).length - 1)" @keydown.up.prevent="sel = Math.max(sel - 1, 0)" @keydown.enter.prevent="go(q, sel)">
    <label class="command-palette-search">${art('lantern')}<input id="search-input" class="command-palette-input" v-model="q" @input="sel = 0" placeholder="Search guides, options and questions" autocomplete="off" spellcheck="false" aria-label="Search" aria-controls="search-results"></label>
    <div id="search-results" class="command-palette-list" role="listbox" aria-label="Results">
      <p class="command-palette-heading" v-if="!q">Hoot suggests</p>
      <a v-for="(r, i) in hits(q, S.ready)" :key="r.url" :href="r.url" class="command-palette-item" role="option" :aria-selected="i === sel ? 'true' : 'false'" @mouseenter="sel = i"><span class="hit-kind" v-text="r.kind"></span><span class="hit-text"><span class="hit-title" v-text="r.title"></span><span class="hit-sub" v-text="r.sub"></span></span></a>
      <p class="command-palette-empty" v-if="q && !hits(q, S.ready).length">Nothing here. Hoot looked under every cookie jar.</p>
    </div>
    <div class="command-palette-footer"><span><kbd class="kbd kbd-xs">Enter</kbd> open</span><span><kbd class="kbd kbd-xs">Esc</kbd> close</span></div>
  </div>
  <form method="dialog" class="modal-backdrop"><button aria-label="Close search">Close</button></form>
</dialog>`;
}

/** The rooftops that close every page, always at night. */
function footRoofs() {
  const P = VARS;
  const tops = [[0, 70], [40, 70], [60, 46], [80, 70], [130, 70], [130, 56], [190, 56], [190, 76], [240, 76], [270, 40], [300, 76], [360, 76], [360, 60], [420, 60], [420, 82], [470, 82], [500, 52], [530, 82], [600, 82], [600, 64], [660, 64], [690, 36], [720, 64], [780, 64], [780, 80], [840, 80], [870, 54], [900, 80], [960, 80], [960, 62], [1020, 62], [1020, 74], [1080, 74], [1110, 44], [1140, 74], [1200, 74]];
  const d = `M0 121${tops.map(([x, y]) => `L${x} ${y}`).join('')}V121Z`;
  const wins = [[95, 84], [150, 70], [205, 90], [318, 92], [380, 74], [440, 96], [545, 96], [620, 78], [700, 70], [800, 94], [885, 88], [985, 76], [1040, 88], [1120, 80], [1170, 92]]
    .map(([x, y], i) => `<rect class="win-lit${i % 3 ? '' : ' win-blink'}" x="${x}" y="${y}" width="7" height="9" rx="1.5" fill="${P.win}"/>`)
    .join('');
  return `<svg class="foot-roofs" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${d}" fill="${P.hill3}"/>${wins}</svg>`;
}

/** The footer, the same on every page. */
export function footer() {
  const guides = GUIDES.map((g) => `<li><a href="${g.slug}.html">${g.short}</a></li>`).join('');
  const more = MORE.map(([n, u, d]) => `<li><a href="${u}">${n}</a><small>${d}</small></li>`).join('');
  return `<footer class="site-foot dark">
  ${footRoofs()}
  <div class="foot-night">
  <div class="wrap">
    <p class="the-end"><span>The end.</span> Goodnight, trackers.</p>
    <div class="foot-grid">
      <div class="foot-about">
        <a href="./" class="brand"><img src="assets/mascot-dark.svg" width="64" height="64" alt="" loading="lazy"><span class="brand-name">cookie<b>owl</b></span></a>
        <p>A cookie consent banner for LGPD and GDPR that keeps trackers outside the gate until visitors say yes. One script tag, under 15 kB, MIT licensed.</p>
        <p class="foot-links"><a href="${GITHUB}">${icon('github')}GitHub</a><a href="${NPM}">${icon('npm')}npm</a><a href="${GITHUB}/blob/main/CHANGELOG.md">${art('logbook')}Changelog</a></p>
      </div>
      <nav aria-labelledby="f-site"><h2 id="f-site" class="foot-title">The town</h2><ul>
        <li><a href="./#configurator">Banner generator</a></li><li><a href="./#demo">Live demo</a></li><li><a href="./#how">How blocking works</a></li><li><a href="./#frameworks">React, Vue, Next.js</a></li><li><a href="api.html">API reference</a></li><li><a href="guides.html">All guides</a></li><li><a href="./#faq">FAQ</a></li>
      </ul></nav>
      <nav aria-labelledby="f-guides"><h2 id="f-guides" class="foot-title">Guides</h2><ul>${guides}</ul></nav>
      <nav aria-labelledby="f-more"><h2 id="f-more" class="foot-title">More from kwy404</h2><ul class="foot-more">${more}</ul></nav>
    </div>
    <div class="foot-bottom">
      <p>Made by <a href="${AUTHOR_GH}" rel="me noopener">Alexandre Kohler</a><a href="${AUTHOR_GH}" class="foot-ic" rel="me noopener" aria-label="Alexandre Kohler on GitHub">${icon('github')}</a><a href="${AUTHOR_IN}" class="foot-ic" rel="me noopener" aria-label="Alexandre Kohler on LinkedIn">${icon('linkedin')}</a></p>
      <p>Built with <a href="https://kwy404.github.io/monsoon/">Monsoon</a>. Interactive parts built with <a href="https://kwy404.github.io/Voodoo.js/">Voodoo.js</a>. MIT licensed. Not legal advice.</p>
    </div>
  </div>
  </div>
</footer>`;
}

/** Wraps a page body with the shared chrome. */
export function page(p, body) {
  return `${head(p)}
<body class="antialiased bg-background text-foreground page-${p.kind}">
${sprite()}
${topbar(p.nav)}
<main id="main">
${body}
</main>
${footer()}
${searchDialog()}
</body>
</html>
`;
}
