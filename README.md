<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/assets/mascot-dark.svg">
    <img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/assets/mascot.svg" width="168" alt="Hoot, the cookieowl mascot: a friendly owl in a guard cap holding a cookie, the face of a free cookie consent banner for LGPD and GDPR">
  </picture>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/scenes/readme-banner-dark.svg">
    <img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/scenes/readme-banner-light.svg" width="820" alt="cookieowl banner: cookie consent for LGPD and GDPR that really blocks trackers until visitors say yes, with one script tag, Consent Mode v2 and under 15 kB">
  </picture>
</p>

<h1 align="center">cookieowl: free cookie consent banner for LGPD and GDPR that really blocks trackers</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/cookieowl"><img src="https://img.shields.io/npm/v/cookieowl?color=f2b134&label=npm" alt="cookieowl npm version"></a>
  <a href="https://www.npmjs.com/package/cookieowl"><img src="https://img.shields.io/npm/dm/cookieowl?color=1b2547" alt="cookieowl npm downloads per month"></a>
  <a href="https://www.npmjs.com/package/cookieowl"><img src="https://img.shields.io/npm/dt/cookieowl?color=1b2547" alt="cookieowl total npm downloads"></a>
  <a href="https://github.com/kwy404/cookieowl/actions/workflows/ci.yml"><img src="https://github.com/kwy404/cookieowl/actions/workflows/ci.yml/badge.svg" alt="CI status of the cookieowl cookie consent library"></a>
  <a href="https://github.com/kwy404/cookieowl/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/cookieowl?color=f2b134" alt="MIT license"></a>
  <a href="https://github.com/kwy404/cookieowl/blob/main/scripts/size.mjs"><img src="https://img.shields.io/badge/gzip-14.9%20kB-f2b134" alt="The script tag build is 14.9 kB with gzip"></a>
  <a href="https://kwy404.github.io/cookieowl/#demo"><img src="https://img.shields.io/badge/live%20demo-network%20monitor-1b2547" alt="Live demo with a network monitor"></a>
</p>

<p align="center">
  <a href="https://kwy404.github.io/cookieowl/">Documentation</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/#demo">Live demo</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/#configurator">Snippet configurator</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/lgpd-gdpr-cookie-checklist.html">LGPD and GDPR checklist</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/api.html">API</a> &middot;
  <a href="https://github.com/kwy404/cookieowl/blob/main/i18n/README.pt-BR.md">Leia em Português (pt-BR)</a>
</p>

**cookieowl is a free, open source cookie consent manager for LGPD and GDPR.** Add one script tag and tracking scripts stay asleep until visitors accept their category: Google Analytics, Tag Manager, the Meta Pixel, Hotjar and YouTube embeds do not load, set cookies or send anything before the choice. It sets Google Consent Mode v2 for you, shows an accessible banner in five languages with Reject as prominent as Accept, keeps a versioned consent record and lets visitors withdraw as easily as they agreed. One file, no dependencies, 14.9 kB with gzip.

```html
<script src="https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js"
  data-policy-url="/privacy" data-consent-mode data-auto-block></script>
```

