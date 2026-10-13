import { describe, expect, it } from 'vitest';
import { Blocker, categoriesOf } from '../src/blocker';
import { TRACKERS } from '../src/trackers';
import { $, $$, click, flush, owl } from './helpers';

const order = () => (document.body.dataset.order || '').split(',').filter(Boolean);
const run = (id: string) => `document.body.dataset.order = (document.body.dataset.order ? document.body.dataset.order + ',' : '') + '${id}'`;

describe('categoriesOf', () => {
  it('splits on spaces and commas', () => {
    const el = document.createElement('script');
    el.setAttribute('data-cookieowl', 'analytics, marketing  x');
    expect(categoriesOf(el)).toEqual(['analytics', 'marketing', 'x']);
    expect(categoriesOf(document.createElement('div'))).toEqual([]);
  });
});

describe('manual blocking', () => {
  it('keeps text/plain scripts inert until their category is accepted', async () => {
    document.body.innerHTML = `
      <script type="text/plain" data-cookieowl="analytics">${run('a1')}</script>
      <script type="text/plain" data-cookieowl="marketing">${run('m1')}</script>
      <script type="text/plain" data-cookieowl="analytics marketing">${run('both')}</script>`;
    const o = owl();
    await flush();
    expect(order()).toEqual([]);
    o.save({ analytics: true });
    await flush();
    expect(order()).toEqual(['a1']);
    o.save({ analytics: true, marketing: true });
    await flush();
    expect(order()).toEqual(['a1', 'm1', 'both']);
    // Each element runs once.
    o.acceptAll();
    await flush();
    expect(order()).toEqual(['a1', 'm1', 'both']);
  });

  it('runs scripts in document order, waiting for each external script to load', async () => {
    document.body.innerHTML = `
      <script type="text/plain" data-cookieowl="analytics">${run('1')}</script>
      <script type="text/plain" data-cookieowl="analytics" src="https://cdn.example.com/lib.js" data-extra="kept" type-orig="x"></script>
      <script type="text/plain" data-cookieowl="analytics">${run('3')}</script>
      <script type="text/plain" data-cookieowl="analytics" data-cookieowl-src="https://cdn.example.com/async.js" async></script>
      <script type="text/plain" data-cookieowl="analytics">${run('5')}</script>`;
    const o = owl();
    o.save({ analytics: true });
    await flush();
    expect(order()).toEqual(['1']);
    const ext = $<HTMLScriptElement>('script[src="https://cdn.example.com/lib.js"]')!;
    expect(ext.type).toBe('');
    expect(ext.getAttribute('data-extra')).toBe('kept');
    expect(ext.async).toBe(false);
    ext.dispatchEvent(new Event('load'));
    await flush();
    // The async one does not hold the queue.
    expect(order()).toEqual(['1', '3', '5']);
    expect($('script[src="https://cdn.example.com/async.js"]')).not.toBeNull();
  });

  it('keeps going after a script fails to load', async () => {
    document.body.innerHTML = `
      <script type="text/plain" data-cookieowl="analytics" src="https://cdn.example.com/missing.js"></script>
      <script type="text/plain" data-cookieowl="analytics">${run('after')}</script>`;
    owl().acceptAll();
    await flush();
    $('script[src="https://cdn.example.com/missing.js"]')!.dispatchEvent(new Event('error'));
    await flush();
    expect(order()).toEqual(['after']);
  });

  it('restores a module type from data-cookieowl-type', async () => {
    document.body.innerHTML = '<script type="text/plain" data-cookieowl="analytics" data-cookieowl-type="module" src="https://cdn.example.com/m.js"></script>';
    owl().acceptAll();
    await flush();
    expect($<HTMLScriptElement>('script[src="https://cdn.example.com/m.js"]')!.type).toBe('module');
  });

  it('runs elements added later when their category is already accepted', async () => {
    const o = owl();
    o.acceptAll();
    const div = document.createElement('div');
    div.innerHTML = `<script type="text/plain" data-cookieowl="marketing">${run('late')}</script>`;
    document.body.append(div);
    await flush();
    expect(order()).toEqual(['late']);
  });

  it('runs scripts on init for a returning visitor', async () => {
    owl().acceptAll();
    document.body.innerHTML = `<script type="text/plain" data-cookieowl="analytics">${run('again')}</script>`;
    owl();
    await flush();
    expect(order()).toEqual(['again']);
  });

  it('loads iframes and images from data-cookieowl-src', async () => {
    document.body.innerHTML = `
      <iframe data-cookieowl="marketing" data-cookieowl-src="https://maps.example.com/embed" width="400" height="300"></iframe>
      <img data-cookieowl="marketing" data-cookieowl-src="https://px.example.com/p.gif" alt="">`;
    const o = owl();
    await flush();
    const frame = $<HTMLIFrameElement>('iframe')!;
    expect(frame.getAttribute('src')).toBeNull();
    expect(frame.hidden).toBe(true);
    expect($('.cko-embed')?.textContent).toContain('maps.example.com content is blocked');
    o.save({ marketing: true });
    await flush();
    expect(frame.getAttribute('src')).toBe('https://maps.example.com/embed');
    expect(frame.hidden).toBe(false);
    expect($('.cko-embed')).toBeNull();
    expect($('img')!.getAttribute('src')).toBe('https://px.example.com/p.gif');
  });

  it('uses data-cookieowl-name in the placeholder', async () => {
    document.body.innerHTML = '<iframe data-cookieowl="marketing" data-cookieowl-name="Spotify" data-cookieowl-src="https://open.spotify.com/embed/x"></iframe>';
    owl();
    expect($('.cko-embed strong')!.textContent).toBe('Spotify content is blocked');
  });
});

