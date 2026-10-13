import { describe, expect, it, vi } from 'vitest';
import { focusables, h, trapFocus } from '../src/ui';
import { $, $$, click, owl } from './helpers';

const key = (el: Element, k: string, shift = false) => {
  const e = new KeyboardEvent('keydown', { key: k, shiftKey: shift, bubbles: true, cancelable: true });
  el.dispatchEvent(e);
  return e;
};

describe('banner', () => {
  it('is a labelled dialog with the title, text, policy link and three buttons', () => {
    owl({ lang: 'en', policyUrl: '/privacy' });
    const d = $('.cko [role=dialog]')!;
    expect(d.getAttribute('aria-modal')).toBe('false');
    expect(document.getElementById(d.getAttribute('aria-labelledby')!)!.textContent).toBe('We value your privacy');
    const desc = document.getElementById(d.getAttribute('aria-describedby')!)!;
    expect(desc.textContent).toContain('under the GDPR');
    expect(desc.textContent).toContain('Read our privacy policy.');
    expect(desc.querySelector('a')!.getAttribute('href')).toBe('/privacy');
    expect($$('.cko button').map((b) => b.textContent)).toEqual(['Reject all', 'Accept all', 'Customize']);
  });

  it('gives Reject and Accept the very same style', () => {
    owl();
    expect($('[data-cko=reject]')!.className).toBe($('[data-cko=accept]')!.className);
  });

  it('leaves out the policy sentence without a policyUrl', () => {
    owl({ lang: 'en' });
    expect($('.cko-text p')!.textContent).not.toContain('{policy}');
    expect($('.cko-text a')).toBeNull();
  });

  it('uses LGPD wording in Portuguese and lets you pick the template', () => {
    owl({ lang: 'pt-BR', policyUrl: '/privacidade' });
    expect($('.cko-text p')!.textContent).toContain('Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018)');
    expect($('.cko-text a')!.textContent).toBe('política de privacidade');
    owl({ lang: 'en', template: 'lgpd' });
    expect($$('.cko-text p').at(-1)!.textContent).toContain('Brazilian LGPD');
  });

  it('reads the language from <html lang>', () => {
    document.documentElement.lang = 'de-DE';
    owl();
    expect($('[data-cko=accept]')!.textContent).toBe('Alle akzeptieren');
    expect($('.cko')!.getAttribute('lang')).toBe('de');
  });

  it('applies text overrides, per language or for all', () => {
    owl({ lang: 'fr', text: { title: { en: 'Cookies?', fr: 'Des cookies ?' }, acceptAll: 'OK pour moi' } });
    expect($('.cko-title')!.textContent).toBe('Des cookies ?');
    expect($('[data-cko=accept]')!.textContent).toBe('OK pour moi');
  });

  it('escapes configured text instead of rendering markup', () => {
    owl({ text: { title: '<img src=x onerror=alert(1)>' } });
    expect($('.cko-title img')).toBeNull();
    expect($('.cko-title')!.textContent).toContain('<img');
  });

  it('supports bar, box and modal layouts and positions', () => {
    const o = owl({ layout: 'bar', position: 'top' });
    expect($('.cko-bar.cko-top')).not.toBeNull();
    o.init({ layout: 'box' });
    expect($('.cko-box.cko-bottom-right')).not.toBeNull();
    o.init({ layout: 'box', position: 'bottom-left' });
    expect($('.cko-box.cko-bottom-left')).not.toBeNull();
    o.init({ layout: 'bar' });
    expect($('.cko-bar.cko-bottom')).not.toBeNull();
  });

  it('makes the modal layout modal: focus moves in and Tab stays inside', () => {
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    owl({ layout: 'modal' });
    const card = $('.cko-modal')!;
    expect(card.getAttribute('aria-modal')).toBe('true');
    expect(document.activeElement).toBe(card);
    const veil = $('.cko-veil')!;
    const buttons = focusables(card);
    buttons.at(-1)!.focus();
    expect(key(veil, 'Tab').defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[0]);
    expect(key(veil, 'Tab', true).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons.at(-1));
  });

  it('sets the theme and text direction', () => {
    document.documentElement.dir = 'rtl';
    const o = owl({ theme: 'dark' });
    expect($('.cko')!.getAttribute('data-cko-theme')).toBe('dark');
    expect($('.cko')!.getAttribute('dir')).toBe('rtl');
    o.init({ dir: 'ltr' });
    expect($('.cko')!.getAttribute('data-cko-theme')).toBe('auto');
    expect($('.cko')!.getAttribute('dir')).toBe('ltr');
  });

  it('injects one scoped stylesheet', () => {
    owl();
    owl();
    expect($$('#cookieowl-css')).toHaveLength(1);
    expect($('#cookieowl-css')!.textContent).toContain('--seed');
  });

  it('mounts inside a container', () => {
    document.body.innerHTML = '<div id="demo"></div>';
    owl({ container: '#demo' });
    const demo = $('#demo')!;
    expect(demo.querySelector('.cko.cko-in [role=dialog]')).not.toBeNull();
    expect(demo.style.position).toBe('relative');
  });

  it('shows and hides on demand and emits show and hide', () => {
    const o = owl({ autoShow: false });
    const seen: string[] = [];
    o.on('show', (w) => seen.push(`show ${w}`));
    o.on('hide', (w) => seen.push(`hide ${w}`));
    o.show();
    o.show();
    o.hide();
    expect(seen).toEqual(['show banner', 'hide banner']);
  });
});

