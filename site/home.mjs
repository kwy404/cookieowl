// The landing page, told as a storybook in chapters: the hero town, the
// banner generator with its live preview (the centerpiece), the street of the
// live demo with its logbook, how blocking works, the promises, frameworks,
// the shelf of guides and the FAQ.
import { bug, demoGate, heroLayer, streetScene, VARS } from '../scripts/storybook.mjs';
import { SEASONS, SEASON_ICONS } from '../scripts/seasons.mjs';
import { CDN, GITHUB, GUIDES, SITE, VERSION, art, esc, icon, pic, roman, rule } from './layout.mjs';
import { bookCard } from './pages.mjs';

export const FAQ = [
  [
    'Does cookieowl really block Google Analytics before consent?',
    'Yes. Scripts you mark with <code>type="text/plain"</code> and <code>data-cookieowl="analytics"</code> are not executed by the browser at all, so gtag.js is never requested until analytics is accepted. With <code>data-auto-block</code> the gtag.js and Tag Manager URLs are also caught when they are inserted by a snippet. If you use Consent Mode advanced instead, Google tags load and send cookieless pings, which you choose explicitly.',
  ],
  [
    'Does it support Google Consent Mode v2?',
    'Yes. With <code>consentMode</code> on, cookieowl sets <code>ad_storage</code>, <code>ad_user_data</code>, <code>ad_personalization</code> and <code>analytics_storage</code> to denied with <code>wait_for_update</code> before any tag runs, supports region specific defaults, and sends a consent update on every choice, including on later visits.',
  ],
  [
    'Is a cookie banner enough to comply with LGPD or GDPR?',
    'No banner alone makes a site compliant. cookieowl handles the technical part: prior blocking, granular and free choice, withdrawal as easy as consent, versioned records and an audit hook. You still need an accurate privacy policy, a legal basis for each processing and a review by your own counsel. This site is not legal advice.',
  ],
  [
    'Where is the consent stored and for how long?',
    'In a first party cookie named <code>cookieowl</code> (or localStorage if you prefer) holding the categories, a random consent id, the policy version, a timestamp and an expiry date. The default lifetime is 12 months, after which the banner asks again. Changing your policy version asks everyone again right away.',
  ],
  [
    'How do visitors change their mind?',
    'A small floating owl button reopens the preferences on every page, and any element with <code>data-cookieowl-open</code> does the same, for example a Cookie settings link in your footer. Withdrawing erases the cookies of that category and reloads the page when its scripts already ran.',
  ],
  [
    'What happens with Global Privacy Control?',
    'When a browser sends Global Privacy Control, cookieowl records a refusal of optional categories, does not show the banner and notes the signal in the preferences, where the visitor can still opt in. Do Not Track can be honored the same way with <code>respectDNT</code>.',
  ],
];

const FEATURES = [
  ['gate', 'Real blocking before consent', 'Marked scripts and iframes stay inert, then run in document order once their category is accepted.'],
  ['auto-block', 'Auto mode for known trackers', 'Google Analytics, Tag Manager, Meta Pixel, Clarity, Hotjar, LinkedIn and TikTok are caught by URL, even when a snippet injects them.'],
  ['consent-mode', 'Google Consent Mode v2', 'Denied defaults with wait_for_update, region defaults, an update on every choice and a dataLayer event for Tag Manager.'],
  ['video-embed', 'Click to load embeds', 'YouTube and Vimeo iframes become a placeholder with Load once and Allow marketing cookies.'],
  ['cookie-jar', 'Categories and services', 'Necessary, preferences, analytics, marketing and your own, each with services, cookies and durations.'],
  ['record', 'Records for audits', 'Version, timestamp, random consent id and method in a first party cookie, plus an onConsent hook for your log.'],
  ['withdraw', 'Withdraw as easily as giving', 'A floating owl reopens the preferences anywhere, and withdrawal erases cookies and stops scripts.'],
  ['signal', 'Privacy signals respected', 'Global Privacy Control is honored by default, Do Not Track when you turn it on.'],
  ['accessibility', 'Accessible, no dark patterns', 'Focus trap, keyboard, screen reader labels, Reject as prominent as Accept and no pre-ticked boxes.'],
  ['language', 'Five languages, LGPD and GDPR', 'Portuguese with LGPD wording, English, Spanish, French and German, RTL safe, every text overridable.'],
  ['moon', 'Themed by one color', 'Light and dark mode out of the box and a --seed color for the accent, in a scoped stylesheet.'],
  ['balloon', 'One small file', 'About 15 kB gzip, no dependencies, no requests of its own, no account and no server.'],
];