describe('auto mode', () => {
  it('blocks parser style tracker scripts by URL and releases them on consent', async () => {
    const o = owl({ autoBlock: true });
    document.head.insertAdjacentHTML('beforeend', '<script data-test async src="https://www.googletagmanager.com/gtag/js?id=G-TEST"></script>');
    await flush();
    const s = $<HTMLScriptElement>('script[src*="gtag/js"]')!;
    expect(s.type).toBe('text/plain');
    expect(s.getAttribute('data-cookieowl')).toBe('analytics');
    expect(s.getAttribute('data-cookieowl-auto')).toBe('gtag');
    o.save({ analytics: true });
    await flush();
    const live = $$<HTMLScriptElement>('script[src*="gtag/js"]');
    expect(live).toHaveLength(1);
    expect(live[0]!.type).toBe('');
    expect(live[0]!.hasAttribute('data-cookieowl-done')).toBe(true);
  });

  it('leaves unknown and first party scripts alone', async () => {
    owl({ autoBlock: true });
    document.head.insertAdjacentHTML('beforeend', '<script data-test src="/app.js"></script><script data-test src="https://cdn.example.com/x.js"></script>');
    await flush();
    expect($$('script[data-test]').every((s) => (s as HTMLScriptElement).type === '')).toBe(true);
  });

  it('catches trackers injected with document.createElement, like the Meta Pixel snippet', async () => {
    const o = owl({ autoBlock: true });
    const t = document.createElement('script');
    t.async = true;
    t.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.append(t);
    expect(t.type).toBe('text/plain');
    expect(t.getAttribute('data-cookieowl')).toBe('marketing');
    const viaAttr = document.createElement('script');
    viaAttr.setAttribute('type', 'text/javascript');
    viaAttr.setAttribute('src', 'https://www.clarity.ms/tag/abc');
    viaAttr.setAttribute('data-test', '');
    document.head.append(viaAttr);
    expect(viaAttr.type).toBe('text/plain');
    expect(viaAttr.getAttribute('data-cookieowl-type')).toBe('text/javascript');
    expect(viaAttr.src).toBe('https://www.clarity.ms/tag/abc');
    o.acceptAll();
    await flush();
    const clarity = $<HTMLScriptElement>('script[src="https://www.clarity.ms/tag/abc"]')!;
    expect(clarity.type).toBe('text/javascript');
    t.remove();
    $$('script[src*="fbevents"]').forEach((s) => s.remove());
  });

  it('lets trackers through once their category is accepted', () => {
    const o = owl({ autoBlock: true });
    o.save({ marketing: true });
    const s = document.createElement('script');
    s.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    expect(s.type).toBe('');
    expect(s.hasAttribute('data-cookieowl')).toBe(false);
  });

  it('replaces YouTube and Vimeo embeds with a click to load placeholder', async () => {
    const o = owl({ autoBlock: true, lang: 'en' });
    document.body.innerHTML = '<p><iframe width="560" height="315" src="https://www.youtube.com/embed/abc" title="Talk"></iframe></p>';
    await flush();
    const frame = $<HTMLIFrameElement>('iframe')!;
    expect(frame.getAttribute('src')).toBe('about:blank');
    expect(frame.getAttribute('data-cookieowl-src')).toBe('https://www.youtube.com/embed/abc');
    expect(frame.hidden).toBe(true);
    const ph = $('.cko-embed')!;
    expect(ph.getAttribute('role')).toBe('group');
    expect(ph.textContent).toContain('YouTube content is blocked');
    expect(ph.style.aspectRatio).toBe('560 / 315');
    expect(ph.style.width).toBe('560px');
    click('[data-cko=once]');
    expect(frame.getAttribute('src')).toBe('https://www.youtube.com/embed/abc');
    expect(frame.hidden).toBe(false);
    expect(o.accepted('marketing')).toBe(false);
  });

  it('accepts the category from the placeholder', async () => {
    const o = owl({ autoBlock: true });
    const f = document.createElement('iframe');
    f.src = 'https://player.vimeo.com/video/1';
    expect(f.getAttribute('src')).toBeNull();
    document.body.append(f);
    await flush();
    expect($('.cko-embed')).not.toBeNull();
    expect($('.cko-embed')!.style.minHeight).toBe('200px');
    click('[data-cko=allow]');
    await flush();
    expect(o.accepted('marketing')).toBe(true);
    expect(f.getAttribute('src')).toBe('https://player.vimeo.com/video/1');
    expect($('.cko-embed')).toBeNull();
  });

  it('handles embeds that were in the page before init', () => {
    document.body.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/x"></iframe>';
    owl({ autoBlock: true });
    expect($('.cko-embed')).not.toBeNull();
  });

  it('lets Google tags through in Consent Mode advanced', async () => {
    owl({ autoBlock: true, consentMode: { advanced: true } });
    const s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-X';
    expect(s.type).toBe('');
    const fb = document.createElement('script');
    fb.src = 'https://connect.facebook.net/en_US/fbevents.js';
    expect(fb.type).toBe('text/plain');
  });

  it('supports custom patterns, ignore and category moves', async () => {
    const o = owl({ autoBlock: { patterns: [{ id: 'chat', name: 'Chat', category: 'preferences', match: /widget\.chat\.example/ }], ignore: ['hotjar'], categories: { clarity: 'marketing' } } });
    const chat = document.createElement('script');
    chat.src = 'https://widget.chat.example/loader.js';
    expect(chat.getAttribute('data-cookieowl')).toBe('preferences');
    const hj = document.createElement('script');
    hj.src = 'https://static.hotjar.com/c/hotjar-1.js';
    expect(hj.type).toBe('');
    const cl = document.createElement('script');
    cl.src = 'https://www.clarity.ms/tag/x';
    expect(cl.getAttribute('data-cookieowl')).toBe('marketing');
    o.destroy();
  });

  it('restores document.createElement on destroy', () => {
    const before = document.createElement;
    const o = owl({ autoBlock: true });
    expect(document.createElement).not.toBe(before);
    o.destroy();
    expect(document.createElement).toBe(before);
    const s = document.createElement('script');
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    expect(s.type).toBe('');
  });

  it('cancels blocked scripts in beforescriptexecute', () => {
    owl({ autoBlock: true });
    const s = document.createElement('script');
    s.type = 'text/plain';
    const e = new Event('beforescriptexecute', { cancelable: true });
    Object.defineProperty(e, 'target', { value: s });
    document.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
  });
});

