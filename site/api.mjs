// The API reference page: options, data attributes, methods, events, markup
// attributes, CSS variables and the React and Vue helpers.
import { SITE, art, icon } from './layout.mjs';

export const OPTIONS = [
  ['categories', '(string | Category)[]', "['necessary', 'preferences', 'analytics', 'marketing']", 'Category ids or objects with <code>label</code>, <code>description</code>, <code>required</code> and <code>services</code>. <code>necessary</code> is always added and always on.'],
  ['lang', 'string', "'auto'", 'Banner language: <code>pt-BR</code>, <code>en</code>, <code>es</code>, <code>fr</code> or <code>de</code>. <code>auto</code> reads <code>&lt;html lang&gt;</code>, then the browser.'],
  ['template', "'lgpd' | 'gdpr'", 'lgpd for Portuguese, gdpr otherwise', 'Legal wording of the banner and the preferences dialog.'],
  ['policyUrl', 'string', 'none', 'Link to your privacy or cookie policy, shown in the banner and the dialog.'],
  ['version', 'string | number', '1', 'Your policy version. Changing it shows the banner to everyone again.'],
  ['expiresDays', 'number', '365', 'Days until a choice expires and the banner asks again.'],
  ['storage', "'cookie' | 'localStorage' | 'memory'", "'cookie'", 'Where the record is kept. <code>memory</code> forgets on reload (handy for demos and tests).'],
  ['cookie', '{ name, domain, path, sameSite }', "{ name: 'cookieowl', path: '/', sameSite: 'Lax' }", 'Cookie options. Set <code>domain</code> to share consent across subdomains.'],
  ['layout', "'box' | 'bar' | 'modal'", "'box'", 'Corner box, full width bar or centered modal with a focus trap.'],
  ['position', "'bottom' | 'top' | 'bottom-left' | 'bottom-right'", "'bottom-right' (box), 'bottom' (bar)", 'Where the banner sits.'],
  ['theme', "'auto' | 'light' | 'dark'", "'auto'", '<code>auto</code> follows <code>data-theme</code> or a <code>.dark</code> class on the page, then the system setting.'],
  ['dir', "'auto' | 'ltr' | 'rtl'", "'auto'", 'Text direction; <code>auto</code> follows <code>&lt;html dir&gt;</code>.'],
  ['reopenButton', "boolean | 'left' | 'right'", 'true (left)', 'The floating owl button that reopens the preferences.'],
  ['container', 'HTMLElement | string', 'document.body', 'Mount inside an element; the UI is then positioned inside it.'],
  ['text', 'Partial&lt;Texts&gt;', 'built in', 'Override any text, as a string or one string per language.'],
  ['consentMode', 'boolean | ConsentModeConfig', 'false', 'Google Consent Mode v2: <code>waitForUpdate</code>, <code>mapping</code>, <code>regions</code>, <code>adsDataRedaction</code>, <code>urlPassthrough</code>, <code>advanced</code>.'],
  ['autoBlock', 'boolean | AutoBlockConfig', 'false', 'Hold known trackers by URL: <code>patterns</code>, <code>categories</code>, <code>ignore</code>.'],
  ['respectGPC', 'boolean', 'true', 'Treat Global Privacy Control as a refusal of optional categories.'],
  ['respectDNT', 'boolean', 'false', 'Treat Do Not Track the same way.'],
  ['clearCookies', 'boolean', 'true', 'Erase the cookies of withdrawn categories.'],
  ['reloadOnWithdraw', 'boolean | (categories) =&gt; void', 'true', 'Reload when a category whose scripts already ran is withdrawn, or handle it yourself.'],
  ['autoShow', 'boolean', 'true', 'Show the banner on init when there is no valid choice.'],
  ['onConsent', '(record) =&gt; void', 'none', 'Called with the record on every choice. Send it to your audit log.'],
];