/** The icon for each known tracker on the wanted posters. */
const SUSPECT_ICONS = { gtag: 'svc-analytics', gtm: 'tag-manager', 'google-ads': 'marketing', 'meta-pixel': 'pixel', clarity: 'heatmap', hotjar: 'heatmap', 'linkedin-insight': 'pixel', 'tiktok-pixel': 'pixel', youtube: 'video-embed', vimeo: 'video-embed' };

/** The tracker bugs of the demo street, drawn once as symbols. */
export const DEMO_BUGS = [
  ['stats', 'StarStats analytics', 'analytics', 'binoculars', 'analytics'],
  ['heatmap', 'Heatmap recorder', 'analytics', 'flame', 'heatmap'],
  ['ads', 'Retargeting ads', 'marketing', 'megaphone', 'ads'],
  ['chat', 'Live chat widget', 'preferences', 'bubble', 'chat'],
  ['pixel', 'NightPixel', 'marketing', 'camera', 'pixel'],
];

/** A chapter heading: the number, an icon, the title and a hand drawn rule. */
export function chHead(n, ic, kicker, title, text, id) {
  return `<header class="ch-head">
  <p class="ch-no">${art(ic, 'ki ki-lg')}<span>Chapter ${roman(n)}</span><span class="ch-kicker">${kicker}</span></p>
  <h2 id="${id}">${title}</h2>
  ${text ? `<p>${text}</p>` : ''}
  ${rule()}
</header>`;
}