<table>
  <tr>
    <td width="33%" valign="top"><picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/gate-dark.svg"><img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/gate-light.svg" width="32" alt="Shield with a lock icon: block scripts before cookie consent"></picture><br><b>Real blocking before consent</b><br>Marked scripts and iframes stay inert, then run in order once their category is accepted.</td>
    <td width="33%" valign="top"><picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/auto-block-dark.svg"><img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/auto-block-light.svg" width="32" alt="Magnifier icon: automatic tracker blocking"></picture><br><b>Auto mode for known trackers</b><br>Google Analytics, Tag Manager, Meta Pixel, Clarity, Hotjar, LinkedIn and TikTok caught by URL.</td>
    <td width="33%" valign="top"><picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/consent-mode-dark.svg"><img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/consent-mode-light.svg" width="32" alt="Toggles icon: Google Consent Mode v2"></picture><br><b>Google Consent Mode v2</b><br>Denied defaults with wait_for_update, region defaults and an update on every choice.</td>
  </tr>
  <tr>
    <td width="33%" valign="top"><picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/video-embed-dark.svg"><img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/video-embed-light.svg" width="32" alt="Video player icon: click to load YouTube embeds"></picture><br><b>Click to load embeds</b><br>YouTube and Vimeo iframes become a placeholder with Load once and Allow.</td>
    <td width="33%" valign="top"><picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/record-dark.svg"><img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/record-light.svg" width="32" alt="Clipboard icon: consent log for audits"></picture><br><b>Records for audits</b><br>Version, timestamp and a random consent id, plus an onConsent hook for your log.</td>
    <td width="33%" valign="top"><picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/withdraw-dark.svg"><img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/withdraw-light.svg" width="32" alt="Owl eyes icon: reopen cookie preferences"></picture><br><b>Withdraw as easily as giving</b><br>A floating owl reopens the preferences; withdrawal erases cookies and stops scripts.</td>
  </tr>
  <tr>
    <td width="33%" valign="top"><picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/accessibility-dark.svg"><img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/accessibility-light.svg" width="32" alt="Accessibility icon: accessible cookie banner"></picture><br><b>Accessible, no dark patterns</b><br>Focus trap, keyboard, screen reader labels, equal Reject and Accept, no pre-ticked boxes.</td>
    <td width="33%" valign="top"><picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/language-dark.svg"><img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/language-light.svg" width="32" alt="Globe icon: cookie banner in five languages"></picture><br><b>Five languages</b><br>Portuguese with LGPD wording, English, Spanish, French and German. RTL safe.</td>
    <td width="33%" valign="top"><picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/balloon-dark.svg"><img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons/balloon-light.svg" width="32" alt="Feather icon: lightweight cookie consent script"></picture><br><b>14.9 kB, zero dependencies</b><br>Banner, dialog, styles, blocker, Consent Mode and five languages in one file.</td>
  </tr>
</table>

## Table of contents

