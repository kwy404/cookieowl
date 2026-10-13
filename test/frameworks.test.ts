import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { createApp, defineComponent, h, nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import { ConsentGate, useConsent, useCookieOwl } from '../src/react';
import { ConsentGate as VueGate, CookieOwlPlugin, useConsent as useVueConsent } from '../src/vue';
import { cookieowl } from '../src/index';
import { owl } from './helpers';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('React helpers', () => {
  it('ConsentGate renders the fallback until the category is accepted', async () => {
    const o = owl({ storage: 'memory' });
    const el = document.createElement('div');
    document.body.append(el);
    const root = createRoot(el);
    await act(async () => root.render(createElement(ConsentGate, { category: 'marketing', owl: o, fallback: createElement('p', null, 'Video blocked') }, createElement('iframe', { title: 'video' }))));
    expect(el.innerHTML).toBe('<p>Video blocked</p>');
    await act(async () => o.save({ marketing: true }));
    expect(el.innerHTML).toBe('<iframe title="video"></iframe>');
    await act(async () => o.rejectAll());
    expect(el.textContent).toBe('Video blocked');
    await act(async () => root.unmount());
  });

  it('useConsent returns one category or the whole map', async () => {
    const o = owl({ storage: 'memory' });
    const seen: unknown[] = [];
    function Probe() {
      expect(useCookieOwl()).toBe(cookieowl);
      expect(useCookieOwl(o)).toBe(o);
      seen.push([useConsent('analytics', o), useConsent(undefined, o)]);
      return null;
    }
    const el = document.createElement('div');
    const root = createRoot(el);
    await act(async () => root.render(createElement(Probe)));
    expect(seen.at(-1)).toEqual([false, { necessary: true, preferences: false, analytics: false, marketing: false }]);
    await act(async () => o.save({ analytics: true }));
    expect(seen.at(-1)).toEqual([true, { necessary: true, preferences: false, analytics: true, marketing: false }]);
    await act(async () => root.unmount());
  });

  it('ConsentGate renders nothing without a fallback, using the shared instance', async () => {
    cookieowl.init({ storage: 'memory', autoShow: false });
    const el = document.createElement('div');
    const root = createRoot(el);
    await act(async () => root.render(createElement(ConsentGate, { category: ['analytics', 'marketing'] }, 'shown')));
    expect(el.innerHTML).toBe('');
    await act(async () => cookieowl.acceptAll());
    expect(el.innerHTML).toBe('shown');
    await act(async () => root.unmount());
    cookieowl.destroy();
  });
});

describe('Vue helpers', () => {
  it('ConsentGate switches between the fallback and default slots', async () => {
    const o = owl({ storage: 'memory' });
    const el = document.createElement('div');
    const app = createApp({ render: () => h(VueGate, { category: 'analytics', owl: o }, { default: () => h('b', 'chart'), fallback: () => h('i', 'off') }) });
    app.mount(el);
    expect(el.innerHTML).toBe('<i>off</i>');
    o.save({ analytics: true });
    await nextTick();
    expect(el.innerHTML).toBe('<b>chart</b>');
    app.unmount();
  });

  it('useConsent gives a ref that stops updating after unmount', async () => {
    const o = owl({ storage: 'memory' });
    let ref: { value: boolean } | null = null;
    const Comp = defineComponent({
      setup() {
        ref = useVueConsent('marketing', o);
        return () => h('span', String(ref!.value));
      },
    });
    const el = document.createElement('div');
    const app = createApp(Comp);
    app.mount(el);
    expect(el.textContent).toBe('false');
    o.acceptAll();
    await nextTick();
    expect(el.textContent).toBe('true');
    app.unmount();
    o.rejectAll();
    expect(ref!.value).toBe(true);
    // Outside a component the ref still works.
    const loose = useVueConsent('marketing', o);
    o.acceptAll();
    expect(loose.value).toBe(true);
  });

  it('the plugin starts cookieowl and registers the component and $cookieowl', async () => {
    const o = owl({ storage: 'memory', autoShow: false });
    cookieowl.init({ storage: 'memory', autoShow: false });
    const el = document.createElement('div');
    const Root = defineComponent({
      setup() {
        return () => h(VueGate, { category: 'analytics' }, { default: () => h('p', 'on') });
      },
    });
    const app2 = createApp(Root);
    app2.use(CookieOwlPlugin, { instance: o, storage: 'memory', lang: 'fr', autoShow: false });
    expect(app2.config.globalProperties.$cookieowl).toBe(o);
    expect(app2.component('ConsentGate')).toBe(VueGate);
    expect(o.lang).toBe('fr');
    app2.mount(el);
    // The gate reads the shared instance by default.
    expect(el.innerHTML).toBe('<!---->');
    const app3 = createApp(Root);
    app3.use(CookieOwlPlugin);
    expect(app3.config.globalProperties.$cookieowl).toBe(cookieowl);
    cookieowl.acceptAll();
    await nextTick();
    expect(el.innerHTML).toBe('<p>on</p>');
    app2.unmount();
    cookieowl.destroy();
  });
});
