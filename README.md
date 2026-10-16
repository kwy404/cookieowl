<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/assets/mascot-dark.svg">
    <img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/assets/mascot.svg" width="150" alt="Hoot, the cookieowl mascot: an owl in a guard cap holding a cookie">
  </picture>
</p>

<h1 align="center">cookieowl</h1>

<p align="center">A small cookie consent banner for LGPD and GDPR that keeps trackers from running until visitors agree.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/cookieowl"><img src="https://img.shields.io/npm/v/cookieowl?color=f2b134&label=npm" alt="npm version"></a>
  <a href="https://github.com/kwy404/cookieowl/actions/workflows/ci.yml"><img src="https://github.com/kwy404/cookieowl/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <a href="https://github.com/kwy404/cookieowl/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/cookieowl?color=1b2547" alt="MIT license"></a>
</p>

<p align="center">
  <a href="https://kwy404.github.io/cookieowl/#configurator">Banner generator</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/#demo">Live demo</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/guides.html">Guides</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/api.html">API</a> &middot;
  <a href="https://github.com/kwy404/cookieowl/blob/main/i18n/README.pt-BR.md">Português</a>
</p>

Most cookie banners only hide themselves. cookieowl stops the browser from running the scripts you mark until their category is accepted, sets Google Consent Mode v2, and lets visitors change their mind later. It is one file with no dependencies and no server, MIT licensed.

## Quick start