export const ATTRIBUTES = [
  ['data-lang', 'lang'],
  ['data-template', 'template'],
  ['data-policy-url', 'policyUrl'],
  ['data-version', 'version'],
  ['data-categories', 'categories, comma separated'],
  ['data-layout', 'layout'],
  ['data-position', 'position'],
  ['data-theme', 'theme'],
  ['data-dir', 'dir'],
  ['data-storage', 'storage'],
  ['data-expires-days', 'expiresDays'],
  ['data-container', 'container (a selector)'],
  ['data-consent-mode', 'consentMode: true, or "advanced"'],
  ['data-auto-block', 'autoBlock: true'],
  ['data-gpc="false"', 'respectGPC: false'],
  ['data-dnt', 'respectDNT: true'],
  ['data-reopen', 'reopenButton: "false", "left" or "right"'],
  ['data-manual', 'Skip the automatic init and call cookieowl.init() yourself'],
];

export const METHODS = [
  ['init(config)', 'Starts cookieowl and returns the instance. Consent Mode defaults and the blocker are installed at once, the UI when the DOM is ready. Calling it again replaces the configuration.'],
  ['accepted(category)', 'True when the category (or every category in an array) is accepted. Required categories are always true.'],
  ['acceptAll()', 'Accepts every category and records method <code>accept-all</code>.'],
  ['rejectAll()', 'Keeps only required categories and records method <code>reject-all</code>.'],
  ['save(choices)', 'Saves a map like <code>{ analytics: true }</code> or a list of accepted ids.'],
  ['getConsent()', 'A copy of the stored record, or <code>null</code> before a choice.'],
  ['categories()', 'The configured categories with their labels in the current language.'],
  ['show() / hide()', 'Shows or hides the banner without recording a choice.'],
  ['showPreferences() / hidePreferences()', 'Opens or closes the preferences dialog.'],
  ['reset()', 'Forgets the choice, turns optional categories off and shows the banner again.'],
  ['on(event, fn)', 'Listens to an event and returns a function that stops listening.'],
  ['off(event, fn)', 'Stops listening.'],
  ['destroy()', 'Removes the UI, the observers and the createElement hook.'],
];

export const EVENTS = [
  ['change', '{ categories, accepted, changed, record }', 'A category was accepted or withdrawn.'],
  ['consent', 'ConsentRecord', 'The visitor made a choice (also when nothing changed).'],
  ['ready', '{ categories, accepted, changed, record }', 'init finished; the state comes from a stored choice or the defaults.'],
  ['show / hide', "'banner' | 'preferences'", 'The banner or the dialog opened or closed.'],
  ['reset', 'undefined', 'reset() was called.'],
];

export const CSS_VARS = [
  ['--seed', 'Accent color of the buttons and switches (amber by default). The same variable themes Monsoon, so one color can theme both.'],
  ['--cko-font', 'Font family of the banner and dialog.'],
  ['--cko-bg, --cko-fg, --cko-muted', 'Surface, text and secondary text colors.'],
  ['--cko-line, --cko-soft', 'Borders and subtle backgrounds.'],
  ['--cko-primary, --cko-on-primary', 'Button color and the text on it (contrast picked automatically).'],
  ['--cko-ring', 'Focus ring color.'],
];

const table = (head, rows) =>
  `<div class="table-wrap"><table class="table api-table"><thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row"><code>${c}</code></th>` : `<td>${(i === 1 && head.length > 2) || (i === 2 && head.length === 4) ? `<code>${c}</code>` : c}</td>`)).join('')}</tr>`)
    .join('')}</tbody></table></div>`;

