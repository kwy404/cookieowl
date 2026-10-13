// Thin Vue 3 helpers. Vue is an optional peer dependency.
import { defineComponent, onScopeDispose, ref, getCurrentScope, type App, type PropType, type Ref } from 'vue';
import { cookieowl as shared, type CookieOwl } from './index';
import type { CookieOwlConfig } from './types';

/** A ref that follows whether the category (or every one of several) is accepted. */
export function useConsent(category: string | string[], owl: CookieOwl = shared): Ref<boolean> {
  const accepted = ref(owl.accepted(category));
  const update = () => {
    accepted.value = owl.accepted(category);
  };
  const offs = [owl.on('change', update), owl.on('ready', update)];
  if (getCurrentScope()) onScopeDispose(() => offs.forEach((off) => off()));
  return accepted;
}

/** Renders the default slot after consent and the `fallback` slot before. */
export const ConsentGate = defineComponent({
  name: 'ConsentGate',
  props: {
    category: { type: [String, Array] as PropType<string | string[]>, required: true },
    owl: { type: Object as PropType<CookieOwl>, default: undefined },
  },
  setup(props, { slots }) {
    const ok = useConsent(props.category, props.owl || shared);
    return () => (ok.value ? slots.default?.() : slots.fallback?.()) ?? null;
  },
});

/**
 * Vue plugin: `app.use(CookieOwlPlugin, config)` starts cookieowl in the browser,
 * registers <ConsentGate> and exposes `$cookieowl` in templates.
 */
export const CookieOwlPlugin = {
  install(app: App, config?: CookieOwlConfig & { instance?: CookieOwl }) {
    const owl = config?.instance || shared;
    if (config && typeof window !== 'undefined') {
      const { instance: _ignored, ...rest } = config;
      void _ignored;
      owl.init(rest);
    }
    app.config.globalProperties.$cookieowl = owl;
    app.provide('cookieowl', owl);
    app.component('ConsentGate', ConsentGate);
  },
};