describe('Blocker directly', () => {
  it('matches relative URLs against the page and ignores empty ones', () => {
    const b = new Blocker(document, { trackers: TRACKERS, allowed: () => false });
    expect(b.match('https://snap.licdn.com/li.lms-analytics/insight.min.js')?.id).toBe('linkedin-insight');
    expect(b.match('//static.hotjar.com/c/hotjar-1.js?sv=6')?.id).toBe('hotjar');
    expect(b.match('https://www.google-analytics.com/analytics.js')?.id).toBe('gtag');
    expect(b.match('https://www.googleadservices.com/pagead/conversion.js')?.id).toBe('google-ads');
    expect(b.match('https://www.youtube.com/iframe_api')?.id).toBe('youtube-api');
    expect(b.match('/gtag/js')).toBeNull();
    expect(b.match('')).toBeNull();
    expect(b.match(null)).toBeNull();
    expect(new Blocker(document, { trackers: null, allowed: () => false }).match('https://static.hotjar.com/c/x.js')).toBeNull();
  });

  it('starts once and stops cleanly', () => {
    const b = new Blocker(document, { trackers: null, allowed: () => true });
    b.start();
    b.start();
    b.stop();
    b.stop();
    expect(document.createElement).toBe(Document.prototype.createElement);
  });
});
