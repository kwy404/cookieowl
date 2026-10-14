# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-10-13

### Added

- Consent engine with the categories necessary (always on), preferences, analytics, marketing and custom ones, each with services, cookies and durations.
- Consent record with a random id, policy version, timestamp, expiry, method, categories, language and page, stored in a first party cookie, localStorage or memory.
- New prompt when the policy version changes, when the record expires (12 months by default) or when a category is added.
- Blocking of `type="text/plain"` scripts and `data-cookieowl-src` iframes and images until their categories are accepted, released in document order.
- Auto mode that holds Google Analytics, Google Tag Manager, Google Ads, Meta Pixel, Microsoft Clarity, Hotjar, LinkedIn Insight, TikTok Pixel, YouTube and Vimeo by URL, with custom patterns, category moves and an ignore list.
- Click to load placeholders for blocked embeds, with Load once and Allow.
- Google Consent Mode v2 with denied defaults, `wait_for_update`, region defaults, mapping, `ads_data_redaction`, `url_passthrough`, basic and advanced modes, and a `cookieowl_consent` dataLayer event.
- Withdrawal that erases the cookies of withdrawn categories and reloads the page when their scripts ran, or calls your handler.
- Global Privacy Control respected by default and Do Not Track by option.
- Accessible banner (box, bar and modal layouts) and preferences dialog, with focus trap, keyboard support, screen reader labels, equal Reject and Accept buttons and no pre-ticked boxes.
- Scoped stylesheet themed by `--seed`, with light, dark and automatic themes and RTL support.
- Built in pt-BR, en, es, fr and de texts with LGPD and GDPR templates.
- Events `change`, `consent`, `ready`, `show`, `hide` and `reset`, also dispatched on `document`, and an `onConsent` audit hook.
- Script tag build configured by data attributes or `window.cookieowlConfig`, under 15 kB with gzip.
- React helpers (`useConsent`, `ConsentGate`, `useCookieOwl`) and Vue helpers (`CookieOwlPlugin`, `useConsent`, `ConsentGate`).

[Unreleased]: https://github.com/kwy404/cookieowl/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/kwy404/cookieowl/releases/tag/v0.1.0
