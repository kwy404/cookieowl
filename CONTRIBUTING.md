# Contributing to cookieowl

Thanks for helping keep trackers asleep until visitors say yes. Issues and pull requests are welcome.

## Setup

```bash
git clone https://github.com/kwy404/cookieowl.git
cd cookieowl
npm install
npm run build
npm test
```

Node 18 or later is required.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run build` | Builds the ES module, CommonJS, types and the script tag build, then checks the 15 kB gzip budget. |
| `npm run typecheck` | Type checks the sources and tests. |
| `npm run lint` | Runs ESLint and the house rules (no emoji, no en or em dash characters, no names of other CSS frameworks). |
| `npm test` | Runs the tests with Vitest and jsdom. The browser build test needs `npm run build` first. |
| `npm run coverage` | Runs the tests with coverage. |
| `npm run docs` | Rebuilds the site in `docs/` from `site/` (run `npm run build` first). |
| `npm run docs:check` | Fails when `docs/` is out of date. |
| `npm run art` | Rewrites the mascot, banners, favicon and icons in `assets/`. |
| `npm run images` | Renders the social preview and the Open Graph image with Edge headless. |

## Guidelines

- Keep the script tag build under 15 kB with gzip. `npm run build` fails above the budget.
- Every feature needs tests. Blocking, Consent Mode and the UI all have test files in `test/`.
- Texts must be translated in all five built in languages. `test/i18n.test.ts` checks that every key exists.
- Keep the banner free of dark patterns: Reject and Accept share one style, optional categories start off.
- Do not add runtime dependencies.
- Write commit messages in English, in the imperative mood.

## Adding a tracker to auto mode

Add an entry to `src/trackers.ts` with an id, a name, a default category, a URL pattern anchored to the vendor host and the first party cookies it sets. Add a test in `test/blocker.test.ts` that matches a real URL of that vendor.

## Reporting a bug

Open an issue with the browser, the configuration you pass to `init`, what you expected and what happened. A network panel screenshot helps a lot for blocking issues.
