import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', 'coverage/', 'docs/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        globalThis: 'readonly',
        CustomEvent: 'readonly',
        MutationObserver: 'readonly',
        Element: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLScriptElement: 'readonly',
        HTMLIFrameElement: 'readonly',
        KeyboardEvent: 'readonly',
        Event: 'readonly',
        matchMedia: 'readonly',
        IntersectionObserver: 'readonly',
      },
    },
  },
);
