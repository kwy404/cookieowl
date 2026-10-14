// Guide pages (the observatory log layout), the guides index, the API
// reference, the interactive checklist and the 404 page.
import { CDN, GUIDES, SITE, UPDATED, UPDATED_LABEL, art, esc, icon } from './layout.mjs';

function crumbs(items) {
  const lis = items.map(([label, href], i) => (i === items.length - 1 ? `<li><span aria-current="page">${label}</span></li>` : `<li><a href="${href}">${label}</a></li>`)).join('');
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol class="breadcrumbs">${lis}</ol></nav>`;
}

export const CHECKLIST = [
  {
    group: 'Before any choice',
    items: [
      ['block', 'Optional trackers do not run before consent', 'Analytics, ads, heatmaps and social pixels are inert until their category is accepted. A banner that only hides itself is not enough.', 'Mark scripts with <code>type="text/plain"</code> and <code>data-cookieowl</code>, or turn on <code>data-auto-block</code>.'],
      ['gcm', 'Google tags start in a denied state', 'If you use Google Analytics or Ads, Consent Mode defaults are denied before any tag loads.', '<code>data-consent-mode</code> sends the denied defaults with <code>wait_for_update</code>.'],
      ['embeds', 'Embedded videos and maps wait too', 'YouTube, Vimeo and similar iframes set cookies on load, so they wait behind a placeholder.', 'Auto mode replaces YouTube and Vimeo, <code>data-cookieowl-src</code> covers the rest.'],
      ['necessary', 'Strictly necessary cookies are really necessary', 'Only what the site needs to work (session, security, load balancing, the consent itself) runs without consent.', 'The necessary category is always on and labelled as such.'],
    ],
  },
  {
    group: 'The banner',
    items: [
      ['equal', 'Reject is as easy as Accept', 'Both buttons are on the first layer, with the same size, color and weight. No refusal hidden behind a second screen.', 'Reject all and Accept all share one style by design.'],
      ['preticked', 'No pre-ticked boxes', 'Optional categories start switched off. Silence, scrolling or continuing to browse is not consent.', 'Switches start off and only reflect a choice the visitor made.'],
      ['clear', 'Clear purposes in plain language', 'Each category says what it is for, and the banner names the law (LGPD or GDPR) and links to the policy.', 'Built in LGPD and GDPR wording in five languages, plus <code>policyUrl</code>.'],
      ['granular', 'Granular choice by purpose', 'Visitors can accept analytics and refuse marketing. Services and cookies are listed per category.', 'Preferences dialog with categories, services, cookies and durations.'],
      ['a11y', 'Usable with a keyboard and a screen reader', 'The banner is labelled, the dialog traps focus, Escape closes it and focus returns where it was.', 'Dialog roles, focus trap, live announcement and visible focus rings.'],
    ],
  },
  {
    group: 'After the choice',
    items: [
      ['withdraw', 'Withdrawing is as easy as consenting', 'A permanent link or button reopens the preferences on every page (GDPR art. 7(3), LGPD art. 8 paragraph 5).', 'The floating owl button and <code>data-cookieowl-open</code> on any link.'],
      ['erase', 'Withdrawal stops the trackers', 'Cookies of a withdrawn category are deleted and scripts that already ran are stopped.', 'Cookie erasing plus a page reload when scripts of that category ran.'],
      ['expiry', 'Consent is asked again from time to time', 'Choices expire (12 months is a common practice) and the banner returns.', '<code>expiresDays</code> defaults to 365.'],
      ['version', 'Policy changes ask again', 'When you add a vendor or change purposes, everyone sees the banner again.', 'Bump <code>version</code> and every older record is ignored.'],
      ['signals', 'Browser privacy signals are respected', 'Global Privacy Control is treated as a refusal of optional categories.', 'On by default with <code>respectGPC</code>, Do Not Track with <code>respectDNT</code>.'],
    ],
  },
  {
    group: 'Records and documents',
    items: [
      ['proof', 'You can prove consent', 'For each choice keep an id, a timestamp, the policy version and what was accepted.', '<code>onConsent(record)</code> hands you every record for your own log.'],
      ['policy', 'The privacy policy lists cookies and vendors', 'Names, purposes, durations, providers and transfers outside the country are documented.', 'The same service list feeds the preferences dialog.'],
      ['dpo', 'A contact for data subjects', 'LGPD asks for a published contact of the encarregado (DPO); GDPR for the controller and, when required, a DPO.', 'Put it in the policy page that <code>policyUrl</code> links to.'],
      ['review', 'Someone reviewed it', 'Laws, regulator guidance and your vendors change. Review the setup with counsel at least once a year.', 'cookieowl handles the mechanics, not the legal review.'],
    ],
  },
];

export const CHECKLIST_COUNT = CHECKLIST.reduce((n, g) => n + g.items.length, 0);

export function checklistWidget() {
  const groups = CHECKLIST.map(
    (g) => `<section class="ck-group" aria-label="${esc(g.group)}"><h3>${g.group}</h3><ul class="ck-list">${g.items
      .map(
        ([id, title, text, how]) =>
          `<li class="ck-item" :class="{ 'is-done': CL.done.${id} }"><label class="ck-check"><input type="checkbox" class="checkbox checkbox-primary" v-model="CL.done.${id}"><span><b>${title}</b><span class="ck-text">${text}</span></span></label><p class="ck-how">${icon('check')}<span><b>With cookieowl:</b> ${how}</span></p></li>`,
      )
      .join('')}</ul></section>`,
  ).join('');
  return `<div class="checklist" v-data="{}">
  <div class="ck-meter"><div><b><span v-text="clCount(CL)">0</span> of ${CHECKLIST_COUNT}</b> checked<span class="ck-saved">Saved in this browser only</span></div><progress class="progress progress-primary" :value="clCount(CL)" value="0" max="${CHECKLIST_COUNT}"></progress><button type="button" class="btn btn-xs btn-ghost" @click="clReset()">${icon('reset')}Clear</button></div>
  ${groups}
</div>`;
}

/** Renders one guide. `guide` holds the parsed source: meta and body html. */
export function guideBody(guide, all) {
  const { meta } = guide;
  const index = GUIDES.findIndex((x) => x.slug === meta.slug);
  const g = GUIDES[index];
  const sections = [...guide.body.matchAll(/<section id="([^"]+)"><h2>([\s\S]*?)<\/h2>/g)].map((m) => [m[1], m[2]]);
  let body = guide.body.replace(/<section id="([^"]+)"><h2>([\s\S]*?)<\/h2>/g, (_, id, h) => `<section id="${id}" class="chapter"><h2><a href="#${id}" class="anchor" aria-hidden="true" tabindex="-1">#</a>${h}</h2>`);
  body = body.replace(/<div class="note"><p>([\s\S]*?)<\/p><\/div>/g, `<div class="callout callout-accent"><p class="callout-title">${art('reopen', 'art-ic art-sm')}Hoot says</p><p>$1</p></div>`);
  body = body.replace('<div data-checklist></div>', checklistWidget());
  const toc = [...sections, ['faq', 'Questions'], ['related', 'Keep reading']].map(([id, h]) => `<li><a href="#${id}">${h.replace(/<[^>]+>/g, '')}</a></li>`).join('');
  const faq = meta.faq.map((f, i) => `<details class="collapse" name="gfaq"${i === 0 ? ' open' : ''}><summary class="collapse-title">${f.q}</summary><div class="collapse-content"><p>${f.a}</p></div></details>`).join('');
  const related = meta.related
    .map((slug) => {
      const r = all.find((x) => x.meta.slug === slug);
      const rg = GUIDES.find((x) => x.slug === slug);
      return `<a href="${slug}.html" class="rel">${art(rg.icon)}<span><small>${rg.star}</small><strong>${esc(r.meta.h1)}</strong><span>${esc(r.meta.description)}</span></span></a>`;
    })
    .join('');
  return `<div class="read-progress" aria-hidden="true"></div>
<header class="g-head night dark">
  <div class="starfield starfield-dim" aria-hidden="true"></div>
  <div class="wrap g-head-in">
    ${crumbs([['cookieowl', './'], ['Guides', 'guides.html'], [meta.crumb, '']])}
    <p class="g-star">${art(g.icon, 'art-ic art-sm')}<span>Guide ${index + 1} of ${GUIDES.length}</span><span class="g-star-name">${g.star}</span></p>
    <h1>${esc(meta.h1)}</h1>
    <p class="lead">${meta.lead}</p>
    <p class="g-meta"><span>By <a href="https://github.com/kwy404" rel="author">Alexandre Kohler</a></span><span>Updated <time datetime="${UPDATED}">${UPDATED_LABEL}</time></span><span>${meta.readTime}</span></p>
  </div>
</header>
<div class="wrap g-layout">
  <article class="g-article">
${body}
    <section id="faq" class="chapter"><h2><a href="#faq" class="anchor" aria-hidden="true" tabindex="-1">#</a>Questions</h2><div class="accordion collapse-plus">${faq}</div></section>
    <aside class="g-cta dark" aria-label="Get started">
      <img src="assets/mascot-dark.svg" width="110" height="110" alt="" loading="lazy">
      <div><h2>Put Hoot on guard</h2><p>One script tag in your head, free and open source. Trackers wait until visitors say yes.</p>
      <div class="cta-cmd"><code id="cta-cmd">&lt;script src="${CDN}"&gt;&lt;/script&gt;</code><button type="button" class="btn btn-sm btn-primary" v-copy-from="#cta-cmd" aria-label="Copy the script tag">${icon('copy')}Copy</button></div></div>
    </aside>
    <section id="related" class="chapter"><h2><a href="#related" class="anchor" aria-hidden="true" tabindex="-1">#</a>Keep reading</h2><div class="related">${related}</div></section>
  </article>
  <aside class="g-aside" aria-label="On this page">
    <nav class="g-toc" aria-labelledby="toc-title"><p id="toc-title" class="g-toc-title">${icon('moon')}On this page</p><ol>${toc}</ol></nav>
    <div class="g-side-card"><p><b>Try it live</b></p><p>Toggle categories in the demo and watch fake trackers get held or run.</p><a class="btn btn-sm btn-outline" href="./#demo">${icon('play')}Open the demo</a></div>
  </aside>
</div>`;
}