The easiest way is the [banner generator](https://kwy404.github.io/cookieowl/#configurator): pick a region, a color and your words, check the live preview and copy one line. By hand, it looks like this:

```html
<head>
  <!-- First thing in the head, without async or defer -->
  <script src="https://cdn.jsdelivr.net/npm/cookieowl@0.2.0/dist/cookieowl.js"
    data-preset="gdpr" data-policy-url="/privacy"></script>

  <!-- Google Analytics now waits for the analytics category -->
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
```

The banner shows on the first visit, the choice is kept for 12 months, and a small owl button reopens the preferences on every page.

### Presets

| Preset | Sets |
| --- | --- |
| `data-preset="lgpd"` | Portuguese texts, LGPD wording, Consent Mode v2 and auto blocking |
| `data-preset="gdpr"` | The visitor's language, GDPR wording, Consent Mode v2 and auto blocking |

Anything you set yourself wins over the preset, so `data-preset="lgpd" data-lang="en"` keeps the LGPD wording in English.

### Colors and texts

```html
<script src="https://cdn.jsdelivr.net/npm/cookieowl@0.2.0/dist/cookieowl.js"
  data-preset="lgpd" data-accent="#2f6fed" data-layout="bar"
  data-text-title="Cookies on this site" data-text-accept-all="OK"></script>
```

`data-accent` takes any CSS color. Every built in text can be replaced with `data-text-*`, for example `data-text-description` or `data-text-reject-all`.

## npm

```bash
npm install cookieowl
```

```js
import { cookieowl } from 'cookieowl';

cookieowl.init({
  preset: 'gdpr',
  policyUrl: '/privacy',
  onConsent(record) {
    navigator.sendBeacon('/api/consent-log', JSON.stringify(record));
  },
});

if (cookieowl.accepted('analytics')) startAnalytics();
cookieowl.on('change', ({ accepted }) => console.log('allowed now:', accepted));
```

`cookieowl/react` adds `useConsent()` and `ConsentGate`, and `cookieowl/vue` adds a plugin with the same helpers. When the script tag already created `window.cookieowl`, the npm import returns that same instance. Importing on the server is safe.

```tsx
import { ConsentGate } from 'cookieowl/react';

<ConsentGate category="marketing" fallback={<p>Accept marketing cookies to watch.</p>}>
  <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Product tour" />
</ConsentGate>
```

## How blocking works

Any element with `data-cookieowl` waits for its categories:

```html
<script type="text/plain" data-cookieowl="analytics" src="/js/stats.js"></script>
<iframe data-cookieowl="marketing" data-cookieowl-src="https://www.youtube-nocookie.com/embed/ID"></iframe>
```

Browsers do not run `text/plain`, so nothing is requested. Once the category is accepted, the scripts run in document order and blocked iframes load. Until then, iframes show a placeholder that can load the content once or allow the category.

With `data-auto-block`, cookieowl also holds known trackers by URL when another script injects them: Google Analytics, Tag Manager, Google Ads, the Meta Pixel, Microsoft Clarity, Hotjar, LinkedIn Insight, the TikTok Pixel, YouTube and Vimeo. It can only stop what runs after it, so load it first.

## Google Consent Mode v2

With `data-consent-mode`, cookieowl sends `gtag('consent', 'default', ...)` with everything denied except `security_storage` before any Google tag, then a `consent update` on every choice and every return visit. Marketing drives the three ad signals, analytics drives `analytics_storage`, and preferences drives the functionality and personalization signals. `data-consent-mode="advanced"` lets Google tags load before consent and send cookieless pings. The [Consent Mode guide](https://kwy404.github.io/cookieowl/google-consent-mode-v2-setup.html) covers region defaults and Tag Manager.

## What gets stored

One first party cookie named `cookieowl` with a random id, your policy version, a timestamp, an expiry date, the method (`accept-all`, `reject-all`, `custom` or `signal`) and the categories. Pass `onConsent(record)` to keep your own log. Change `version` to ask everyone again.

When a browser sends Global Privacy Control, cookieowl records a refusal of optional categories and skips the banner; visitors can still opt in from the preferences.

## Languages

Portuguese (Brazil), English, Spanish, French and German. `lang: 'auto'` reads `<html lang>`, then the browser. The layout follows `<html dir>`, so right to left text works.

## API

The full list of options, attributes, methods and events is on the [API page](https://kwy404.github.io/cookieowl/api.html). The most used ones:

| Option | Attribute | Default |
| --- | --- | --- |
| `preset` | `data-preset` | none |
| `policyUrl` | `data-policy-url` | none |
| `lang` | `data-lang` | `'auto'` |
| `layout` | `data-layout` | `'box'` (also `'bar'` and `'modal'`) |
| `theme` | `data-theme` | `'auto'` |
| `accent` | `data-accent` | amber |
| `categories` | `data-categories` | necessary, preferences, analytics, marketing |
| `consentMode` | `data-consent-mode` | off |
| `autoBlock` | `data-auto-block` | off |
| `respectGPC` | `data-gpc` | on |

Methods: `init`, `accepted`, `acceptAll`, `rejectAll`, `save`, `getConsent`, `showPreferences`, `reset`, `on`, `off` and `destroy`.

## What it does not do

- It does not scan your site for cookies.
- It does not store consent on a server.
- It does not implement the IAB Transparency and Consent Framework.
- It is not legal advice. It handles the technical part; your privacy policy and legal review are still yours.

## Browser support

ES2020 browsers: Chrome and Edge 80+, Firefox 74+, Safari 13.1+. The script tag build is about 15 kB with gzip, and `npm run build` checks that budget.

## Guides

- [Cookie consent checklist](https://kwy404.github.io/cookieowl/lgpd-gdpr-cookie-checklist.html)
- [Setting up Google Consent Mode v2](https://kwy404.github.io/cookieowl/google-consent-mode-v2-setup.html)
- [Holding Google Analytics until consent](https://kwy404.github.io/cookieowl/block-google-analytics-until-consent.html)
- [Using cookieowl with React](https://kwy404.github.io/cookieowl/cookie-consent-in-react.html)

## More from kwy404

[Monsoon](https://kwy404.github.io/monsoon/), [Voodoo.js](https://kwy404.github.io/Voodoo.js/), [breakhound](https://kwy404.github.io/breakhound/), [vueleap](https://kwy404.github.io/vueleap/), [graphemely](https://kwy404.github.io/graphemely/), [numberparrot](https://kwy404.github.io/numberparrot/), [edgegoat](https://kwy404.github.io/edgegoat/), [installkite](https://kwy404.github.io/installkite/), [a11ymedic](https://kwy404.github.io/a11ymedic/), [fontsketch](https://kwy404.github.io/fontsketch/) and [kastor](https://kwy404.github.io/kastor/).

## Author

Made by **Alexandre Kohler** ([GitHub](https://github.com/kwy404), [LinkedIn](https://www.linkedin.com/in/alexandre-silva-173687256/)). The [documentation site](https://kwy404.github.io/cookieowl/) is built with [Monsoon](https://kwy404.github.io/monsoon/), and its interactive parts with [Voodoo.js](https://kwy404.github.io/Voodoo.js/).

## License

[MIT](https://github.com/kwy404/cookieowl/blob/main/LICENSE) 2026 Alexandre Kohler