- [Quick start](#quick-start)
- [Install from npm](#install-from-npm)
- [Use with React, Next.js, Vue, Angular and WordPress](#use-with-react-nextjs-vue-angular-and-wordpress)
- [Blocking scripts and embeds until consent](#blocking-scripts-and-embeds-until-consent)
- [Auto mode for known trackers](#auto-mode-for-known-trackers)
- [Google Consent Mode v2](#google-consent-mode-v2)
- [Categories, services and cookies](#categories-services-and-cookies)
- [The consent record](#the-consent-record)
- [Withdrawal, expiry and policy versions](#withdrawal-expiry-and-policy-versions)
- [Global Privacy Control and Do Not Track](#global-privacy-control-and-do-not-track)
- [Banner, theming and dark mode](#banner-theming-and-dark-mode)
- [Languages, LGPD and GDPR wording](#languages-lgpd-and-gdpr-wording)
- [API](#api)
- [Browser support and size](#browser-support-and-size)
- [What cookieowl does not do](#what-cookieowl-does-not-do)
- [FAQ](#faq)
- [Guides](#guides)
- [More from kwy404](#more-from-kwy404)
- [Author](#author)
- [License](#license)

## Quick start

Put the script tag **first** in `<head>`, **without** `async` or `defer`. It has to run before any tracker to block it and to set the Consent Mode defaults.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js"
    data-lang="auto"
    data-policy-url="/privacy"
    data-consent-mode
    data-auto-block></script>

  <!-- Google Analytics waits for the analytics category -->
  <script type="text/plain" data-cookieowl="analytics" async
    src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
  <script type="text/plain" data-cookieowl="analytics">
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX');
  </script>
</head>
<body>
  <a href="#" data-cookieowl-open>Cookie settings</a>
</body>
</html>
```

That is the whole setup. The banner appears on the first visit, the choice is stored for 12 months, and a small owl button reopens the preferences on every page. Try every option in the [configurator](https://kwy404.github.io/cookieowl/#configurator) and watch the [live demo](https://kwy404.github.io/cookieowl/#demo) hold and release fake trackers in a network monitor.

`https://unpkg.com/cookieowl@0.1.0/dist/cookieowl.js` serves the same file, or copy `dist/cookieowl.js` into your own static files.

## Install from npm

```bash
npm install cookieowl
```

```js
import { cookieowl } from 'cookieowl';

cookieowl.init({
  policyUrl: '/privacy',
  version: '2026-10',
  consentMode: true,
  autoBlock: true,
  onConsent(record) {
    navigator.sendBeacon('/api/consent-log', JSON.stringify(record));
  },
});

if (cookieowl.accepted('analytics')) startAnalytics();
cookieowl.on('change', ({ accepted }) => console.log('allowed now:', accepted));
```

| Import | What it is |
| --- | --- |
| `cookieowl` | The shared instance `cookieowl`, `createCookieOwl()`, `TRACKERS`, `LANGS` and the types. ES module and CommonJS. |
| `cookieowl/react` | `useConsent()`, `ConsentGate` and `useCookieOwl()` for React 16.8 and later. |
| `cookieowl/vue` | `CookieOwlPlugin`, `useConsent()` and `ConsentGate` for Vue 3. |
| `cookieowl/browser` | The script tag build, `dist/cookieowl.js` (global `cookieowl`). |

When the script tag already created `window.cookieowl`, the npm import returns that same instance, so the React and Vue helpers see the choice it manages. Importing on the server is safe: without a DOM, `init()` stores the configuration and nothing touches `document`.

## Use with React, Next.js, Vue, Angular and WordPress

**React.** Start cookieowl before rendering (or use the script tag in `index.html`) and gate what needs consent:

```tsx
import { cookieowl } from 'cookieowl';
import { ConsentGate, useConsent } from 'cookieowl/react';

cookieowl.init({ policyUrl: '/privacy', consentMode: true });

export function Video() {
  const marketing = useConsent('marketing');
  return (
    <ConsentGate category="marketing" fallback={<button onClick={() => cookieowl.showPreferences()}>Allow videos</button>}>
      <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Product tour" />
    </ConsentGate>
  );
}
```

**Next.js.** Load the script with `beforeInteractive` in the root layout so it runs before any other script:

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js"
          strategy="beforeInteractive" data-policy-url="/privacy" data-consent-mode="" data-auto-block="" />
      </body>
    </html>
  );
}
```

**Vue 3.**

```js
import { createApp } from 'vue';
import { CookieOwlPlugin } from 'cookieowl/vue';
import App from './App.vue';

createApp(App).use(CookieOwlPlugin, { policyUrl: '/privacy', consentMode: true }).mount('#app');
```

```vue
<script setup>
import { useConsent } from 'cookieowl/vue';
const analytics = useConsent('analytics'); // a ref that follows the choice
</script>

<template>
  <ConsentGate category="marketing">
    <iframe src="https://player.vimeo.com/video/123" title="Video" />
    <template #fallback>Video hidden until marketing cookies are allowed.</template>
  </ConsentGate>
</template>
```

**Angular.** Call `cookieowl.init()` in `src/main.ts` before `bootstrapApplication()`, or add the script tag to `src/index.html`. Read the state anywhere with `cookieowl.accepted()` and `cookieowl.on('change')`.

**WordPress.** Print the tag at the top of `wp_head` from a must use plugin or your child theme:

```php
add_action('wp_head', function () {
    $policy = esc_url(get_privacy_policy_url());
    echo '<script src="https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js"'
        . ' data-policy-url="' . $policy . '" data-consent-mode data-auto-block></script>';
}, 1);
```

**Plain HTML, PHP, Django, Rails, Laravel.** Use the script tag from the quick start in your base template.

## Blocking scripts and embeds until consent

Any element with `data-cookieowl` waits for its categories. List several (`data-cookieowl="analytics marketing"`) to require all of them.

```html
<!-- Inert until analytics is accepted: browsers do not run text/plain -->
<script type="text/plain" data-cookieowl="analytics" src="/js/stats.js"></script>
<script type="text/plain" data-cookieowl="analytics">startStats();</script>

<!-- Keep the original type, for example a module -->
<script type="text/plain" data-cookieowl="analytics" data-cookieowl-type="module" src="/js/stats.mjs"></script>

<!-- Iframes and images: the URL waits in data-cookieowl-src -->
<iframe data-cookieowl="marketing" data-cookieowl-name="Google Maps"
  data-cookieowl-src="https://www.google.com/maps/embed?pb=..." width="600" height="400"></iframe>
<img data-cookieowl="marketing" data-cookieowl-src="https://ads.example.com/pixel.gif" alt="">
```

When a category is accepted, its scripts run **in document order**: each external script without `async` finishes loading before the next one is inserted, so code that depends on a library sees it. Blocked iframes show a click to load placeholder with **Load once** and **Allow marketing cookies**. Elements added later (single page apps) are picked up automatically.

## Auto mode for known trackers

With `data-auto-block` (or `autoBlock: true`), cookieowl recognizes tracker URLs and holds them even when another script injects them:

| Id | Tracker | Default category |
| --- | --- | --- |
| `gtag` | Google Analytics (gtag.js, analytics.js) | analytics |
| `gtm` | Google Tag Manager | analytics |
| `google-ads` | Google Ads conversion and remarketing | marketing |
| `meta-pixel` | Meta Pixel | marketing |
| `clarity` | Microsoft Clarity | analytics |
| `hotjar` | Hotjar | analytics |
| `linkedin-insight` | LinkedIn Insight Tag | marketing |
| `tiktok-pixel` | TikTok Pixel | marketing |
| `youtube`, `youtube-api` | YouTube embeds (click to load) and the IFrame API | marketing |
| `vimeo` | Vimeo embeds (click to load) | marketing |

It works with a `MutationObserver` that turns parser inserted tracker scripts into `text/plain` before they run (the HTML parser performs a microtask checkpoint before running a script, which delivers the mutation first) and a hook on `document.createElement` that catches snippets such as the Meta Pixel. **Load cookieowl first, synchronously, in the head**: it cannot stop a tracker that ran before it. The browser preload scanner may still download, though never run, a tracker written directly in the HTML; explicit `text/plain` markup avoids even that download, so prefer it for the scripts you control.

```js
cookieowl.init({
  autoBlock: {
    patterns: [{ id: 'chat', name: 'Support chat', category: 'preferences', match: /widget\.chat\.example/ }],
    categories: { gtm: 'marketing' },  // move a tracker to another category
    ignore: ['hotjar'],                // leave one alone
  },
});
```

## Google Consent Mode v2

With `data-consent-mode` (or `consentMode: true`) cookieowl defines `gtag` if needed and sends, before any Google tag:

```js
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied', functionality_storage: 'denied', personalization_storage: 'denied',
  security_storage: 'granted', wait_for_update: 500,
});
gtag('set', 'ads_data_redaction', true);
```

Every choice (and every return visit) sends a `consent update`. The mapping is: `ad_storage`, `ad_user_data` and `ad_personalization` follow **marketing**, `analytics_storage` follows **analytics**, `functionality_storage` and `personalization_storage` follow **preferences**, `security_storage` is always granted. A `cookieowl_consent` event with the categories is pushed to the dataLayer for Tag Manager triggers.

```js
cookieowl.init({
  consentMode: {
    waitForUpdate: 500,
    regions: [{ region: ['US'], analytics_storage: 'granted' }],  // region specific defaults
    mapping: { analytics_storage: ['analytics'] },
    urlPassthrough: false,
    adsDataRedaction: true,
    advanced: false,  // true: Google tags load before consent and send cookieless pings
  },
});
```

In **basic mode** (the default) Google tags do not load until consent; mark them with `text/plain` or use auto mode. In **advanced mode** (`data-consent-mode="advanced"`) the auto blocker lets Google tags load so they can send cookieless pings, while still holding every other tracker.

## Categories, services and cookies

The default categories are `necessary` (always on), `preferences`, `analytics` and `marketing`, with translated labels and descriptions. Add your own and describe the services behind each one; the preferences dialog lists them, and the declared cookies are erased when the category is withdrawn.

```js
cookieowl.init({
  categories: [
    'preferences',
    {
      id: 'analytics',
      services: [{
        name: 'Google Analytics 4',
        provider: 'Google Ireland Ltd',
        policyUrl: 'https://policies.google.com/privacy',
        cookies: [
          { name: '_ga', duration: '2 years', description: 'Distinguishes visitors' },
          { name: '_ga_*', duration: '2 years', description: 'Session state' },  // prefix, or a RegExp
        ],
      }],
    },
    { id: 'support-chat', label: { en: 'Support chat', 'pt-BR': 'Chat de suporte' }, description: 'Intercom messenger' },
  ],
});
```

## The consent record

The choice is kept in a first party cookie named `cookieowl` (or in localStorage with `storage: 'localStorage'`):

```json
{
  "id": "1f0c9a7e-6b2d-4c41-9a1e-3f6f0d2b8c55",
  "version": "2026-10",
  "timestamp": "2026-10-13T21:04:11.093Z",
  "expires": "2027-10-13T21:04:11.093Z",
  "categories": { "necessary": true, "preferences": false, "analytics": true, "marketing": false },
  "method": "custom",
  "lang": "pt-BR",
  "page": "/checkout"
}
```

`method` is `accept-all`, `reject-all`, `custom` or `signal`. The id is random and stays the same across updates on one device. Pass `onConsent(record)` to send each record to your own audit log; cookieowl has no server and sends nothing anywhere.

## Withdrawal, expiry and policy versions

- **Withdraw any time.** The floating owl button (`reopenButton`) and any `data-cookieowl-open` element open the preferences. `cookieowl.showPreferences()` does the same from code.
- **Withdrawal stops trackers.** Cookies of withdrawn categories are erased (declared service cookies and the known cookies of auto mode trackers, on the host and parent domains). If scripts of that category already ran on the page, the page reloads; pass `reloadOnWithdraw: (categories) => {}` to handle it yourself in a single page app.
- **Expiry.** Choices expire after `expiresDays` (365 by default) and the banner asks again.
- **Versions.** Change `version` when your vendors or purposes change and every visitor is asked again. Adding a category does the same automatically.
- **Reset.** `cookieowl.reset()` forgets the choice and shows the banner.

## Global Privacy Control and Do Not Track

When a browser sends Global Privacy Control, cookieowl records a refusal of optional categories (`method: "signal"`, `signal: "gpc"`), skips the banner and explains the signal in the preferences, where the visitor can still opt in. Turn it off with `respectGPC: false`. Do Not Track is honored the same way with `respectDNT: true`.

## Banner, theming and dark mode

- **Layouts:** `box` (corner card, default), `bar` (full width, `position: 'top'` or `'bottom'`) and `modal` (centered, with a focus trap).
- **No dark patterns:** Reject all and Accept all use the exact same style, optional switches start off, there is no cookie wall.
- **Accessible:** labelled dialogs, focus trap and focus return, Escape to close, switches with names, a polite live announcement after saving, visible focus rings, reduced motion and forced colors support.
- **Theme:** `theme: 'auto'` follows a `data-theme` attribute or `.dark` class on the page, then the system setting; `'light'` and `'dark'` force one. The accent is your `--seed` color (amber by default), the same variable that themes [Monsoon](https://kwy404.github.io/monsoon/), but cookieowl ships its own small scoped stylesheet and needs nothing from the page.

```css
:root { --seed: #2f6fed; }                 /* accent of buttons and switches */
.cko { --cko-font: Inter, sans-serif; }    /* and --cko-bg, --cko-fg, --cko-line, --cko-ring... */
```

- **Inside a container:** `container: '#preview'` mounts the UI inside an element, handy for previews and demos.

## Languages, LGPD and GDPR wording

| Code | Language | Default template |
| --- | --- | --- |
| `pt-BR` | Português (Brasil) | LGPD (Lei 13.709/2018, art. 8, paragraph 5 on revocation) |
| `en` | English | GDPR and ePrivacy |
| `es` | Español | GDPR (RGPD) |
| `fr` | Français | GDPR (RGPD) |
| `de` | Deutsch | GDPR (DSGVO and TDDDG) |

`lang: 'auto'` reads `<html lang>`, then the browser languages. `template: 'lgpd' | 'gdpr'` switches the legal wording in any language. Every text can be overridden, for all languages or per language:

```js
cookieowl.init({
  text: {
    title: { en: 'Cookies on this site', 'pt-BR': 'Cookies neste site' },
    acceptAll: 'OK',
  },
});
```

The layout uses logical CSS properties and follows `<html dir>` (or `dir: 'rtl'`), so right to left text works.

## API

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `categories` | `(string \| Category)[]` | `['necessary', 'preferences', 'analytics', 'marketing']` | Category ids or objects with `label`, `description`, `required`, `services`. |
| `lang` | `string` | `'auto'` | `pt-BR`, `en`, `es`, `fr`, `de` or `auto`. |
| `template` | `'lgpd' \| 'gdpr'` | `lgpd` for Portuguese | Legal wording. |
| `policyUrl` | `string` | none | Link to your privacy policy. |
| `version` | `string \| number` | `1` | Policy version; a change asks again. |
| `expiresDays` | `number` | `365` | Lifetime of a choice. |
| `storage` | `'cookie' \| 'localStorage' \| 'memory'` | `'cookie'` | Where the record lives. |
| `cookie` | `{ name, domain, path, sameSite }` | `cookieowl`, `/`, `Lax` | Cookie options. |
| `layout` | `'box' \| 'bar' \| 'modal'` | `'box'` | Banner layout. |
| `position` | `'bottom' \| 'top' \| 'bottom-left' \| 'bottom-right'` | per layout | Banner position. |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Color scheme. |
| `dir` | `'auto' \| 'ltr' \| 'rtl'` | `'auto'` | Text direction. |
| `reopenButton` | `boolean \| 'left' \| 'right'` | `true` | Floating button that reopens the preferences. |
| `container` | `HTMLElement \| string` | `document.body` | Mount inside an element. |
| `text` | `Partial<Texts>` | built in | Override any text. |
| `consentMode` | `boolean \| ConsentModeConfig` | `false` | Google Consent Mode v2. |
| `autoBlock` | `boolean \| AutoBlockConfig` | `false` | Hold known trackers by URL. |
| `respectGPC` | `boolean` | `true` | Honor Global Privacy Control. |
| `respectDNT` | `boolean` | `false` | Honor Do Not Track. |
| `clearCookies` | `boolean` | `true` | Erase cookies of withdrawn categories. |
| `reloadOnWithdraw` | `boolean \| (categories) => void` | `true` | Reload when scripts of a withdrawn category ran. |
| `autoShow` | `boolean` | `true` | Show the banner on init when needed. |
| `onConsent` | `(record) => void` | none | Called with every record, for your audit log. |

### Script tag attributes

`data-lang`, `data-template`, `data-policy-url`, `data-version`, `data-categories` (comma separated), `data-layout`, `data-position`, `data-theme`, `data-dir`, `data-storage`, `data-expires-days`, `data-container`, `data-consent-mode` (or `="advanced"`), `data-auto-block`, `data-gpc="false"`, `data-dnt`, `data-reopen` (`"false"`, `"left"`, `"right"`) and `data-manual` (skip the automatic init). Set `window.cookieowlConfig = { ... }` before the tag for everything else; attributes win.

### Methods

| Method | Description |
| --- | --- |
| `init(config)` | Starts cookieowl and returns the instance. Calling it again replaces the configuration. |
| `accepted(category \| category[])` | True when every given category is accepted. |
| `acceptAll()`, `rejectAll()` | Record a choice for every optional category. |
| `save(choices)` | Save `{ analytics: true }` or a list of accepted ids. |
| `getConsent()` | A copy of the record, or `null`. |
| `categories()` | The configured categories with translated labels. |
| `show()`, `hide()` | Show or hide the banner. |
| `showPreferences()`, `hidePreferences()` | Open or close the preferences dialog. |
| `reset()` | Forget the choice and ask again. |
| `on(event, fn)`, `off(event, fn)` | Listen to events; `on` returns an unsubscribe function. |
| `destroy()` | Remove the UI, observers and hooks. |
| `createCookieOwl(config?)` | A separate instance (tests, previews). |

### Events

| Event | Detail | When |
| --- | --- | --- |
| `change` | `{ categories, accepted, changed, record }` | A category was accepted or withdrawn. |
| `consent` | the record | A choice was made. |
| `ready` | `{ categories, accepted, changed, record }` | `init` finished. |
| `show`, `hide` | `'banner' \| 'preferences'` | The banner or dialog opened or closed. |
| `reset` | none | `reset()` was called. |

The same events are dispatched on `document` as `cookieowl:change`, `cookieowl:consent` and so on.

## Browser support and size

cookieowl targets ES2020 browsers: Chrome and Edge 80+, Firefox 74+, Safari 13.1+. The colors use `color-mix()` (Chrome 111+, Safari 16.2+, Firefox 113+); older browsers still block trackers and show a working banner with simpler colors.

| File | Minified | Gzip |
| --- | ---: | ---: |
| `dist/cookieowl.js` (everything, five languages) | 40.7 kB | 14.9 kB |

The size is checked by `npm run build`, which fails above 15 kB with gzip.

## What cookieowl does not do

- It does not scan your site for cookies; declare your services, and auto mode knows the common trackers.
- It does not store consent on a server; use `onConsent` to keep your own log.
- It does not implement the IAB Transparency and Consent Framework (TCF).
- It is not legal advice. It implements the mechanics that LGPD and GDPR guidance describes; your counsel decides the rest.

## FAQ

**How do I block Google Analytics until cookie consent?**
Change both parts of the GA snippet to `type="text/plain"` with `data-cookieowl="analytics"`, or turn on `data-auto-block`. gtag.js is then not even requested until analytics is accepted. See the [guide](https://kwy404.github.io/cookieowl/block-google-analytics-until-consent.html).

**Is there a free cookie consent banner for LGPD in Portuguese?**
Yes. `data-lang="pt-BR"` (or `auto` on a Portuguese page) shows the LGPD wording, with Rejeitar todos and Aceitar todos side by side. See the [LGPD guide](https://kwy404.github.io/cookieowl/cookie-consent-banner-lgpd.html).

**How do I set up Google Consent Mode v2 with a cookie banner?**
Add `data-consent-mode`. cookieowl sends the denied defaults before any tag and an update on every choice. See the [Consent Mode guide](https://kwy404.github.io/cookieowl/google-consent-mode-v2-setup.html).

**Is cookieowl GDPR compliant?**
It implements what regulators check: prior blocking, Reject on the first layer, no pre-ticked boxes, granular choices, easy withdrawal and proof of consent. Compliance also depends on your policy and processing; see the [GDPR guide](https://kwy404.github.io/cookieowl/gdpr-compliant-cookie-banner.html) and the [checklist](https://kwy404.github.io/cookieowl/lgpd-gdpr-cookie-checklist.html).

**How do I add cookie consent to React or Next.js?**
Use the script tag (Next.js: `next/script` with `beforeInteractive`) and the `cookieowl/react` helpers. See the [React](https://kwy404.github.io/cookieowl/cookie-consent-in-react.html) and [Next.js](https://kwy404.github.io/cookieowl/cookie-consent-in-nextjs.html) guides.

**How do I add a cookie banner to WordPress without a paid plugin?**
Print the script tag at the top of `wp_head`. See the [WordPress guide](https://kwy404.github.io/cookieowl/cookie-banner-for-wordpress.html).

**Does it work without a build step?**
Yes. The script tag build defines a global `cookieowl` and starts on its own.

**Can visitors change their mind later?**
Yes, through the floating owl button or any `data-cookieowl-open` link. Withdrawal erases the category cookies and reloads the page if its scripts ran.

### How it compares

A neutral comparison with the usual kinds of consent tools:

| | cookieowl | Typical hosted consent platform | Typical banner only script |
| --- | --- | --- | --- |
| Price | Free, MIT | Free tier, then paid by traffic | Usually free |
| Blocks scripts before consent | Yes, markup and auto mode | Usually | No, shows a notice |
| Google Consent Mode v2 | Yes | Usually | Rarely |
| Hosting | Your site or a public CDN | The vendor's servers | Your site |
| Cookie scanner | No | Usually | No |
| Consent log | Your own, through `onConsent` | Vendor dashboard | No |
| IAB TCF | No | Often | No |

## Guides

- [The LGPD and GDPR cookie consent checklist (interactive)](https://kwy404.github.io/cookieowl/lgpd-gdpr-cookie-checklist.html)
- [Cookie consent banner for LGPD (Brazil)](https://kwy404.github.io/cookieowl/cookie-consent-banner-lgpd.html)
- [What makes a cookie banner GDPR compliant](https://kwy404.github.io/cookieowl/gdpr-compliant-cookie-banner.html)
- [Google Consent Mode v2 setup](https://kwy404.github.io/cookieowl/google-consent-mode-v2-setup.html)
- [Block Google Analytics until consent](https://kwy404.github.io/cookieowl/block-google-analytics-until-consent.html)
- [Cookie consent in React](https://kwy404.github.io/cookieowl/cookie-consent-in-react.html)
- [Cookie consent in Next.js](https://kwy404.github.io/cookieowl/cookie-consent-in-nextjs.html)
- [Cookie banner for WordPress](https://kwy404.github.io/cookieowl/cookie-banner-for-wordpress.html)
- [Free cookie consent script](https://kwy404.github.io/cookieowl/free-cookie-consent-script.html)

## More from kwy404

- [Monsoon](https://kwy404.github.io/monsoon/): utility-first CSS with no build step and a theme from one seed color.
- [Voodoo.js](https://kwy404.github.io/Voodoo.js/): reactive attributes and JSX in plain HTML.
- [breakhound](https://kwy404.github.io/breakhound/): find bugs in any JavaScript library automatically.
- [vueleap](https://kwy404.github.io/vueleap/): Vue 2 to Vue 3 migration.
- [graphemely](https://kwy404.github.io/graphemely/): grapheme aware string utilities.
- [numberparrot](https://kwy404.github.io/numberparrot/): parse localized numbers.
- [edgegoat](https://kwy404.github.io/edgegoat/): edge case inputs for JavaScript testing.

## Author

Created by **Alexandre Kohler** ([GitHub](https://github.com/kwy404) and [LinkedIn](https://www.linkedin.com/in/alexandre-silva-173687256/)).

The [documentation site](https://kwy404.github.io/cookieowl/) is built with [Monsoon](https://kwy404.github.io/monsoon/), and its interactive parts with [Voodoo.js](https://kwy404.github.io/Voodoo.js/). Its storybook art (Hoot, the town, the tracker bugs, 18 spot illustrations and a family of 57 icons, each in a dawn and a night version) lives in [docs/assets/art](https://github.com/kwy404/cookieowl/tree/main/docs/assets/art) and is MIT licensed like the code.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons-sheet-dark.svg">
    <img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/icons-sheet-light.svg" width="820" alt="The cookieowl icon family: 57 icons with rounded navy lines and an amber tint, for consent categories, blocked services, legal terms and the storybook props">
  </picture>
</p>

## License

[MIT](https://github.com/kwy404/cookieowl/blob/main/LICENSE) 2026 Alexandre Kohler
