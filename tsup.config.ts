import { readFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

const { version } = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };
const define = { __VERSION__: JSON.stringify(version) };

const MANGLE = [
  'cfg', 'store', 'lastId', 'state', 'listeners', 'blocker', 'ui', 'gcm', 'signalNow', 'texts', 'onDocClick', 'onReady',
  'resolveCategory', 'defaults', 'isValid', 'getUI', 'emit', 'commit', 'withdraw', 'observer', 'queue', 'placeholders',
  'restoreCreate', 'onBeforeExecute', 'doc', 'opts', 'visit', 'mark', 'block', 'addPlaceholder', 'hookCreate', 'ran',
  'reveal', 'loadOnce', 'banner', 'prefs', 'reopenBtn', 'live', 'returnFocus', 'actions', 'serviceBlock', 'showBanner',
  'hideBanner', 'showPrefs', 'hidePrefs', 'syncReopen', 'announce', 'choices', 'mount', 'unmount', 'hasChoice', 'shown',
  'trackers', 'allowed', 'days', 'raw', 'getGtag', 'el', 'host', 'policyNodes',
];

export default defineConfig([
  {
    entry: { index: 'src/index.ts', react: 'src/react.ts', vue: 'src/vue.ts' },
    format: ['esm', 'cjs'],
    // One shared chunk for every entry, also in CommonJS, so cookieowl/react
    // and cookieowl/vue use the same instance as the main entry.
    splitting: true,
    dts: true,
    clean: true,
    target: 'es2020',
    platform: 'browser',
    external: ['react', 'vue'],
    define,
  },
  {
    entry: { cookieowl: 'src/browser.ts' },
    format: ['iife'],
    outExtension: () => ({ js: '.js' }),
    minify: true,
    target: 'es2020',
    platform: 'browser',
    define,
    // Internal member names are shortened in the script tag build only.
    esbuildOptions(o) {
      o.mangleProps = new RegExp(`^(${MANGLE.join('|')})$`);
    },
    banner: { js: `/*! cookieowl ${version} MIT */` },
  },
]);
