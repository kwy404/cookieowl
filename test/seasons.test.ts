// The special dates of the docs site: the date logic of docs/seasons.js, its
// overrides and chip, and the seasonal art of scripts/seasons.mjs.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runInNewContext } from 'node:vm';
import { gzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'docs', 'seasons.js'), 'utf8');

interface Pick {
  id: string;
  on: boolean;
  forced?: boolean;
}
interface Seasons {
  IDS: string[];
  easter(y: number): Date;
  seasonFor(d: Date, br?: boolean): string | null;
  pick(search: string, d: Date, br: boolean, store: Pick | unknown): Pick | null;
  label(id: string, br?: boolean): string;
}

// Without a document the script only publishes its functions.
const sandbox: { cookieowlSeasons?: Seasons } = {};
runInNewContext(source, sandbox);
const S = sandbox.cookieowlSeasons as Seasons;
const day = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12);
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

describe('easter', () => {
  it('matches the known dates from 2024 to 2030', () => {
    const known = { 2024: '2024-03-31', 2025: '2025-04-20', 2026: '2026-04-05', 2027: '2027-03-28', 2028: '2028-04-16', 2029: '2029-04-01', 2030: '2030-04-21' };
    for (const [y, d] of Object.entries(known)) expect(ymd(S.easter(Number(y)))).toBe(d);
  });
});

describe('seasonFor', () => {
  const at = (y: number, m: number, d: number, br = false) => S.seasonFor(day(y, m, d), br);

  it('finds New Year from December 30 to January 2', () => {
    expect(at(2026, 12, 29)).toBeNull();
    expect(at(2026, 12, 30)).toBe('newyear');
    expect(at(2026, 12, 31)).toBe('newyear');
    expect(at(2027, 1, 2)).toBe('newyear');
    expect(at(2027, 1, 3)).toBeNull();
  });

  it('finds Christmas from December 18 to 26', () => {
    expect(at(2026, 12, 17)).toBeNull();
    expect(at(2026, 12, 18)).toBe('christmas');
    expect(at(2026, 12, 26)).toBe('christmas');
    expect(at(2026, 12, 27)).toBeNull();
  });

  it('finds Halloween from October 24 to 31', () => {
    expect(at(2026, 10, 23)).toBeNull();
    expect(at(2026, 10, 24)).toBe('halloween');
    expect(at(2026, 10, 31)).toBe('halloween');
    expect(at(2026, 11, 1)).toBeNull();
  });

  it('finds Easter from Good Friday to Easter Sunday', () => {
    expect(at(2026, 4, 2)).toBeNull();
    expect(at(2026, 4, 3)).toBe('easter');
    expect(at(2026, 4, 5)).toBe('easter');
    expect(at(2026, 4, 6)).toBeNull();
    expect(at(2027, 3, 26)).toBe('easter');
    expect(at(2027, 3, 29)).toBeNull();
  });

  it('finds Carnival from the Saturday before Ash Wednesday through Ash Wednesday', () => {
    // 2027: Easter March 28, Ash Wednesday February 10.
    expect(at(2027, 2, 5)).toBeNull();
    expect(at(2027, 2, 6)).toBe('carnival');
    expect(at(2027, 2, 9)).toBe('carnival');
    expect(at(2027, 2, 10)).toBe('carnival');
    expect(at(2027, 2, 11)).toBeNull();
    // 2026: Ash Wednesday February 18, so Carnival starts on February 14 and wins over Valentine's.
    expect(at(2026, 2, 13)).toBeNull();
    expect(at(2026, 2, 14)).toBe('carnival');
    expect(at(2026, 2, 18)).toBe('carnival');
  });

  it("finds Valentine's on February 14, and on June 12 only for pt-BR", () => {
    expect(at(2027, 2, 13)).toBeNull();
    expect(at(2027, 2, 14)).toBe('valentine');
    expect(at(2027, 2, 15)).toBeNull();
    expect(at(2026, 6, 12)).toBeNull();
    expect(at(2026, 6, 12, true)).toBe('valentine');
  });

  it('finds Festa Junina from June 13 to 29 for everyone, named Midsummer outside pt-BR', () => {
    expect(at(2026, 6, 13)).toBe('junina');
    expect(at(2026, 6, 29, true)).toBe('junina');
    expect(at(2026, 6, 30, true)).toBeNull();
    expect(S.label('junina', true)).toBe('Festa Junina');
    expect(S.label('junina', false)).toBe('Midsummer');
  });

  it('is quiet on an ordinary day', () => {
    expect(at(2026, 10, 15)).toBeNull();
    expect(at(2026, 8, 1, true)).toBeNull();
  });
});