describe('preferences dialog', () => {
  it('lists categories with switches, no pre-ticked boxes and necessary always on', () => {
    owl({ lang: 'en' });
    click('[data-cko=customize]');
    const d = $('.cko-prefs')!;
    expect(d.getAttribute('role')).toBe('dialog');
    expect(d.getAttribute('aria-modal')).toBe('true');
    expect(document.activeElement).toBe(d);
    const sw = $$<HTMLInputElement>('.cko-sw');
    expect(sw.map((s) => s.name)).toEqual(['preferences', 'analytics', 'marketing']);
    expect(sw.every((s) => s.getAttribute('role') === 'switch' && !s.checked)).toBe(true);
    expect(sw.map((s) => s.getAttribute('aria-label'))).toEqual(['Preferences', 'Analytics', 'Marketing']);
    expect($('[data-category=necessary] .cko-always')!.textContent).toBe('Always on');
    // The banner waits behind the dialog.
    expect($('.cko-box')!.hidden).toBe(true);
  });

  it('reflects a previous choice when reopened', () => {
    const o = owl();
    o.save({ analytics: true });
    o.showPreferences();
    expect($$<HTMLInputElement>('.cko-sw').map((s) => s.checked)).toEqual([false, true, false]);
  });

  it('saves the switches', () => {
    const o = owl();
    o.showPreferences();
    $<HTMLInputElement>('input[name=marketing]')!.click();
    click('[data-cko=save]');
    expect(o.accepted('marketing')).toBe(true);
    expect(o.accepted('analytics')).toBe(false);
    expect(o.getConsent()!.method).toBe('custom');
    expect($('.cko-prefs')).toBeNull();
    expect($('.cko-box')).toBeNull();
  });

  it('offers Accept all and Reject all inside the dialog too', () => {
    const o = owl();
    o.showPreferences();
    click('.cko-prefs [data-cko=accept]');
    expect(o.accepted('marketing')).toBe(true);
    o.showPreferences();
    click('.cko-prefs [data-cko=reject]');
    expect(o.accepted('marketing')).toBe(false);
  });

  it('expands category details with services and cookies', () => {
    owl({
      lang: 'en',
      categories: [
        {
          id: 'analytics',
          services: [
            { name: 'Google Analytics', provider: 'Google', description: { en: 'Visit statistics' }, policyUrl: 'https://policies.google.com/privacy', cookies: [{ name: '_ga', duration: '2 years', description: 'Visitor id' }, { name: /^_ga_/, duration: { en: '2 years' } }] },
            { name: 'Plausible' },
          ],
        },
      ],
    });
    click('[data-cko=customize]');
    const more = $('[data-category=analytics] .cko-more')!;
    const detail = document.getElementById(more.getAttribute('aria-controls')!)!;
    expect(more.getAttribute('aria-expanded')).toBe('false');
    expect(detail.hidden).toBe(true);
    more.click();
    expect(more.getAttribute('aria-expanded')).toBe('true');
    expect(detail.hidden).toBe(false);
    const svc = detail.querySelectorAll('.cko-svc');
    expect(svc).toHaveLength(2);
    expect(svc[0]!.textContent).toContain('Google Analytics (Google)');
    expect(svc[0]!.textContent).toContain('Visit statistics');
    expect(svc[0]!.querySelector('a')!.getAttribute('rel')).toBe('noopener');
    expect([...svc[0]!.querySelectorAll('td')].map((c) => c.textContent)).toEqual(['_ga', '2 years', 'Visitor id', '^_ga_', '2 years', '']);
    expect(svc[1]!.querySelector('table')).toBeNull();
    more.click();
    expect(detail.hidden).toBe(true);
  });

  it('closes on Escape and returns to the banner', () => {
    owl();
    click('[data-cko=customize]');
    key($('.cko-prefs')!, 'Escape');
    expect($('.cko-prefs')).toBeNull();
    expect($('.cko-box')!.hidden).toBe(false);
    expect(document.activeElement).toBe($('[data-cko=customize]'));
  });

  it('closes with the close button and returns focus to where it was', () => {
    const o = owl();
    o.rejectAll();
    document.body.insertAdjacentHTML('beforeend', '<a href="#" id="footer-link" data-cookieowl-open>Cookie settings</a>');
    const link = $('#footer-link')!;
    link.focus();
    link.click();
    expect($('.cko-prefs')).not.toBeNull();
    $<HTMLButtonElement>('.cko-x')!.click();
    expect($('.cko-prefs')).toBeNull();
    expect(document.activeElement).toBe(link);
  });

  it('traps Tab inside the dialog', () => {
    owl();
    click('[data-cko=customize]');
    const d = $('.cko-prefs')!;
    const items = focusables(d);
    expect(items[0]!.className).toBe('cko-x');
    // Focus starts on the dialog itself: Shift Tab goes to the last control.
    expect(key(d, 'Tab', true).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(items.at(-1));
    expect(key(d, 'Tab').defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(items[0]);
    items[1]!.focus();
    expect(key(d, 'Tab').defaultPrevented).toBe(false);
    expect(key(d, 'a').defaultPrevented).toBe(false);
  });

  it('announces saved choices to screen readers', async () => {
    vi.useFakeTimers();
    try {
      const o = owl({ lang: 'en' });
      o.acceptAll();
      vi.advanceTimersByTime(60);
      expect($('.cko [aria-live=polite]')!.textContent).toBe('Your privacy choices were saved.');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('reopen button', () => {
  it('appears after a choice and opens the preferences', () => {
    const o = owl({ lang: 'es' });
    expect($('.cko-reopen')).toBeNull();
    o.rejectAll();
    const btn = $('.cko-reopen')!;
    expect(btn.hidden).toBe(false);
    expect(btn.getAttribute('aria-label')).toBe('Configurar cookies');
    btn.click();
    expect($('.cko-prefs')).not.toBeNull();
    expect(btn.hidden).toBe(true);
    $<HTMLButtonElement>('.cko-x')!.click();
    expect(btn.hidden).toBe(false);
    expect(document.activeElement).toBe(btn);
  });

  it('is there on later visits and can sit on the right or be turned off', () => {
    const first = owl();
    first.acceptAll();
    first.destroy();
    const o = owl({ reopenButton: 'right' });
    expect($('.cko-reopen.cko-right')).not.toBeNull();
    o.init({ reopenButton: false });
    expect($('.cko-reopen')).toBeNull();
  });
});

describe('DOM helpers', () => {
  it('h builds elements with attributes, events and children', () => {
    const fn = vi.fn();
    const el = h(document, 'button', { class: 'x', disabled: true, hidden: false, title: null, onclick: fn, 'data-n': 3 }, 'a', ['b', null, false], document.createElement('i'));
    expect(el.outerHTML).toBe('<button class="x" disabled="" data-n="3">ab<i></i></button>');
    el.click();
    expect(fn).not.toHaveBeenCalled();
    el.removeAttribute('disabled');
    el.click();
    expect(fn).toHaveBeenCalled();
  });

  it('trapFocus ignores other keys and prevents Tab when nothing is focusable', () => {
    const box = h(document, 'div', null, h(document, 'p', null, 'x'));
    document.body.append(box);
    const tab = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    trapFocus(box, tab);
    expect(tab.defaultPrevented).toBe(true);
    const other = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    trapFocus(box, other);
    expect(other.defaultPrevented).toBe(false);
  });

  it('focusables skips hidden and disabled controls', () => {
    const box = h(document, 'div', null, h(document, 'button', { disabled: true }), h(document, 'div', { hidden: true }, h(document, 'button')), h(document, 'a', { href: '#' }), h(document, 'span', { tabindex: '0' }));
    expect(focusables(box).map((e) => e.tagName)).toEqual(['A', 'SPAN']);
  });
});