export function guideJsonLd(meta) {
  const url = `${SITE}${meta.slug}.html`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: meta.h1,
        description: meta.description,
        url,
        datePublished: UPDATED,
        dateModified: UPDATED,
        inLanguage: 'en',
        image: `${SITE}og.png`,
        author: { '@type': 'Person', name: 'Alexandre Kohler', url: 'https://github.com/kwy404' },
        publisher: { '@type': 'Person', name: 'Alexandre Kohler', url: 'https://github.com/kwy404' },
        about: { '@type': 'SoftwareApplication', name: 'cookieowl', url: SITE },
      },
      {
        '@type': 'FAQPage',
        mainEntity: meta.faq.map((f) => ({ '@type': 'Question', name: f.q.replace(/<[^>]+>/g, ''), acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'cookieowl', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE}guides.html` },
          { '@type': 'ListItem', position: 3, name: meta.crumb, item: url },
        ],
      },
    ],
  };
}

/** The star chart of guides. */
export function indexBody(guides) {
  const cards = GUIDES.map((g, i) => {
    const src = guides.find((x) => x.meta.slug === g.slug);
    return `<a class="chart-card" href="${g.slug}.html"><span class="chart-no">${String(i + 1).padStart(2, '0')}</span>${art(g.icon)}<span class="chart-star">${g.star}</span><strong>${esc(src.meta.h1)}</strong><span>${esc(src.meta.description)}</span><span class="chart-go">${src.meta.readTime}${icon('arrow')}</span></a>`;
  }).join('');
  return `<header class="g-head night dark">
  <div class="starfield" aria-hidden="true"></div>
  <div class="wrap g-head-in">
    ${crumbs([['cookieowl', './'], ['Guides', '']])}
    <h1>Cookie consent guides</h1>
    <p class="lead">Practical, honest guides for LGPD and GDPR cookie consent: blocking Google Analytics until consent, Google Consent Mode v2, React, Next.js and WordPress setups, and a checklist to review your site.</p>
  </div>
</header>
<div class="wrap section-tight"><div class="chart">${cards}</div></div>`;
}

export function indexJsonLd(guides) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'cookieowl guides',
        url: `${SITE}guides.html`,
        hasPart: GUIDES.map((g) => ({ '@type': 'TechArticle', headline: guides.find((x) => x.meta.slug === g.slug).meta.h1, url: `${SITE}${g.slug}.html` })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'cookieowl', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE}guides.html` },
        ],
      },
    ],
  };
}

export function notFoundBody() {
  return `<section class="nf night dark">
  <div class="starfield" aria-hidden="true"></div>
  <div class="wrap nf-in">
    <img src="assets/mascot-dark.svg" width="220" height="220" alt="Hoot the owl, holding a cookie and looking around">
    <div>
      <p class="kicker">Error 404</p>
      <h1>Hoot searched the whole night sky</h1>
      <p class="lead">This page is not here. Maybe it was a cookie that was never accepted.</p>
      <div class="hero-cta"><a class="btn btn-primary" href="./">${icon('arrow')}Back to cookieowl</a><a class="btn btn-outline" href="guides.html">Browse the guides</a><button type="button" class="btn btn-ghost" data-search-open>${icon('search')}Search</button></div>
    </div>
  </div>
</section>`;
}