describe('pick', () => {
  const store = (off: Record<string, string> = {}) => ({ getItem: (k: string) => off[k] ?? null });

  it('forces any season with ?season=<id>, on any date', () => {
    expect(S.pick('?season=halloween', day(2026, 8, 1), false, store())).toEqual({ id: 'halloween', on: true, forced: true });
    expect(S.pick('?a=1&season=junina', day(2026, 8, 1), false, store({ 'cookieowl:season-off:junina': '1' }))).toEqual({ id: 'junina', on: true, forced: true });
  });

  it('turns the season off with ?season=off and ignores unknown names', () => {
    expect(S.pick('?season=off', day(2026, 12, 24), false, store())).toBeNull();
    expect(S.pick('?season=summer', day(2026, 12, 24), false, store())).toBeNull();
  });

  it('follows the date and the stored off switch of that season', () => {
    expect(S.pick('', day(2026, 12, 24), false, store())).toEqual({ id: 'christmas', on: true });
    expect(S.pick('', day(2026, 12, 24), false, store({ 'cookieowl:season-off:christmas': '1' }))).toEqual({ id: 'christmas', on: false });
    expect(S.pick('', day(2026, 12, 24), false, store({ 'cookieowl:season-off:halloween': '1' }))).toEqual({ id: 'christmas', on: true });
    expect(S.pick('', day(2026, 12, 24), false, null)).toEqual({ id: 'christmas', on: true });
    expect(S.pick('', day(2026, 8, 1), false, store())).toBeNull();
  });
});

describe('on a page', () => {
  function load(url: string, off: Record<string, string> = {}) {
    const dom = new JSDOM('<!doctype html><html><head></head><body><section class="town"></section></body></html>', { url, runScripts: 'outside-only' });
    const w = dom.window as unknown as Window & { eval(code: string): void };
    // Reduced motion: the chip and the static art, no particles.
    Object.defineProperty(w, 'matchMedia', { value: () => ({ matches: true }) });
    for (const [k, v] of Object.entries(off)) w.localStorage.setItem(k, v);
    w.eval(source);
    return w;
  }

  it('sets data-season and adds a chip whose switch turns the season off and remembers it', () => {
    const w = load('https://kwy404.github.io/cookieowl/?season=halloween');
    const html = w.document.documentElement;
    expect(html.getAttribute('data-season')).toBe('halloween');
    const chip = w.document.querySelector('.season-chip') as HTMLElement;
    expect(chip.textContent).toContain('Halloween mode');
    expect(chip.querySelector('img')?.getAttribute('src')).toBe('https://kwy404.github.io/cookieowl/assets/seasons/halloween/hoot-light.svg');
    const sw = chip.querySelector('button') as HTMLButtonElement;
    expect(sw.getAttribute('role')).toBe('switch');
    expect(sw.getAttribute('aria-checked')).toBe('true');
    sw.click();
    expect(html.hasAttribute('data-season')).toBe(false);
    expect(sw.getAttribute('aria-checked')).toBe('false');
    expect(w.localStorage.getItem('cookieowl:season-off:halloween')).toBe('1');
    sw.click();
    expect(html.getAttribute('data-season')).toBe('halloween');
    expect(w.localStorage.getItem('cookieowl:season-off:halloween')).toBeNull();
    expect(w.document.querySelector('.season-fx')).toBeNull();
  });

  it('does nothing with ?season=off', () => {
    const w = load('https://kwy404.github.io/cookieowl/?season=off');
    expect(w.document.documentElement.hasAttribute('data-season')).toBe(false);
    expect(w.document.querySelector('.season-chip')).toBeNull();
  });

  it('stays small', () => {
    expect(gzipSync(source, { level: 9 }).length).toBeLessThan(3072);
  });
});

describe('seasonal art', () => {
  it('draws Hoot, three icons and a hero accent per season, in light and dark', async () => {
    const art = await import(pathToFileURL(join(root, 'scripts', 'seasons.mjs')).href);
    const book = await import(pathToFileURL(join(root, 'scripts', 'storybook.mjs')).href);
    const files: Record<string, string> = art.seasonFiles([
      ['light', book.DAWN],
      ['dark', book.NIGHT],
    ]);
    expect(art.SEASONS).toEqual(S.IDS);
    for (const id of S.IDS) {
      const icons: string[] = art.SEASON_ICONS[id];
      expect(icons.length).toBeGreaterThanOrEqual(3);
      expect(icons.length).toBeLessThanOrEqual(4);
      for (const theme of ['light', 'dark']) {
        expect(files[`${id}/hoot-${theme}.svg`]).toMatch(/^<svg [^>]*viewBox="0 -32 256 288"/);
        expect(files[`${id}/hero-${theme}.svg`]).toMatch(/^<svg [^>]*viewBox="0 0 1000 760" preserveAspectRatio="xMaxYMax meet"/);
        for (const n of icons) expect(files[`${id}/icon-${n}-${theme}.svg`]).toMatch(/^<svg [^>]*viewBox="0 0 24 24"/);
      }
    }
    const bad = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]|NaN|undefined`);
    for (const [name, svg] of Object.entries(files)) {
      expect(svg, name).not.toMatch(bad);
      expect(svg, name).toContain('aria-hidden="true"');
    }
  });
});