export function apiBody(ctx) {
  const sections = [
    ['quick', 'Quick start', `<p>Two ways in. The script tag defines a global <code>cookieowl</code> and starts on its own; the npm package exports the same instance.</p>${ctx.code.quick}${ctx.code.npm}`],
    ['options', 'Options', `<p>Pass them to <code>cookieowl.init()</code>, or set <code>window.cookieowlConfig</code> before the script tag.</p>${table(['Option', 'Type', 'Default', 'What it does'], OPTIONS)}`],
    ['attributes', 'Script tag attributes', `<p>The most common options also work as data attributes on the script tag. They win over <code>window.cookieowlConfig</code>.</p>${table(['Attribute', 'Same as'], ATTRIBUTES)}`],
    ['markup', 'Blocking markup', `<p>Any element with <code>data-cookieowl</code> waits for its categories. List several to require all of them.</p>${ctx.code.markup}<ul class="api-list"><li><code>type="text/plain"</code> keeps a script inert; the original type goes in <code>data-cookieowl-type</code> (for example <code>module</code>).</li><li><code>data-cookieowl-src</code> holds the URL of an iframe, image or script until consent.</li><li><code>data-cookieowl-name</code> names an embed in its placeholder.</li><li><code>data-cookieowl-open</code> on any element opens the preferences on click.</li></ul>`],
    ['methods', 'Methods', table(['Method', 'What it does'], METHODS)],
    ['events', 'Events', `<p>Listen with <code>cookieowl.on()</code>, or on <code>document</code> as <code>cookieowl:change</code>, <code>cookieowl:consent</code> and so on. With a dataLayer on the page, each choice also pushes a <code>cookieowl_consent</code> event for Tag Manager.</p>${table(['Event', 'Detail', 'When'], EVENTS)}${ctx.code.events}`],
    ['consent-mode', 'Consent Mode v2', `<p>Each Google consent type is granted when all of its categories are accepted.</p>${ctx.code.gcm}${table(['Consent type', 'Categories'], ctx.mapping)}`],
    ['auto-block', 'Auto blocking', `<p>Known trackers and their default categories. Add your own with <code>autoBlock.patterns</code>.</p>${table(['Id', 'Name', 'Category'], ctx.trackerRows)}${ctx.code.auto}`],
    ['record', 'The consent record', ctx.code.record],
    ['css', 'Styling', `<p>The stylesheet is scoped under <code>.cko</code> and injected once. Override the tokens on <code>.cko</code> or set <code>--seed</code> on <code>:root</code>.</p>${table(['Variable', 'Use'], CSS_VARS)}${ctx.code.css}`],
    ['react', 'React and Next.js', `<p><code>cookieowl/react</code> exports <code>useConsent(category?)</code>, <code>ConsentGate</code> and <code>useCookieOwl()</code>.</p>${ctx.code.react}`],
    ['vue', 'Vue', `<p><code>cookieowl/vue</code> exports <code>CookieOwlPlugin</code>, <code>useConsent(category)</code> and <code>ConsentGate</code> with a <code>fallback</code> slot.</p>${ctx.code.vue}`],
  ];
  const toc = sections.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('');
  const body = sections.map(([id, t, html]) => `<section id="${id}" class="chapter"><h2><a href="#${id}" class="anchor" aria-hidden="true" tabindex="-1">#</a>${t}</h2>${html}</section>`).join('\n');
  return `<header class="g-head night dark">
  <div class="starfield starfield-dim" aria-hidden="true"></div>
  <div class="wrap g-head-in">
    <nav class="crumbs" aria-label="Breadcrumb"><ol class="breadcrumbs"><li><a href="./">cookieowl</a></li><li><span aria-current="page">API reference</span></li></ol></nav>
    <p class="g-star">${art('frameworks', 'art-ic art-sm')}<span>Reference</span></p>
    <h1>cookieowl API reference</h1>
    <p class="lead">Every option, attribute, method and event of the cookie consent script, with the React and Vue helpers.</p>
  </div>
</header>
<div class="wrap g-layout">
  <article class="g-article">
${body}
  </article>
  <aside class="g-aside" aria-label="On this page"><nav class="g-toc" aria-labelledby="toc-title"><p id="toc-title" class="g-toc-title">${icon('moon')}On this page</p><ol>${toc}</ol></nav></aside>
</div>`;
}

export function apiJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'TechArticle', headline: 'cookieowl API reference', url: `${SITE}api.html`, author: { '@type': 'Person', name: 'Alexandre Kohler', url: 'https://github.com/kwy404' } },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'cookieowl', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'API reference', item: `${SITE}api.html` },
        ],
      },
    ],
  };
}
