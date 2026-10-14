// The landing page: the night sky hero, the live demo with its network
// monitor, how blocking works, the configurator, features, frameworks and FAQ.
import { CDN, GITHUB, GUIDES, SITE, VERSION, art, esc, icon } from './layout.mjs';

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
  ['block', 'Real blocking before consent', 'Marked scripts and iframes stay inert, then run in document order once their category is accepted.'],
  ['auto-block', 'Auto mode for known trackers', 'Google Analytics, Tag Manager, Meta Pixel, Clarity, Hotjar, LinkedIn and TikTok are caught by URL, even when a snippet injects them.'],
  ['consent-mode', 'Google Consent Mode v2', 'Denied defaults with wait_for_update, region defaults, an update on every choice and a dataLayer event for Tag Manager.'],
  ['embed', 'Click to load embeds', 'YouTube and Vimeo iframes become a placeholder with Load once and Allow marketing cookies.'],
  ['categories', 'Categories and services', 'Necessary, preferences, analytics, marketing and your own, each with services, cookies and durations.'],
  ['audit-log', 'Records for audits', 'Version, timestamp, random consent id and method in a first party cookie, plus an onConsent hook for your log.'],
  ['reopen', 'Withdraw as easily as giving', 'A floating owl reopens the preferences anywhere, withdrawal erases cookies and stops scripts.'],
  ['privacy-signal', 'Privacy signals respected', 'Global Privacy Control is honored by default, Do Not Track when you turn it on.'],
  ['accessibility', 'Accessible, no dark patterns', 'Focus trap, keyboard, screen reader labels, Reject as prominent as Accept and no pre-ticked boxes.'],
  ['languages', 'Five languages, LGPD and GDPR', 'Portuguese with LGPD wording, English, Spanish, French and German, RTL safe, every text overridable.'],
  ['dark-mode', 'Themed by one color', 'Light and dark mode out of the box and a --seed color for the accent, in a scoped stylesheet.'],
  ['lightweight', 'One small file', 'About 15 kB gzip, no dependencies, no requests of its own, no account and no server.'],
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

