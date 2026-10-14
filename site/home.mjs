// The landing page, told as a storybook in chapters: the hero town, the
// street of the live demo with its logbook, how blocking works, the lantern
// workshop (the configurator), the promises, frameworks, the record, the
// shelf of guides and the FAQ.
import { bug, demoGate, heroScene, streetScene, VARS, workshopLantern } from '../scripts/storybook.mjs';
import { CDN, GITHUB, GUIDES, SITE, VERSION, art, esc, icon, pic, roman, rule } from './layout.mjs';
import { bookCard } from './pages.mjs';

export const FAQ = [
  [
    'Does cookieowl really block Google Analytics before consent?',
    'Yes. Scripts you mark with <code>type="text/plain"</code> and <code>data-cookieowl="analytics"</code> are not executed by the browser at all, so gtag.js is never requested until analytics is accepted. With <code>data-auto-block</code> the gtag.js and Tag Manager URLs are also caught when they are inserted by a snippet. If you use Consent Mode advanced instead, Google tags load and send cookieless pings, which you choose explicitly.',
  ],
  [
    'Is cookieowl free for commercial sites?',
    'Yes. It is MIT licensed, has no paid tier, no page view limits, no account and no server. You load one file from jsDelivr or install it from npm and host it yourself.',
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
    'Does it work with React, Vue, Next.js, Angular and WordPress?',
    'Yes. The core is framework agnostic. <code>cookieowl/react</code> adds a <code>useConsent</code> hook and a <code>ConsentGate</code> component, <code>cookieowl/vue</code> adds a plugin, a composable and the same gate, and for WordPress you add the script tag in the theme head. Each one has a guide.',
  ],
  [
    'Will it slow my site down?',
    'The script is about 15 kB gzip with five languages, the stylesheet and the blocker included, and it has no dependencies. It must load synchronously in the head to block trackers, which costs a few milliseconds, and it makes no network requests of its own.',
  ],
  [
    'What happens with Global Privacy Control?',
    'When a browser sends Global Privacy Control, cookieowl records a refusal of optional categories, does not show the banner and notes the signal in the preferences, where the visitor can still opt in. Do Not Track can be honored the same way with <code>respectDNT</code>.',
  ],
  [
    'Can I keep a consent log for audits?',
    'Yes. Pass <code>onConsent(record)</code> and send each record to your own endpoint. Every record has a random id, the policy version, the timestamp, the method (accept all, reject all, custom or signal), the categories, the language and the page.',
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

const COLLECTED = [
  ['id', 'Random consent id, kept across updates on the same device'],
  ['version', 'The policy version the visitor agreed to'],
  ['timestamp', 'When the choice was made, ISO 8601'],
  ['expires', 'When the banner asks again (12 months by default)'],
  ['method', 'accept-all, reject-all, custom or signal'],
  ['categories', 'Every category and whether it was accepted'],
  ['lang and page', 'The banner language and the path where the choice was made'],
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

/** The home page body. ctx: { frame, size, trackers, langs, suspects, guideMeta } */
export function homeBody(ctx) {
  const { frame } = ctx;
  const heroCode = frame(`<script src="${CDN}"\n  data-lang="auto" data-policy-url="/privacy"\n  data-consent-mode data-auto-block></script>`, { lang: 'html', title: 'index.html', compact: true });
  const half = FEATURES.length / 2;
  const promise = ([ic, t, d]) => `<li class="promise"><span class="promise-ic">${art(ic, 'ki ki-lg')}</span><div><h3>${t}</h3><p>${d}</p></div></li>`;
  const faq = FAQ.map(([q, a], i) => `<details class="collapse" name="faq"${i === 0 ? ' open' : ''}><summary class="collapse-title">${q}</summary><div class="collapse-content"><p>${a}</p></div></details>`).join('');
  const shelf = GUIDES.map((g, i) => bookCard(g, ctx.guideMeta[g.slug], i + 1, { h: 'h3' })).join('');
  const collected = COLLECTED.map(([k, v]) => `<tr><th scope="row"><code>${k}</code></th><td>${v}</td></tr>`).join('');
  const suspects = ctx.suspects
    .map(([id, name, cat]) => `<li class="poster"><span class="poster-top">Wanted</span>${art(SUSPECT_ICONS[id] || 'bug', 'ki ki-xl')}<b>${name}</b><span class="poster-cat cat-${cat}">${cat}</span></li>`)
    .join('');
  const fw = ctx.frameworks
    .map(([id, label], i) => `<input type="radio" name="fw" class="tab" aria-label="${label}"${i === 0 ? ' checked' : ''}><div class="tab-content" role="tabpanel">${ctx.fwCode[id]}</div>`)
    .join('');
  const lamp = (cat, label) => `<li class="lamp" :class="{ 'is-lit': M.acc.${cat} }">${art(cat, 'ki')}<span>${label}</span><small v-text="M.acc.${cat} ? 'let in' : 'kept out'">kept out</small></li>`;

  return `<section class="town" aria-labelledby="hero-title">
  <div class="hero-stars" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div class="hero-text">
      <p class="tale"><span class="badge badge-soft">v${VERSION}</span><span>A bedtime story about privacy, free and MIT licensed</span></p>
      <h1 id="hero-title">Cookie consent that keeps trackers outside the gate until visitors say <em>yes</em></h1>
      <p class="lead">cookieowl is a free cookie consent banner for LGPD and GDPR. Analytics, pixels and heatmaps wait at the gate until their category is accepted, Google Consent Mode v2 is wired in, and the whole town runs on one script tag.</p>
      <div class="hero-cta"><a class="btn btn-primary btn-lg" href="#demo">${art('gate', 'ki ki-btn')}Watch the gate hold trackers</a><a class="btn btn-outline btn-lg" href="#configurator">${art('lantern', 'ki ki-btn')}Build your snippet</a></div>
      ${heroCode}
    </div>
  </div>
  <div class="hero-art">${heroScene(VARS, { id: 'hero', sky: false, inline: true })}</div>
  <ul class="hero-tags" aria-label="cookieowl in numbers">
    <li><b>${ctx.size}</b><span>gzip, one file</span></li>
    <li><b>0</b><span>dependencies</span></li>
    <li><b>${ctx.langs}</b><span>languages</span></li>
    <li><b>${ctx.trackers}</b><span>trackers known by name</span></li>
  </ul>
</section>

<section id="demo" class="chapter street-sec" aria-labelledby="demo-title">
  <div class="wrap">
    ${chHead(1, 'gate', 'Live demo', 'The street at night, where trackers knock and wait', 'This is the real cookieowl, guarding a pretend coffee shop. Four tracker bugs and a video wait at the gate. Accept a category and the lamp for it lights up, the gate opens and only those bugs fly in. The logbook writes down everything that tried to get through.', 'demo-title')}
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
    ${chHead(2, 'moon', 'How blocking works', 'One night in the life of a tracker', 'A banner that only hides itself does nothing for privacy. cookieowl stops the browser from running trackers at all, and lets them in only after a choice.', 'how-title')}
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

<section id="configurator" class="chapter workshop-sec" aria-labelledby="cfg-title">
  <div class="wrap">
    ${chHead(3, 'lantern', 'Configurator', 'The lantern workshop: build your snippet', 'Pick the language, the look and the categories. The lantern glows in your accent color, one gem per category, and the snippet below it is ready to copy. Try it on the demo street before you take it home.', 'cfg-title')}
    <div class="cfg" v-data="{}">
      <form class="cfg-form" aria-label="Snippet options" @submit.prevent>
        <fieldset class="tray"><legend>${art('language', 'ki')}Language and wording</legend>
          <label class="field"><span class="label">Language</span><select class="select" v-model="CFG.lang"><option value="auto">Automatic (page and browser)</option><option value="pt-BR">Português (Brasil)</option><option value="en">English</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option></select></label>
          <label class="field"><span class="label">Legal template</span><select class="select" v-model="CFG.template"><option value="">Default for the language</option><option value="lgpd">LGPD (Brazil)</option><option value="gdpr">GDPR (EU and UK)</option></select></label>
          <label class="field cfg-wide"><span class="label">Privacy policy URL</span><input class="input" v-model="CFG.policy" placeholder="/privacy" spellcheck="false"></label>
        </fieldset>
        <fieldset class="tray"><legend>${art('sparkles', 'ki')}Look</legend>
          <label class="field"><span class="label">Layout</span><select class="select" v-model="CFG.layout"><option value="box">Box</option><option value="bar">Bottom bar</option><option value="modal">Center modal</option></select></label>
          <label class="field"><span class="label">Theme</span><select class="select" v-model="CFG.theme"><option value="auto">Follow the page</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
          <label class="field"><span class="label">Accent color</span><span class="cfg-color"><input type="color" v-model="CFG.seed" aria-label="Accent color"><code v-text="CFG.seed"></code></span></label>
        </fieldset>
        <fieldset class="tray"><legend>${art('cookie-jar', 'ki')}Categories</legend>
          <div class="cfg-checks">
            <label class="label"><input type="checkbox" class="checkbox" checked disabled>${art('necessary', 'ki ki-sm')}Necessary</label>
            <label class="label"><input type="checkbox" class="checkbox" v-model="CFG.preferences">${art('preferences', 'ki ki-sm')}Preferences</label>
            <label class="label"><input type="checkbox" class="checkbox" v-model="CFG.analytics">${art('analytics', 'ki ki-sm')}Analytics</label>
            <label class="label"><input type="checkbox" class="checkbox" v-model="CFG.marketing">${art('marketing', 'ki ki-sm')}Marketing</label>
          </div>
        </fieldset>
        <fieldset class="tray"><legend>${art('gate', 'ki')}Blocking and signals</legend>
          <div class="cfg-checks">
            <label class="label"><input type="checkbox" class="toggle toggle-sm" role="switch" v-model="CFG.consentMode"> Google Consent Mode v2</label>
            <label class="label"><input type="checkbox" class="toggle toggle-sm" role="switch" v-model="CFG.advanced" :disabled="!CFG.consentMode"> Advanced mode (let Google tags load)</label>
            <label class="label"><input type="checkbox" class="toggle toggle-sm" role="switch" v-model="CFG.autoBlock"> Auto block known trackers</label>
            <label class="label"><input type="checkbox" class="toggle toggle-sm" role="switch" v-model="CFG.gpc"> Honor Global Privacy Control</label>
          </div>
        </fieldset>
      </form>
      <div class="cfg-out">
        <div class="bench" data-lantern :class="{ 'on-preferences': CFG.preferences, 'on-analytics': CFG.analytics, 'on-marketing': CFG.marketing }">
          ${workshopLantern(VARS, 'wl')}
          <div class="bench-note"><p class="hand" v-text="lanternNote(CFG)">A box banner in the visitor's language</p><ul class="gem-key"><li class="gk-necessary">Necessary</li><li class="gk-preferences">Preferences</li><li class="gk-analytics">Analytics</li><li class="gk-marketing">Marketing</li></ul></div>
        </div>
        <div class="segmented" role="radiogroup" aria-label="Install with">
          <label class="segmented-item"><input type="radio" name="cfg-mode" value="tag" v-model="CFG.mode"> Script tag</label>
          <label class="segmented-item"><input type="radio" name="cfg-mode" value="npm" v-model="CFG.mode"> npm</label>
        </div>
        <figure class="frame frame-editor cfg-frame"><div class="frame-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="frame-tab"><span v-text="CFG.mode === 'npm' ? 'consent.js' : 'index.html'"></span></span><button type="button" class="frame-copy" @click="copySnippet()" aria-label="Copy the snippet">${icon('copy')}<span v-text="CFG.copied ? 'Copied' : 'Copy'"></span></button></div><pre class="shiki" tabindex="0"><code id="cfg-code" v-html="snippetHtml(CFG)"></code></pre></figure>
        <div class="cfg-actions"><button type="button" class="btn btn-primary" @click="tryInDemo()">${art('gate', 'ki ki-btn')}Try it on the demo street</button><a class="btn btn-ghost" href="api.html">Every option ${icon('arrow')}</a></div>
        <p class="cfg-note">Load it as the first script in <code>&lt;head&gt;</code>, then mark your trackers with <code>type="text/plain"</code> and <code>data-cookieowl</code>.</p>
      </div>
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

<section id="record" class="chapter" aria-labelledby="rec-title">
  <div class="wrap">
    ${chHead(6, 'record', 'What gets stored', 'A small, honest library card', 'cookieowl keeps one first party cookie with the choice and nothing else. No server, no fingerprint, no third party. Send the same record to your own log with <code>onConsent</code> when you need proof of consent.', 'rec-title')}
    <div class="rec-grid">
      <div class="rec-card">${pic('spots/record', 'A consent card with a green approval stamp', { cls: 'rec-pic' })}${ctx.recordCode}</div>
      <div class="ledger"><table class="table"><caption class="sr-only">Fields of a consent record</caption><thead><tr><th scope="col">Field</th><th scope="col">What it holds</th></tr></thead><tbody>${collected}</tbody></table></div>
    </div>
  </div>
</section>

<section id="guides" class="chapter shelf-sec" aria-labelledby="guides-title">
  <div class="wrap">
    ${chHead(7, 'book', 'Guides', 'The storybook shelf', 'Nine practical guides, from the LGPD checklist to Next.js. Each one ends with questions people really ask.', 'guides-title')}
    <div class="shelf">${shelf}</div>
  </div>
</section>

<section id="faq" class="chapter" aria-labelledby="faq-title">
  <div class="wrap faq-grid">
    <div class="faq-side">
      ${chHead(8, 'lantern', 'FAQ', 'Questions asked by lantern light', `Not finding yours? <a href="${GITHUB}/issues">Open an issue on GitHub</a>.`, 'faq-title')}
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
        description: 'Free open source cookie consent manager for LGPD and GDPR that blocks trackers before consent, with Google Consent Mode v2.',
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