function bugSymbols() {
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${DEMO_BUGS.map(
    ([key, , , prop, label]) => `<symbol id="bug-${key}" viewBox="0 0 120 118">${bug(VARS, { x: 60, y: 54, s: 1, label, prop })}</symbol>`,
  ).join('')}</svg>`;
}

function demoBug([key, name], where) {
  return `<span class="dbug dbug-${key}" :class="bugCls(M.rows, '${key}', '${where}')" title="${esc(name)}"><svg viewBox="0 0 120 118"><use href="#bug-${key}"/></svg></span>`;
}

function demoSite() {
  return `<div id="demo-site" class="demo-site light" data-demo-site>
  <header class="ds-top"><span class="ds-logo" aria-hidden="true"></span><b>Nightjar Coffee</b><nav aria-label="Demo shop"><span>Beans</span><span>Brewing</span><span>Journal</span></nav></header>
  <div class="ds-hero"><p class="ds-kicker">Small batch, roasted at night</p><p class="ds-title">Coffee for people who stay up late</p><p class="ds-text">A pretend shop with four pretend trackers. None of them may come in until you say so.</p></div>
  <div class="ds-grid">
    <div class="ds-card"><span class="ds-bean" aria-hidden="true"></span><b>Midnight Blend</b><small>Dark chocolate, plum</small></div>
    <div class="ds-card"><span class="ds-bean ds-bean-2" aria-hidden="true"></span><b>Owl Roast</b><small>Caramel, hazelnut</small></div>
    <div class="ds-video"><iframe data-cookieowl="marketing" data-cookieowl-name="StarTube" data-cookieowl-src="demo/video.html" width="320" height="180" title="StarTube video: a night sky timelapse" loading="lazy"></iframe></div>
  </div>
  <footer class="ds-foot"><span>Nightjar Coffee, a demo shop</span><a href="#" data-cookieowl-open>Cookie settings</a></footer>
</div>
<template id="demo-scripts">
<script type="text/plain" data-cookieowl="analytics" data-cookieowl-src="demo/trackers/stats.js" data-demo="StarStats analytics"></script>
<script type="text/plain" data-cookieowl="analytics" data-cookieowl-src="demo/trackers/heatmap.js" data-demo="Heatmap recorder"></script>
<script type="text/plain" data-cookieowl="marketing" data-cookieowl-src="demo/trackers/ads.js" data-demo="Retargeting ads"></script>
<script type="text/plain" data-cookieowl="preferences" data-cookieowl-src="demo/trackers/chat.js" data-demo="Live chat widget"></script>
</template>`;
}

function logbook() {
  return `<aside class="logbook" aria-labelledby="log-title" v-data="{ tab: 'net' }">
  <div class="log-head"><h3 id="log-title">${art('logbook')}Night watch logbook</h3><span class="log-status" v-text="M.status"></span></div>
  <div class="log-tabs" role="tablist" aria-label="Logbook pages">
    <button type="button" role="tab" :aria-selected="tab === 'net' ? 'true' : 'false'" aria-selected="true" @click="tab = 'net'">${art('door', 'ki ki-sm')}Arrivals</button>
    <button type="button" role="tab" :aria-selected="tab === 'gcm' ? 'true' : 'false'" aria-selected="false" @click="tab = 'gcm'">${art('consent-mode', 'ki ki-sm')}Consent Mode</button>
    <button type="button" role="tab" :aria-selected="tab === 'jar' ? 'true' : 'false'" aria-selected="false" @click="tab = 'jar'">${art('cookie-jar', 'ki ki-sm')}Cookie jar</button>
  </div>
  <div class="log-page" role="tabpanel" v-show="tab === 'net'" aria-label="Scripts and requests">
    <ol class="log-list" aria-live="polite">
      <li v-for="r in M.rows" :key="r.id" :class="'log-row is-' + r.state"><span class="stamp" v-text="label(r.state)"></span><span class="log-what"><b v-text="r.name"></b><small v-text="r.url"></small></span><span class="log-cat" v-text="r.cat"></span></li>
    </ol>
  </div>
  <div class="log-page" role="tabpanel" v-show="tab === 'gcm'" aria-label="Consent Mode commands">
    <ol class="log-list">
      <li v-for="g in M.gcm" :key="g.id" class="log-row is-cmd"><span class="stamp" v-text="g.cmd"></span><span class="log-what"><b v-text="g.title"></b><small v-text="g.detail"></small></span></li>
    </ol>
  </div>
  <div class="log-page" role="tabpanel" v-show="tab === 'jar'" aria-label="Cookies on this page">
    <ol class="log-list">
      <li v-for="c in M.cookies" :key="c.name" class="log-row is-cookie"><span class="stamp">set</span><span class="log-what"><b v-text="c.name"></b><small v-text="c.value"></small></span></li>
    </ol>
    <p class="log-empty" v-if="!M.cookies.length">The jar is empty. Accept a category to see trackers set their cookies, then withdraw it and watch them go.</p>
  </div>
</aside>`;
}

/** The hero accents of every season (docs/seasons.js sets html[data-season]); only the active one is shown and loaded. */
function seasonArt() {
  return `<div class="layer-box art-box season-art" aria-hidden="true">${SEASONS.map((id) => `<span class="season-only season-${id}"><img class="only-light" src="assets/seasons/${id}/hero-light.svg" alt="" loading="lazy" decoding="async"><img class="only-dark" src="assets/seasons/${id}/hero-dark.svg" alt="" loading="lazy" decoding="async"></span>`).join('')}</div>`;
}

/** The seasonal icons under the hero, one row per season. */
function seasonIcons() {
  return SEASONS.map((id) => `<ul class="wrap season-icons season-only season-${id}" aria-hidden="true">${SEASON_ICONS[id].map((n) => `<li><img class="only-light" src="assets/seasons/${id}/icon-${n}-light.svg" alt="" width="28" height="28" loading="lazy"><img class="only-dark" src="assets/seasons/${id}/icon-${n}-dark.svg" alt="" width="28" height="28" loading="lazy"></li>`).join('')}</ul>`).join('');
}

/** Region presets of the generator: value, title, law, icon, what it sets. */
const PRESET_CARDS = [
  ['lgpd', 'Brazil', 'LGPD', 'lgpd', 'Portuguese texts and LGPD wording, Consent Mode v2 and auto blocking on.'],
  ['gdpr', 'Europe and UK', 'GDPR', 'gdpr', "The visitor's language and GDPR wording, Consent Mode v2 and auto blocking on."],
  ['', 'No preset', 'Custom', 'compass', "The visitor's language and the default wording. Switch on only what you need."],
];

/** Accent swatches of the generator. The first one is the cookieowl default. */
const SWATCHES = [
  ['#f2b134', 'Amber'],
  ['#2f6fed', 'Ocean'],
  ['#1f9d63', 'Leaf'],
  ['#d6336c', 'Berry'],
  ['#7c4dff', 'Violet'],
  ['#1b2547', 'Ink'],
];

const LANG_OPTIONS = [
  ['pt-BR', 'Português (Brasil)'],
  ['en', 'English'],
  ['es', 'Español'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
];

/**
 * Chapter I, the centerpiece: the banner generator. The form is bound to the
 * G store of site.js, which renders the live preview (the real script in an
 * iframe) and the one line to copy. ctx.texts holds the built in texts per
 * language for the placeholders.
 */
function generator(ctx) {
  const checked = (on) => (on ? ' checked' : '');
  const presets = PRESET_CARDS.map(
    ([v, title, law, ic, text]) =>
      `<label class="pcard"><input type="radio" class="vh" name="gen-preset" value="${v}" v-model="G.preset"${checked(v === 'gdpr')}><span class="pcard-top">${art(ic, 'ki ki-lg')}<span><b>${title}</b><small>${law}</small></span></span><span class="pcard-text">${text}</span></label>`,
  ).join('');
  const layouts = [
    ['box', 'Corner box'],
    ['bar', 'Bottom bar'],
    ['modal', 'Center modal'],
  ]
    .map(([v, label]) => `<label class="lcard"><input type="radio" class="vh" name="gen-layout" value="${v}" v-model="G.layout"${checked(v === 'box')}><span class="lay lay-${v}" aria-hidden="true"><i></i></span><span>${label}</span></label>`)
    .join('');
  const themes = [
    ['auto', 'Follow the page'],
    ['light', 'Light'],
    ['dark', 'Dark'],
  ]
    .map(([v, label]) => `<label class="segmented-item"><input type="radio" name="gen-theme" value="${v}" v-model="G.theme"${checked(v === 'auto')}> ${label}</label>`)
    .join('');
  const swatches = SWATCHES.map(([hex, name], i) => `<label class="swatch" style="--sw:${hex}" title="${name}"><input type="radio" class="vh" name="gen-accent" value="${hex}" v-model="G.accent"${checked(i === 0)} aria-label="${name}"><i aria-hidden="true"></i></label>`).join('');
  const langs = LANG_OPTIONS.map(([v, label]) => `<option value="${v}">${label}</option>`).join('');
  const field = (key, label) => `<label class="field"><span class="label">${label}</span><input class="input" v-model="G.${key}" :placeholder="genPh(G, '${key}')" maxlength="80"></label>`;
  const cat = (id, label, text) => `<label class="gcat"><input type="checkbox" class="toggle toggle-sm" role="switch" v-model="G.${id}" checked>${art(id, 'ki')}<span><b>${label}</b><small>${text}</small></span></label>`;
  const toggle = (key, label, extra = '') => `<label class="label gtoggle"><input type="checkbox" class="toggle toggle-sm" role="switch" v-model="G.${key}"${extra}> ${label}</label>`;
  const defaultLine = `<script src="${CDN}" data-preset="gdpr" data-policy-url="/privacy"></script>`;

  return `<section id="configurator" class="chapter gen-sec" aria-labelledby="gen-title">
  <div class="wrap">
    ${chHead(1, 'sparkles', 'Generator', 'Design your banner, then copy one line', 'Every change shows up in the preview right away. The preview is the real cookieowl, running the same line you copy.', 'gen-title')}
    <script type="application/json" id="gen-texts">${JSON.stringify(ctx.texts)}</script>
    <div class="gen">
      <form class="gen-form" aria-label="Banner options" @submit.prevent>
        <fieldset class="gstep"><legend><span class="gstep-no" aria-hidden="true">1</span>Where are your visitors?</legend>
          <div class="pcards">${presets}</div>
        </fieldset>
        <fieldset class="gstep"><legend><span class="gstep-no" aria-hidden="true">2</span>Make it yours</legend>
          <div class="gsub"><span class="label">Layout</span><div class="lcards">${layouts}</div></div>
          <div class="gsub"><span class="label" id="gen-accent-label">Accent color</span>
            <div class="swatches" role="radiogroup" aria-labelledby="gen-accent-label">${swatches}<label class="swatch swatch-custom" title="Any color"><input type="color" v-model="G.accent" aria-label="Pick any accent color"><i aria-hidden="true"></i></label><code class="sw-hex" v-text="G.accent">#f2b134</code></div>
          </div>
          <div class="gsub"><span class="label" id="gen-theme-label">Theme</span><div class="segmented" role="radiogroup" aria-labelledby="gen-theme-label">${themes}</div></div>
        </fieldset>
        <fieldset class="gstep"><legend><span class="gstep-no" aria-hidden="true">3</span>Your words</legend>
          <label class="field"><span class="label">Language</span><select class="select" v-model="G.lang"><option value="auto" v-text="G.preset === 'lgpd' ? 'Portuguese, from the LGPD preset' : 'Automatic: the page, then the browser'">Automatic: the page, then the browser</option>${langs}</select></label>
          ${field('title', 'Title')}
          <label class="field"><span class="label">Message</span><textarea class="textarea" rows="3" v-model="G.description" :placeholder="genPh(G, 'description')" maxlength="320"></textarea></label>
          <div class="gpair">${field('rejectAll', 'Reject button')}${field('acceptAll', 'Accept button')}</div>
          <p class="ghint">Leave a field empty to keep the built in text, translated into all five languages. Your own words are shown in every language.</p>
        </fieldset>
        <fieldset class="gstep"><legend><span class="gstep-no" aria-hidden="true">4</span>What do you ask for?</legend>
          <div class="gcats">
            <p class="gcat gcat-on">${art('necessary', 'ki')}<span><b>Necessary</b><small>Always on, no choice needed</small></span></p>
            ${cat('preferences', 'Preferences', 'Language, chat, saved settings')}
            ${cat('analytics', 'Analytics', 'Google Analytics, Clarity, Hotjar')}
            ${cat('marketing', 'Marketing', 'Ads, pixels, video embeds')}
          </div>
          <p class="ghint gempty" v-if="!G.preferences && !G.analytics && !G.marketing">Only necessary cookies: there is nothing to ask, so you may not need a banner at all. Switch a category on if you use trackers.</p>
          <details class="gmore"><summary>More options</summary>
            <label class="field"><span class="label">Privacy policy link</span><input class="input" v-model="G.policy" placeholder="/privacy" spellcheck="false"></label>
            ${toggle('consentMode', 'Google Consent Mode v2')}
            ${toggle('advanced', 'Advanced mode: Google tags load and send cookieless pings', ' :disabled="!G.consentMode"')}
            ${toggle('autoBlock', 'Auto block known trackers')}
            ${toggle('gpc', 'Honor Global Privacy Control')}
          </details>
        </fieldset>
      </form>
      <div class="gen-out">
        <div class="pv" :class="'pv-' + G.page">
          <div class="pv-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="browser-url">${icon('lock')}your-site.example</span>
            <button type="button" class="pv-btn" @click="G.page = G.page === 'dark' ? 'light' : 'dark'" :aria-label="G.page === 'dark' ? 'Preview on a light page' : 'Preview on a dark page'" aria-label="Preview on a dark page" title="Light or dark page">${icon('moon', 'ic pv-moon')}${icon('sun', 'ic pv-sun')}</button>
            <button type="button" class="pv-btn" @click="genReplay()" aria-label="Show the banner again" title="Show the banner again">${icon('reset')}</button>
          </div>
          <div class="pv-stage" data-gen-preview><iframe title="Live preview of your cookie banner"></iframe><iframe title="Live preview of your cookie banner" tabindex="-1" aria-hidden="true"></iframe></div>
        </div>
        <div class="segmented gen-mode" role="radiogroup" aria-label="Install with">
          <label class="segmented-item"><input type="radio" name="gen-mode" value="tag" v-model="G.mode" checked> Script tag</label>
          <label class="segmented-item"><input type="radio" name="gen-mode" value="npm" v-model="G.mode"> npm</label>
        </div>
        <figure class="frame frame-editor gen-frame"><div class="frame-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="frame-tab"><span v-text="G.mode === 'npm' ? 'consent.js' : 'index.html'">index.html</span></span></div><pre class="shiki" tabindex="0" aria-label="Your snippet"><code id="gen-code" v-html="genHtml(G)">${esc(defaultLine)}</code></pre></figure>
        <div class="gen-actions">
          <button type="button" class="btn btn-primary gen-copy" :class="{ 'is-done': G.copied }" @click="genCopy()">${icon('copy', 'ic gc-copy')}${icon('check', 'ic gc-check')}<span v-text="G.copied ? 'Copied' : G.mode === 'npm' ? 'Copy the code' : 'Copy the line'">Copy the line</span></button>
          <button type="button" class="btn btn-outline" @click="tryInDemo()">${art('gate', 'ki ki-btn')}Try it on the demo shop</button>
        </div>
        <p class="gen-note" v-show="G.mode !== 'npm'">Paste it as the first line inside <code>&lt;head&gt;</code>, without <code>async</code> or <code>defer</code>. Then <a href="#how">mark your trackers</a> so they wait for consent.</p>
        <p class="gen-note" v-show="G.mode === 'npm'">Run <code>npm install cookieowl</code> and call this before any tracker loads. Then <a href="#how">mark your trackers</a> so they wait for consent.</p>
      </div>
    </div>
  </div>
</section>`;
}

/** The home page body. ctx: { frame, size, trackers, langs, suspects, guideMeta, texts } */
export function homeBody(ctx) {
  const half = FEATURES.length / 2;
  const promise = ([ic, t, d]) => `<li class="promise"><span class="promise-ic">${art(ic, 'ki ki-lg')}</span><div><h3>${t}</h3><p>${d}</p></div></li>`;
  const faq = FAQ.map(([q, a], i) => `<details class="collapse" name="faq"${i === 0 ? ' open' : ''}><summary class="collapse-title">${q}</summary><div class="collapse-content"><p>${a}</p></div></details>`).join('');
  const shelf = GUIDES.map((g, i) => bookCard(g, ctx.guideMeta[g.slug], i + 1, { h: 'h3' })).join('');
  const suspects = ctx.suspects
    .map(([id, name, cat]) => `<li class="poster"><span class="poster-top">Wanted</span>${art(SUSPECT_ICONS[id] || 'bug', 'ki ki-xl')}<b>${name}</b><span class="poster-cat cat-${cat}">${cat}</span></li>`)
    .join('');
  const fw = ctx.frameworks
    .map(([id, label], i) => `<input type="radio" name="fw" class="tab" aria-label="${label}"${i === 0 ? ' checked' : ''}><div class="tab-content" role="tabpanel">${ctx.fwCode[id]}</div>`)
    .join('');
  const lamp = (cat, label) => `<li class="lamp" :class="{ 'is-lit': M.acc.${cat} }">${art(cat, 'ki')}<span>${label}</span><small v-text="M.acc.${cat} ? 'let in' : 'kept out'">kept out</small></li>`;

  return `<section class="town" aria-labelledby="hero-title">
  <div class="town-stage">
    <div class="hero-stars" aria-hidden="true"></div>
    <div class="town-scene" aria-hidden="true">
      <div class="layer-box px" data-depth=".12">${heroLayer(VARS, 'far')}</div>
      <div class="layer-box">${heroLayer(VARS, 'ground')}</div>
      <div class="layer-box art-box px" data-depth=".22">${heroLayer(VARS, 'sky')}</div>
      <div class="layer-box art-box">${heroLayer(VARS, 'art')}</div>
      ${seasonArt()}
    </div>
    <div class="wrap hero-in">
      <div class="hero-text">
        <p class="tale"><span class="badge badge-soft">v${VERSION}</span><span>Free and MIT licensed</span></p>
        <h1 id="hero-title">A cookie banner that keeps trackers out until visitors say <em>yes</em></h1>
        <p class="lead">Free cookie consent for LGPD and GDPR. Pick a region, a color and your words, then copy one line into your site. Analytics, pixels and heatmaps wait until their category is accepted.</p>
        <div class="hero-cta"><a class="btn btn-primary btn-lg" href="#configurator">${art('sparkles', 'ki ki-btn')}Design your banner</a><a class="btn btn-outline btn-lg" href="#demo">${art('gate', 'ki ki-btn')}See it block trackers</a></div>
        <ol class="hero-steps" aria-label="Three steps">
          <li><b>1</b>Pick a region</li>
          <li><b>2</b>Style it</li>
          <li><b>3</b>Copy one line</li>
        </ol>
      </div>
    </div>
  </div>
  <div class="hero-band"><ul class="wrap hero-tags" aria-label="cookieowl in numbers">
    <li><b>${ctx.size}</b><span>gzip, one file</span></li>
    <li><b>0</b><span>dependencies</span></li>
    <li><b>${ctx.langs}</b><span>languages</span></li>
    <li><b>${ctx.trackers}</b><span>trackers known by name</span></li>
  </ul>${seasonIcons()}</div>
</section>

${generator(ctx)}

<section id="demo" class="chapter street-sec" aria-labelledby="demo-title">
  <div class="wrap">
    ${chHead(2, 'gate', 'Live demo', 'Watch the gate hold real trackers', 'The real cookieowl guards a pretend coffee shop. Accept a category and only its tracker bugs fly in. The logbook lists everything that tried to get through.', 'demo-title')}
    ${bugSymbols()}
    <div class="demo-grid">
      <div class="street">
        <div class="street-bg" aria-hidden="true">${streetScene(VARS, { id: 'street', inline: true })}</div>
        <div class="gatehouse">
          <div class="queue" aria-hidden="true">${DEMO_BUGS.map((b) => demoBug(b, 'out')).join('')}</div>
          <div class="gate-art" :class="{ 'is-open': M.acc.any }" aria-hidden="true">${demoGate(VARS, { id: 'dg0', inline: true })}${demoGate(VARS, { id: 'dg1', inline: true, open: 1 })}</div>
          <ul class="lamps" aria-label="What the gate lets in">
            <li class="lamp is-lit">${art('necessary', 'ki')}<span>Necessary</span><small>always</small></li>
            ${lamp('preferences', 'Preferences')}${lamp('analytics', 'Analytics')}${lamp('marketing', 'Marketing')}
          </ul>
        </div>
        <div class="shop">
          <div class="awning" aria-hidden="true"><span>Nightjar Coffee</span></div>
          <div class="inside" aria-hidden="true">${DEMO_BUGS.map((b) => demoBug(b, 'in')).join('')}</div>
          <div class="browser">
            <div class="browser-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="browser-url">${icon('lock')}nightjar-coffee.example</span></div>
            ${demoSite()}
          </div>
        </div>
      </div>
      ${logbook()}
    </div>
    <div class="demo-controls">
      <button type="button" class="btn btn-sm btn-outline" data-demo-reset>${art('broom', 'ki ki-btn')}Start the night again</button>
      <button type="button" class="btn btn-sm btn-outline" data-demo-prefs>${art('preferences', 'ki ki-btn')}Open preferences</button>
      <button type="button" class="btn btn-sm btn-outline" data-demo-pixel>${art('pixel', 'ki ki-btn')}Sneak in a pixel snippet</button>
      <label class="demo-pick">Layout <select class="select select-sm" data-demo-layout aria-label="Banner layout"><option value="box">Box</option><option value="bar">Bar</option><option value="modal">Modal</option></select></label>
      <label class="demo-pick">Language <select class="select select-sm" data-demo-lang aria-label="Banner language"><option value="en">English</option><option value="pt-BR">Português (LGPD)</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option></select></label>
    </div>
  </div>
</section>

<section id="how" class="chapter" aria-labelledby="how-title">
  <div class="wrap">
    ${chHead(3, 'moon', 'How blocking works', 'One night in the life of a tracker', 'A banner that only hides itself does nothing for privacy. cookieowl stops the browser from running trackers at all, and lets them in only after a choice.', 'how-title')}
    <ol class="panels">
      <li class="panel">${pic('spots/dusk', 'At dusk Hoot sits on a lantern post that is already lit', { cls: 'panel-pic' })}<p class="panel-time">Dusk</p><h3>Hoot lights the lantern first</h3><p>Put the script tag at the top of <code>&lt;head&gt;</code>, without <code>async</code> or <code>defer</code>. Consent Mode defaults and the auto blocker are in place before anything else runs.</p>${ctx.how[0]}</li>
      <li class="panel">${pic('spots/midnight', 'At midnight tracker bugs wait outside the closed gate', { cls: 'panel-pic' })}<p class="panel-time">Midnight</p><h3>Trackers wait outside as plain text</h3><p>Give each tracker <code>type="text/plain"</code> and a category. Browsers do not run text, so nothing is requested. Embeds keep their address in <code>data-cookieowl-src</code>.</p>${ctx.how[1]}</li>
      <li class="panel">${pic('spots/morning', 'In the morning the gate opens for an invited tracker', { cls: 'panel-pic' })}<p class="panel-time">Morning</p><h3>A choice opens the gate</h3><p>On consent, each accepted script runs in document order, waiting for the one before it. Withdrawal sweeps out the category cookies and reloads the page.</p>${ctx.how[2]}</li>
    </ol>
    <div class="suspects">
      <div class="suspects-head"><h3>${art('auto-block', 'ki ki-lg')}The usual suspects</h3><p>Load cookieowl first with <code>data-auto-block</code> and these ${ctx.trackers} tracker patterns are held by URL, even when a vendor snippet sneaks them in. Video embeds become a click to load placeholder.</p></div>
      <ul class="posters">${suspects}</ul>
    </div>
  </div>
</section>

<section id="features" class="chapter" aria-labelledby="feat-title">
  <div class="wrap">
    ${chHead(4, 'owl', 'What Hoot guards', 'Twelve promises Hoot keeps every night', 'Everything a consent banner should do, in one small file.', 'feat-title')}
    <div class="spread">
      <ol class="page page-l">${FEATURES.slice(0, half).map(promise).join('')}</ol>
      <ol class="page page-r" start="${half + 1}">${FEATURES.slice(half).map(promise).join('')}</ol>
    </div>
  </div>
</section>

<section id="frameworks" class="chapter" aria-labelledby="fw-title">
  <div class="wrap">
    ${chHead(5, 'house', 'Install anywhere', 'Every house in town can hire Hoot', 'Plain HTML, React, Next.js, Vue, Angular or WordPress. The script tag works on any site, and on npm <code>cookieowl</code> ships ES modules, CommonJS and types, plus thin React and Vue helpers.', 'fw-title')}
    <div class="tabs tabs-lifted fw-tabs" role="tablist" aria-label="Frameworks">${fw}</div>
  </div>
</section>

<section id="guides" class="chapter shelf-sec" aria-labelledby="guides-title">
  <div class="wrap">
    ${chHead(6, 'book', 'Guides', 'The storybook shelf', 'Four short guides with working code: a consent checklist, Google Consent Mode v2, holding Google Analytics and React.', 'guides-title')}
    <div class="shelf">${shelf}</div>
  </div>
</section>

<section id="faq" class="chapter" aria-labelledby="faq-title">
  <div class="wrap faq-grid">
    <div class="faq-side">
      ${chHead(7, 'lantern', 'FAQ', 'Questions asked by lantern light', `Not finding yours? <a href="${GITHUB}/issues">Open an issue on GitHub</a>.`, 'faq-title')}
      ${pic('spots/lost', '', { cls: 'faq-pic' })}
    </div>
    <div class="accordion collapse-plus">${faq}</div>
  </div>
</section>`;
}

export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'cookieowl',
        description: 'Open source cookie consent banner that keeps trackers from loading until visitors agree.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any (web browser)',
        softwareVersion: VERSION,
        url: SITE,
        downloadUrl: 'https://www.npmjs.com/package/cookieowl',
        license: 'https://opensource.org/licenses/MIT',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: { '@type': 'Person', name: 'Alexandre Kohler', url: 'https://github.com/kwy404' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })),
      },
    ],
  };
}

export const homeEsc = esc;