function demoSite() {
  return `<div id="demo-site" class="demo-site light" data-demo-site>
  <header class="ds-top"><span class="ds-logo" aria-hidden="true"></span><b>Nightjar Coffee</b><nav aria-label="Demo shop"><span>Beans</span><span>Brewing</span><span>Journal</span></nav></header>
  <div class="ds-hero"><p class="ds-kicker">Small batch, roasted at night</p><p class="ds-title">Coffee for people who stay up late</p><p class="ds-text">A pretend shop with four pretend trackers. None of them may run until you say so.</p></div>
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

function monitor() {
  return `<aside class="monitor" aria-labelledby="mon-title" v-data="{ tab: 'net' }">
  <div class="mon-head"><h3 id="mon-title">${icon('bolt')}Network monitor</h3><span class="mon-live" v-text="M.status"></span></div>
  <div class="mon-tabs" role="tablist" aria-label="Monitor views">
    <button type="button" role="tab" :aria-selected="tab === 'net' ? 'true' : 'false'" aria-selected="true" @click="tab = 'net'">Scripts and requests</button>
    <button type="button" role="tab" :aria-selected="tab === 'gcm' ? 'true' : 'false'" aria-selected="false" @click="tab = 'gcm'">Consent Mode</button>
    <button type="button" role="tab" :aria-selected="tab === 'jar' ? 'true' : 'false'" aria-selected="false" @click="tab = 'jar'">Cookies</button>
  </div>
  <div class="mon-body" role="tabpanel" v-show="tab === 'net'" aria-label="Scripts and requests">
    <ol class="mon-list" aria-live="polite">
      <li v-for="r in M.rows" :key="r.id" :class="'mon-row is-' + r.state"><span class="mon-state" v-text="label(r.state)"></span><span class="mon-what"><b v-text="r.name"></b><small v-text="r.url"></small></span><span class="mon-cat" v-text="r.cat"></span></li>
    </ol>
  </div>
  <div class="mon-body" role="tabpanel" v-show="tab === 'gcm'" aria-label="Consent Mode commands">
    <ol class="mon-list mon-code">
      <li v-for="g in M.gcm" :key="g.id" class="mon-row"><span class="mon-state is-cmd" v-text="g.cmd"></span><span class="mon-what"><b v-text="g.title"></b><small v-text="g.detail"></small></span></li>
    </ol>
  </div>
  <div class="mon-body" role="tabpanel" v-show="tab === 'jar'" aria-label="Cookies on this page">
    <ol class="mon-list">
      <li v-for="c in M.cookies" :key="c.name" class="mon-row"><span class="mon-state is-cookie">set</span><span class="mon-what"><b v-text="c.name"></b><small v-text="c.value"></small></span></li>
    </ol>
    <p class="mon-empty" v-if="!M.cookies.length">No cookies yet. Accept a category to see trackers set theirs, then withdraw it and watch them go.</p>
  </div>
</aside>`;
}

/** The home page body. ctx: { frame, size, trackers, langs } */
export function homeBody(ctx) {
  const { frame } = ctx;
  const heroCode = frame(`<script src="${CDN}"\n  data-lang="auto" data-policy-url="/privacy"\n  data-consent-mode data-auto-block></script>`, { lang: 'html', title: 'index.html', compact: true });
  const features = FEATURES.map(([ic, t, d]) => `<li class="feat">${art(ic)}<h3>${t}</h3><p>${d}</p></li>`).join('');
  const faq = FAQ.map(([q, a], i) => `<details class="collapse" name="faq"${i === 0 ? ' open' : ''}><summary class="collapse-title">${q}</summary><div class="collapse-content"><p>${a}</p></div></details>`).join('');
  const guides = GUIDES.map((g) => `<a class="guide-star" href="${g.slug}.html">${art(g.icon)}<span><small>${g.star}</small><b>${g.short}</b></span>${icon('arrow')}</a>`).join('');
  const collected = COLLECTED.map(([k, v]) => `<tr><th scope="row"><code>${k}</code></th><td>${v}</td></tr>`).join('');

  const fw = ctx.frameworks
    .map(
      ([id, label], i) =>
        `<input type="radio" name="fw" class="tab" aria-label="${label}"${i === 0 ? ' checked' : ''}><div class="tab-content" role="tabpanel">${ctx.fwCode[id]}</div>`,
    )
    .join('');

  return `<section class="hero sky dark" aria-labelledby="hero-title">
  <div class="starfield" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div class="hero-text">
      <p class="eyebrow"><span class="badge badge-soft">v${VERSION}</span>Free and open source cookie consent, MIT</p>
      <h1 id="hero-title">Cookie consent that keeps watch until visitors say <em>yes</em></h1>
      <p class="lead">cookieowl is a free cookie consent banner for LGPD and GDPR. Tracking scripts stay asleep until their category is accepted, Google Consent Mode v2 is wired in, and the whole thing is one script tag.</p>
      <div class="hero-cta"><a class="btn btn-primary btn-lg" href="#demo">${icon('play')}Watch it block trackers</a><a class="btn btn-outline btn-lg" href="#configurator">${icon('settings')}Generate your snippet</a></div>
      ${heroCode}
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="moon"></div>
      <img class="hero-owl" src="assets/mascot-dark.svg" width="340" height="340" alt="">
      <span class="tag tag-1">${icon('lock')}gtag.js held</span>
      <span class="tag tag-2">${icon('lock')}fbevents.js held</span>
      <span class="tag tag-3">${icon('check')}consent saved</span>
    </div>
  </div>
  <ul class="wrap hero-stats">
    <li><b>${ctx.size}</b><span>gzip, one file</span></li>
    <li><b>0</b><span>dependencies</span></li>
    <li><b>${ctx.langs}</b><span>languages built in</span></li>
    <li><b>${ctx.trackers}</b><span>tracker patterns known</span></li>
  </ul>
</section>

<section id="demo" class="section night dark" aria-labelledby="demo-title">
  <div class="wrap">
    <header class="sec-head">
      <p class="kicker">${icon('play')}Live demo</p>
      <h2 id="demo-title">Choose, then watch the trackers wake up or stay asleep</h2>
      <p>This is the real cookieowl, running inside a pretend shop. Four fake tracker scripts and a video wait behind the banner. The monitor shows what is held, what runs, the Consent Mode commands Google tags would read, and the cookies each tracker sets.</p>
    </header>
    <div class="demo-grid">
      <div class="browser">
        <div class="browser-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="browser-url">${icon('lock')}nightjar-coffee.example</span></div>
        ${demoSite()}
      </div>
      ${monitor()}
    </div>
    <div class="demo-controls">
      <button type="button" class="btn btn-sm btn-outline" data-demo-reset>${icon('reset')}Reset the demo</button>
      <button type="button" class="btn btn-sm btn-outline" data-demo-prefs>${icon('settings')}Open preferences</button>
      <button type="button" class="btn btn-sm btn-outline" data-demo-pixel>${icon('bolt')}Inject a pixel snippet</button>
      <label class="demo-pick">Layout <select class="select select-sm" data-demo-layout aria-label="Banner layout"><option value="box">Box</option><option value="bar">Bar</option><option value="modal">Modal</option></select></label>
      <label class="demo-pick">Language <select class="select select-sm" data-demo-lang aria-label="Banner language"><option value="en">English</option><option value="pt-BR">Português (LGPD)</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option></select></label>
    </div>
  </div>
</section>

<section id="how" class="section" aria-labelledby="how-title">
  <div class="wrap">
    <header class="sec-head">
      <p class="kicker">${icon('moon')}How blocking works</p>
      <h2 id="how-title">Three phases of the moon, from page load to consent</h2>
      <p>A banner that only hides itself does nothing for privacy. cookieowl stops the browser from running trackers in the first place, and only lets them in after a choice.</p>
    </header>
    <ol class="phases">
      <li class="phase"><span class="phase-moon phase-new" aria-hidden="true"></span><h3>Load cookieowl first</h3><p>Put the script tag at the top of <code>&lt;head&gt;</code>, without <code>async</code> or <code>defer</code>. Consent Mode defaults and the auto blocker are installed before anything else runs.</p>${ctx.how[0]}</li>
      <li class="phase"><span class="phase-moon phase-half" aria-hidden="true"></span><h3>Trackers wait as text</h3><p>Give each tracker <code>type="text/plain"</code> and a category. Browsers do not execute text, so nothing is requested. Embeds use <code>data-cookieowl-src</code>.</p>${ctx.how[1]}</li>
      <li class="phase"><span class="phase-moon phase-full" aria-hidden="true"></span><h3>A choice releases them</h3><p>On consent, each accepted script runs in document order, waiting for the one before it. Withdrawal erases the category cookies and reloads the page.</p>${ctx.how[2]}</li>
    </ol>
    <div class="callout callout-accent auto-note"><p class="callout-title">${art('auto-block', 'art-ic art-sm')}Auto mode knows ${ctx.trackers} tracker patterns</p><p>${ctx.trackerNames}. Load cookieowl first with <code>data-auto-block</code> and their scripts are held even when a vendor snippet injects them, and video embeds become a click to load placeholder.</p></div>
  </div>
</section>

<section id="configurator" class="section section-alt" aria-labelledby="cfg-title">
  <div class="wrap">
    <header class="sec-head">
      <p class="kicker">${icon('settings')}Configurator</p>
      <h2 id="cfg-title">Generate your snippet</h2>
      <p>Pick the language, layout and categories. The snippet updates as you go, and you can try it in the demo above before you copy it.</p>
    </header>
    <div class="cfg" v-data="{}">
      <form class="cfg-form" aria-label="Snippet options" @submit.prevent>
        <fieldset class="cfg-group"><legend>Language and wording</legend>
          <label class="field"><span class="label">Language</span><select class="select" v-model="CFG.lang"><option value="auto">Automatic (page and browser)</option><option value="pt-BR">Português (Brasil)</option><option value="en">English</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option></select></label>
          <label class="field"><span class="label">Legal template</span><select class="select" v-model="CFG.template"><option value="">Default for the language</option><option value="lgpd">LGPD (Brazil)</option><option value="gdpr">GDPR (EU and UK)</option></select></label>
          <label class="field cfg-wide"><span class="label">Privacy policy URL</span><input class="input" v-model="CFG.policy" placeholder="/privacy" spellcheck="false"></label>
        </fieldset>
        <fieldset class="cfg-group"><legend>Look</legend>
          <label class="field"><span class="label">Layout</span><select class="select" v-model="CFG.layout"><option value="box">Box</option><option value="bar">Bottom bar</option><option value="modal">Center modal</option></select></label>
          <label class="field"><span class="label">Theme</span><select class="select" v-model="CFG.theme"><option value="auto">Follow the page</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
          <label class="field"><span class="label">Accent color</span><span class="cfg-color"><input type="color" v-model="CFG.seed" aria-label="Accent color"><code v-text="CFG.seed"></code></span></label>
        </fieldset>
        <fieldset class="cfg-group"><legend>Categories</legend>
          <div class="cfg-checks">
            <label class="label"><input type="checkbox" class="checkbox" checked disabled> Necessary</label>
            <label class="label"><input type="checkbox" class="checkbox" v-model="CFG.preferences"> Preferences</label>
            <label class="label"><input type="checkbox" class="checkbox" v-model="CFG.analytics"> Analytics</label>
            <label class="label"><input type="checkbox" class="checkbox" v-model="CFG.marketing"> Marketing</label>
          </div>
        </fieldset>
        <fieldset class="cfg-group"><legend>Blocking and signals</legend>
          <div class="cfg-checks">
            <label class="label"><input type="checkbox" class="toggle toggle-sm" role="switch" v-model="CFG.consentMode"> Google Consent Mode v2</label>
            <label class="label"><input type="checkbox" class="toggle toggle-sm" role="switch" v-model="CFG.advanced" :disabled="!CFG.consentMode"> Advanced mode (let Google tags load)</label>
            <label class="label"><input type="checkbox" class="toggle toggle-sm" role="switch" v-model="CFG.autoBlock"> Auto block known trackers</label>
            <label class="label"><input type="checkbox" class="toggle toggle-sm" role="switch" v-model="CFG.gpc"> Honor Global Privacy Control</label>
          </div>
        </fieldset>
      </form>
      <div class="cfg-out">
        <div class="segmented" role="radiogroup" aria-label="Install with">
          <label class="segmented-item"><input type="radio" name="cfg-mode" value="tag" v-model="CFG.mode"> Script tag</label>
          <label class="segmented-item"><input type="radio" name="cfg-mode" value="npm" v-model="CFG.mode"> npm</label>
        </div>
        <figure class="frame frame-editor cfg-frame"><div class="frame-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="frame-tab"><span v-text="CFG.mode === 'npm' ? 'consent.js' : 'index.html'"></span></span><button type="button" class="frame-copy" @click="copySnippet()" aria-label="Copy the snippet">${icon('copy')}<span v-text="CFG.copied ? 'Copied' : 'Copy'"></span></button></div><pre class="shiki" tabindex="0"><code id="cfg-code" v-html="snippetHtml(CFG)"></code></pre></figure>
        <div class="cfg-actions"><button type="button" class="btn btn-primary" @click="tryInDemo()">${icon('play')}Try it in the demo</button><a class="btn btn-ghost" href="api.html">Every option ${icon('arrow')}</a></div>
        <p class="cfg-note">Load it as the first script in <code>&lt;head&gt;</code>, then mark your trackers with <code>type="text/plain"</code> and <code>data-cookieowl</code>.</p>
      </div>
    </div>
  </div>
</section>

<section id="features" class="section" aria-labelledby="feat-title">
  <div class="wrap">
    <header class="sec-head"><p class="kicker">${icon('check')}What Hoot guards</p><h2 id="feat-title">Everything a consent banner should do, in one file</h2></header>
    <ul class="feats">${features}</ul>
  </div>
</section>

<section id="frameworks" class="section section-alt" aria-labelledby="fw-title">
  <div class="wrap">
    <header class="sec-head"><p class="kicker">${icon('book')}Install anywhere</p><h2 id="fw-title">Plain HTML, React, Next.js, Vue, Angular or WordPress</h2><p>The script tag works on any site. On npm, <code>cookieowl</code> ships ES modules, CommonJS and types, plus thin React and Vue helpers.</p></header>
    <div class="tabs tabs-lifted fw-tabs" role="tablist" aria-label="Frameworks">${fw}</div>
  </div>
</section>

<section id="record" class="section" aria-labelledby="rec-title">
  <div class="wrap rec-grid">
    <div>
      <p class="kicker">${icon('lock')}What gets stored</p>
      <h2 id="rec-title">A small, honest record</h2>
      <p>cookieowl keeps one first party cookie with the choice and nothing else. No server, no fingerprint, no third party. Send the same record to your own log with <code>onConsent</code> if you need proof of consent.</p>
      ${ctx.recordCode}
    </div>
    <div class="table-wrap"><table class="table"><caption class="sr-only">Fields of a consent record</caption><thead><tr><th scope="col">Field</th><th scope="col">What it holds</th></tr></thead><tbody>${collected}</tbody></table></div>
  </div>
</section>

<section id="guides" class="section night dark" aria-labelledby="guides-title">
  <div class="starfield starfield-dim" aria-hidden="true"></div>
  <div class="wrap">
    <header class="sec-head"><p class="kicker">${icon('book')}Star chart</p><h2 id="guides-title">Guides for every kind of site</h2><p>Each guide is named after a star, so you can find your way back at night.</p></header>
    <div class="guide-stars">${guides}</div>
  </div>
</section>

<section id="faq" class="section" aria-labelledby="faq-title">
  <div class="wrap faq-grid">
    <header class="sec-head"><p class="kicker">${icon('search')}FAQ</p><h2 id="faq-title">Questions people ask about cookie consent</h2><p>Not finding yours? <a href="${GITHUB}/issues">Open an issue on GitHub</a>.</p><img src="assets/mascot.svg" class="faq-owl only-light" width="180" height="180" alt="" loading="lazy"><img src="assets/mascot-dark.svg" class="faq-owl only-dark" width="180" height="180" alt="" loading="lazy"></header>
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
