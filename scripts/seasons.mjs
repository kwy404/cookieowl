// The seasonal art of the cookieowl site: for each special date, Hoot in a
// costume, three icons in the storybook icon style and a hero accent that
// lays props over the hero town. Every drawing is a function of a palette
// (DAWN or NIGHT from storybook.mjs), so each file exists in a light and a
// dark version. Costumes are drawn in the coordinates of the 256 by 256
// mascot, so the same costume dresses the standalone Hoot and the Hoot that
// sits on the lantern post of the hero (see heroLayers in storybook.mjs).
// scripts/build-docs.mjs writes the files to docs/assets/seasons/<id>/ and
// scripts/build-art.mjs to assets/seasons/<id>/. docs/seasons.js picks the
// season and the pages show the matching files.
import { C, mascot } from './art.mjs';

export const SEASONS = ['newyear', 'carnival', 'easter', 'valentine', 'junina', 'halloween', 'christmas'];

const f = (n) => Number(n.toFixed(1));
const INK = C.ink;
const K = {
  pumpkin: '#e8833a',
  pumpkinDeep: '#b85a1e',
  stem: '#4f6b3a',
  witch: '#2e2548',
  red: '#c8463d',
  redDeep: '#94302a',
  pine: '#3f7d5a',
  pineDeep: '#2c5c41',
  snow: '#f8f4ea',
  purple: '#8a5cc7',
  pink: '#e58aa8',
  rose: '#d6336c',
  mint: '#8fcfbf',
  sky: '#8fb4e8',
  lilac: '#c9a7e8',
  straw: '#e9c77b',
  strawDeep: '#c79a45',
  gold: '#f2b134',
  goldDeep: '#d98a1c',
  wood: '#8a5a33',
};
const line = (w = 3) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// ---------- Small props, placed by their center ----------

function pumpkin(x, y, r, face = true) {
  const w = r * 1.25;
  const lobes = [-0.5, 0, 0.5].map((k) => `<ellipse cx="${f(x + k * w)}" cy="${y}" rx="${f(w * 0.55)}" ry="${r}" fill="${K.pumpkin}" ${line(r / 8)}/>`).join('');
  const faceSvg = face
    ? `<path d="M${f(x - r * 0.55)} ${f(y - r * 0.15)}l${f(r * 0.22)} ${f(-r * 0.3)} ${f(r * 0.22)} ${f(r * 0.3)}ZM${f(x + r * 0.11)} ${f(y - r * 0.15)}l${f(r * 0.22)} ${f(-r * 0.3)} ${f(r * 0.22)} ${f(r * 0.3)}ZM${f(x - r * 0.55)} ${f(y + r * 0.25)}q${f(r * 0.55)} ${f(r * 0.45)} ${f(r * 1.1)} 0l${f(-r * 0.2)} ${f(r * 0.08)}-${f(r * 0.17)}-${f(r * 0.1)}-${f(r * 0.18)} ${f(r * 0.12)}-${f(r * 0.18)}-${f(r * 0.12)}-${f(r * 0.17)} ${f(r * 0.1)}Z" fill="${K.gold}"/>`
    : '';
  return `<g><path d="M${x} ${f(y - r * 0.9)}q${f(r * 0.1)} ${f(-r * 0.45)} ${f(r * 0.4)} ${f(-r * 0.55)}" fill="none" stroke="${K.stem}" stroke-width="${f(r / 4)}" stroke-linecap="round"/>${lobes}${faceSvg}</g>`;
}

function bat(x, y, s, color) {
  return `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -4c3 0 4 3 4 5 4-4 10-6 16-4-4 2-5 6-4 9-3-2-7-2-9 1-2-2-5-2-7 0-2-2-5-2-7 0-2-3-6-3-9-1 1-3 0-7-4-9 6-2 12 0 16 4 0-2 1-5 4-5Z" fill="${color}"/>`;
}

function heart(x, y, s, fill) {
  return `<path transform="translate(${x} ${y}) scale(${s})" d="M0 9C-6 4-12 0-12-5a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 5-6 9-12 14Z" fill="${fill}" ${line(2.4 / s)}/>`;
}

function egg(x, y, r, fill, band) {
  return `<g><ellipse cx="${x}" cy="${y}" rx="${f(r * 0.78)}" ry="${r}" fill="${fill}" ${line(Math.max(1.5, r / 7))}/><path d="M${f(x - r * 0.74)} ${f(y + r * 0.05)}q${f(r * 0.37)} ${f(-r * 0.3)} ${f(r * 0.74)} 0 ${f(r * 0.37)} ${f(r * 0.3)} ${f(r * 0.74)} 0" fill="none" stroke="${band}" stroke-width="${f(Math.max(1.5, r / 6))}" stroke-linecap="round"/></g>`;
}

function pine(x, y, h) {
  const w = h * 0.42;
  const tiers = [0, 0.3, 0.58].map((k, i) => `<path d="M${x} ${f(y - h + k * h)}L${f(x + w * (0.55 + i * 0.22))} ${f(y - h + k * h + h * 0.42)}H${f(x - w * (0.55 + i * 0.22))}Z" fill="${K.pine}" ${line(3)}/>`).join('');
  const snow = [0, 0.3, 0.58].map((k, i) => `<path d="M${f(x - w * (0.3 + i * 0.12))} ${f(y - h + k * h + h * 0.2)}q${f(w * (0.3 + i * 0.12))} ${f(-h * 0.06)} ${f(w * (0.6 + i * 0.24))} 0" fill="none" stroke="${K.snow}" stroke-width="4" stroke-linecap="round"/>`).join('');
  const balls = [[-0.3, 0.55, K.red], [0.25, 0.75, K.gold], [-0.15, 0.95, K.gold], [0.35, 0.33, K.red]].map(([dx, dy, c]) => `<circle cx="${f(x + dx * w)}" cy="${f(y - h + dy * h * 0.95)}" r="4" fill="${c}" ${line(1.5)}/>`).join('');
  return `<g><rect x="${f(x - 7)}" y="${f(y - h * 0.1)}" width="14" height="${f(h * 0.12)}" fill="${K.wood}" ${line(3)}/>${tiers}${snow}${balls}<path d="M${x} ${f(y - h - 14)}l3.5 7.5 8 1-6 5.5 1.6 8-7.1-4-7.1 4 1.6-8-6-5.5 8-1Z" fill="${K.gold}" ${line(2)}/></g>`;
}

function bonfire(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-26 -4L26 -18M-26 -18L26 -4" stroke="${K.wood}" stroke-width="9" stroke-linecap="round"/><path d="M-26 -4L26 -18M-26 -18L26 -4" fill="none" stroke="${INK}" stroke-width="2" opacity=".5"/><path class="flame" d="M0 -66C14 -48 20 -38 18 -26 16 -14 8 -10 0 -10S-16 -14-18 -26C-20 -38-12 -46-6 -54-4 -44 0 -42 0 -42 4 -50 2 -58 0 -66Z" fill="${K.gold}" stroke="${K.goldDeep}" stroke-width="3"/><path d="M0 -40C6 -32 8 -26 6 -20S-6 -14-6 -20C-8 -26-4 -32 0 -40Z" fill="#fff1c6"/></g>`;
}

function flags(x1, y1, x2, y2, sag, colors, size = 20) {
  const n = Math.max(4, Math.round(Math.hypot(x2 - x1, y2 - y1) / (size * 1.5)));
  let out = `<path d="M${x1} ${y1}Q${f((x1 + x2) / 2)} ${f((y1 + y2) / 2 + sag * 2)} ${x2} ${y2}" fill="none" stroke="${INK}" stroke-width="2"/>`;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const mx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * ((x1 + x2) / 2) + t * t * x2;
    const my = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * ((y1 + y2) / 2 + sag * 2) + t * t * y2;
    out += `<path d="M${f(mx - size / 2)} ${f(my)}H${f(mx + size / 2)}L${f(mx)} ${f(my + size * 1.1)}Z" fill="${colors[i % colors.length]}" ${line(1.8)}/>`;
  }
  return out;
}

function burst(x, y, r, color, rays = 12) {
  let d = '';
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    d += `M${f(x + Math.cos(a) * r * 0.35)} ${f(y + Math.sin(a) * r * 0.35)}L${f(x + Math.cos(a) * r)} ${f(y + Math.sin(a) * r)}`;
  }
  const dots = Array.from({ length: rays }, (_, i) => {
    const a = ((i + 0.5) / rays) * Math.PI * 2;
    return `<circle cx="${f(x + Math.cos(a) * r * 0.8)}" cy="${f(y + Math.sin(a) * r * 0.8)}" r="${f(r / 22 + 1)}" fill="${color}"/>`;
  }).join('');
  return `<g class="tw"><path d="${d}" stroke="${color}" stroke-width="${f(r / 18 + 1.5)}" stroke-linecap="round"/>${dots}</g>`;
}

function confetti(x, y, w, h, seed, colors, n = 18) {
  let s = seed;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  let out = '';
  for (let i = 0; i < n; i++) {
    const cx = f(x + r() * w);
    const cy = f(y + r() * h);
    out += i % 3 ? `<rect x="${cx}" y="${cy}" width="7" height="3.5" rx="1" transform="rotate(${Math.round(r() * 180)} ${cx} ${cy})" fill="${colors[i % colors.length]}"/>` : `<circle cx="${cx}" cy="${cy}" r="2.6" fill="${colors[i % colors.length]}"/>`;
  }
  return `<g>${out}</g>`;
}

// ---------- Costumes, in mascot coordinates (256 by 256, feet at 128, 246) ----------
// `head` dresses the head and wings; `ground` sits by the feet and is only
// drawn on the standalone Hoot (the hero has its own ground props).

const COSTUMES = {
  newyear: {
    head: `<g transform="rotate(-7 128 62)"><path d="M100 70L130 -8L158 70Z" fill="${K.purple}" ${line(4)}/><path d="M108 50l30-14M114 32l20-9M104 64l46-20" stroke="${K.gold}" stroke-width="5" stroke-linecap="round"/><circle cx="130" cy="-10" r="9" fill="${K.gold}" ${line(3)}/><path d="M96 70q32 8 66 0" fill="none" stroke="${K.gold}" stroke-width="6" stroke-linecap="round"/></g>
<path d="M196 196L226 118" stroke="${K.wood}" stroke-width="5" stroke-linecap="round"/>${burst(228, 112, 22, K.gold, 10)}`,
    ground: confetti(20, 200, 216, 50, 7, [K.gold, K.purple, K.sky, K.pink], 14),
  },
  carnival: {
    head: `<path fill-rule="evenodd" d="M60 120C66 98 92 96 128 108 164 96 190 98 196 120 200 140 184 158 160 156 146 155 136 146 128 140 120 146 110 155 96 156 72 158 56 140 60 120ZM99 105a23 23 0 1 0 .1 0ZM157 105a23 23 0 1 0 .1 0Z" fill="${K.purple}" ${line(4)}/>
<path d="M62 118C74 104 96 104 128 112 160 104 182 104 194 118" fill="none" stroke="${K.gold}" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>
<path d="M188 112C204 92 214 62 210 30 222 52 222 86 196 116Z" fill="${K.pink}" ${line(3)}/><path d="M200 104C208 84 212 64 210 40" fill="none" stroke="${INK}" stroke-width="2"/>
${confetti(40, 0, 180, 60, 3, [K.gold, K.pink, K.mint, K.sky], 12)}`,
    ground: confetti(30, 210, 200, 36, 11, [K.gold, K.pink, K.mint, K.purple], 12),
  },
  easter: {
    head: `<g transform="rotate(-7 128 62)"><ellipse cx="102" cy="8" rx="15" ry="42" transform="rotate(-14 102 8)" fill="${K.snow}" ${line(4)}/><ellipse cx="102" cy="12" rx="6" ry="28" transform="rotate(-14 102 12)" fill="${K.pink}"/><ellipse cx="154" cy="8" rx="15" ry="42" transform="rotate(14 154 8)" fill="${K.snow}" ${line(4)}/><ellipse cx="154" cy="12" rx="6" ry="28" transform="rotate(14 154 12)" fill="${K.pink}"/><path d="M84 50Q128 30 172 50" fill="none" stroke="${K.pink}" stroke-width="7" stroke-linecap="round"/></g>`,
    ground: `<g><path d="M178 222h52l-6 24h-40Z" fill="${K.straw}" ${line(3)}/><path d="M182 222q22-40 44 0" fill="none" stroke="${K.strawDeep}" stroke-width="5" stroke-linecap="round"/>${egg(192, 216, 10, K.mint, K.gold)}${egg(206, 212, 11, K.lilac, K.snow)}${egg(220, 217, 9, K.pink, K.snow)}<path d="M180 232h48M182 240h44" stroke="${K.strawDeep}" stroke-width="2"/></g>`,
  },
  valentine: {
    head: `<circle cx="80" cy="150" r="10" fill="${K.pink}" opacity=".55"/><circle cx="176" cy="150" r="10" fill="${K.pink}" opacity=".55"/>
<path d="M196 198C214 160 206 110 224 64" fill="none" stroke="${INK}" stroke-width="2.5"/>${heart(224, 36, 2.6, K.rose)}<path d="M212 26q4-8 12-6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
    ground: `${heart(46, 226, 1, K.pink)}${heart(214, 232, 0.8, K.rose)}`,
  },
  junina: {
    head: `<g transform="rotate(-7 128 62)"><ellipse cx="128" cy="74" rx="96" ry="17" fill="${K.straw}" ${line(4)}/><path d="M88 74C88 30 168 30 168 74Z" fill="${K.straw}" ${line(4)}/><path d="M89 62C110 56 146 56 167 62L168 72C146 66 110 66 88 72Z" fill="${K.red}"/><path d="M98 44l-6 12M118 36l-3 16M140 36l2 16M158 44l6 12M48 80l14-4M208 80l-14-4M70 86l12-6M186 86l-12-6" stroke="${K.strawDeep}" stroke-width="2.5" stroke-linecap="round"/><rect x="126" y="40" width="14" height="12" fill="${K.sky}" ${line(2)} transform="rotate(8 133 46)"/></g>
<path d="M78 162l10 6M84 156l2 12M176 162l-10 6M170 156l-2 12" stroke="${K.wood}" stroke-width="2" stroke-linecap="round" opacity=".7"/>`,
    ground: bonfire(44, 246, 0.7),
  },
  halloween: {
    head: `<g transform="rotate(-7 128 62)"><path d="M80 74C96 60 104 40 112 18 120 -2 136 -16 160 -22 148 -8 146 10 150 30 154 50 164 62 176 74Z" fill="${K.witch}" ${line(4)}/><path d="M92 64Q128 72 166 64L170 74Q128 82 88 74Z" fill="${K.pumpkin}"/><ellipse cx="128" cy="78" rx="80" ry="12" fill="${K.witch}" ${line(4)}/><path d="M118 70l5-8 5 8" fill="none" stroke="${K.gold}" stroke-width="3"/></g>`,
    ground: pumpkin(206, 226, 18),
  },
  christmas: {
    head: `<g transform="rotate(-7 128 62)"><path d="M82 76C80 36 112 22 140 24 168 26 186 46 174 76Z" fill="${K.red}" ${line(4)}/><path d="M140 26C160 20 178 28 190 46" fill="none" stroke="${K.red}" stroke-width="16" stroke-linecap="round"/><circle cx="194" cy="52" r="12" fill="${K.snow}" ${line(3)}/><rect x="76" y="64" width="106" height="18" rx="9" fill="${K.snow}" ${line(4)}/></g>
<path d="M68 156Q128 180 188 156L190 172Q128 198 66 172Z" fill="${K.pine}" ${line(3)}/><path d="M84 162l-2 14M104 168l-2 14M152 168l2 14M172 162l2 14" stroke="${K.snow}" stroke-width="3" stroke-linecap="round"/><path d="M160 176l8 44 20-4-10-42Z" fill="${K.pine}" ${line(3)}/><path d="M166 200l18-3M168 210l18-3" stroke="${K.snow}" stroke-width="3"/>`,
    ground: `<g fill="${K.snow}" opacity=".9"><circle cx="40" cy="60" r="4"/><circle cx="222" cy="100" r="3"/><circle cx="30" cy="150" r="3"/><circle cx="226" cy="170" r="4"/><circle cx="60" cy="20" r="2.5"/></g>`,
  },
};

// At night the costume gets the same light rim as Hoot, so a dark hat still reads on a dark sky.
const RIM = `<defs><filter id="rim" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="5" result="d"/><feFlood flood-color="${C.rim}"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
const dressed = (head, theme) => (theme === 'dark' ? `<g filter="url(#rim)">${head}</g>` : head);

/** Hoot in the costume of a season, as a standalone SVG file. */
export function seasonHoot(id, theme) {
  const body = mascot({ rim: theme === 'dark', id: `sh-${id}-${theme[0]}` })
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/<title[^>]*>[^<]*<\/title>/, '');
  const c = COSTUMES[id];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -32 256 288" width="256" height="288" aria-hidden="true">${theme === 'dark' ? RIM : ''}${body}${c.ground}${dressed(c.head, theme)}</svg>\n`;
}

// ---------- Icons (24 by 24, the storybook style: tint plus a 2px line) ----------

const ICONS = {
  newyear: {
    firework: { t: '<circle cx="12" cy="10" r="3"/>', l: '<path d="M12 3v3M12 14v3M5 10h3M16 10h3M7 5l2 2M15 13l2 2M17 5l-2 2M9 13l-2 2M12 17v4"/>' },
    'party-hat': { t: '<path d="M12 3l6 17H6Z"/>', l: '<path d="M12 3l6 17H6Z"/><path d="M8.6 13l6-3M7.4 17l9-4.3"/><circle cx="12" cy="2.5" r="1.2"/>' },
    clock: { t: '<circle cx="12" cy="13" r="5"/>', l: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4h3.5M9 3h6"/>' },
  },
  carnival: {
    mask: { t: '<path d="M3.5 9c3-2 6-1 8.5.5C14.5 8 17.5 7 20.5 9c0 4-2.5 6.5-5 6-1.6-.3-2.6-1.6-3.5-2.6-.9 1-1.9 2.3-3.5 2.6-2.5.5-5-2-5-6Z"/>', l: '<path d="M3.5 9c3-2 6-1 8.5.5C14.5 8 17.5 7 20.5 9c0 4-2.5 6.5-5 6-1.6-.3-2.6-1.6-3.5-2.6-.9 1-1.9 2.3-3.5 2.6-2.5.5-5-2-5-6Z"/><circle cx="8" cy="11" r="1.6"/><circle cx="16" cy="11" r="1.6"/><path d="M20 9c1.5-2 1.5-4.5.5-6"/>' },
    popper: { t: '<path d="M4 20l4-11 7 7Z"/>', l: '<path d="M4 20l4-11 7 7Z"/><path d="M13 5.5l1-2.5M17 9l3-1M15.5 7l2.5-2.5M19.5 13l1.5.5M10 4h.01M20 4h.01M21 10h.01"/>' },
    streamer: { t: '<path d="M4 6c4 0 4 4 8 4s4-4 8-4v3c-4 0-4 4-8 4S8 9 4 9Z"/>', l: '<path d="M4 6c4 0 4 4 8 4s4-4 8-4M4 13c4 0 4 4 8 4s4-4 8-4"/><path d="M6 20h.01M12 21h.01M18 20h.01"/>' },
  },
  easter: {
    egg: { t: '<path d="M12 3c3.5 0 6.5 6 6.5 10.5S15.5 21 12 21s-6.5-3-6.5-7.5S8.5 3 12 3Z"/>', l: '<path d="M12 3c3.5 0 6.5 6 6.5 10.5S15.5 21 12 21s-6.5-3-6.5-7.5S8.5 3 12 3Z"/><path d="M6 12.5l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5"/>' },
    basket: { t: '<path d="M4 12h16l-2 8H6Z"/>', l: '<path d="M4 12h16l-2 8H6Z"/><path d="M7 12a5 6 0 0 1 10 0M8 16h8"/>' },
    bunny: { t: '<circle cx="12" cy="15" r="5"/>', l: '<circle cx="12" cy="15" r="5.5"/><path d="M9.5 10C8 7 8.5 3 9.5 3S11 6 11 9.6M14.5 10c1.5-3 1-7 0-7S13 6 13 9.6"/><path d="M10.5 15h.01M13.5 15h.01M11.5 17h1"/>' },
  },
  valentine: {
    heart: { t: '<path d="M12 20C6 15.5 3 12.5 3 9a4.5 4.5 0 0 1 9-1.5A4.5 4.5 0 0 1 21 9c0 3.5-3 6.5-9 11Z"/>', l: '<path d="M12 20C6 15.5 3 12.5 3 9a4.5 4.5 0 0 1 9-1.5A4.5 4.5 0 0 1 21 9c0 3.5-3 6.5-9 11Z"/>' },
    letter: { t: '<path d="M12 15.5c-2-1.6-3-2.6-3-3.8a1.5 1.5 0 0 1 3-.5 1.5 1.5 0 0 1 3 .5c0 1.2-1 2.2-3 3.8Z"/>', l: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/>' },
    balloon: { t: '<path d="M12 3c3 0 5 2 5 4.6S14.5 13 12 14.5C9.5 13 7 10.2 7 7.6S9 3 12 3Z"/>', l: '<path d="M12 3c3 0 5 2 5 4.6S14.5 13 12 14.5C9.5 13 7 10.2 7 7.6S9 3 12 3Z"/><path d="M12 14.5c-1.5 2 1.5 3.5 0 6.5"/>' },
  },
  junina: {
    'straw-hat': { t: '<path d="M7.5 13C7.5 7.5 16.5 7.5 16.5 13Z"/>', l: '<path d="M7.5 13C7.5 7.5 16.5 7.5 16.5 13"/><ellipse cx="12" cy="14" rx="10" ry="3"/><path d="M8 11.5h8"/>' },
    bonfire: { t: '<path d="M12 4c3 3 4 5.5 4 8a4 4 0 0 1-8 0c0-2.5 1-5 4-8Z"/>', l: '<path d="M12 4c3 3 4 5.5 4 8a4 4 0 0 1-8 0c0-2.5 1-5 4-8Z"/><path d="M4 21l16-4M4 17l16 4"/>' },
    flags: { t: '<path d="M6 7.5h5l-2.5 5Z"/>', l: '<path d="M2.5 5.5Q12 10 21.5 5.5"/><path d="M6 7.5h5l-2.5 5ZM13 7.5h5l-2.5 5Z"/><path d="M5 19h14"/>' },
  },
  halloween: {
    pumpkin: { t: '<ellipse cx="12" cy="14" rx="5" ry="6"/>', l: '<ellipse cx="9" cy="14" rx="5" ry="6"/><ellipse cx="15" cy="14" rx="5" ry="6"/><path d="M12 8c0-2 1-3.5 3-4"/>' },
    bat: { t: '<ellipse cx="12" cy="12.5" rx="2" ry="3"/>', l: '<path d="M12 9.5c-2-3-6-4-9.5-2.5 2 1 2.5 3 2 5 1.5-1 3-1 4 .5 1-1.5 2.5-1.5 3.5-.5 1-1 2.5-1 3.5.5 1-1.5 2.5-1.5 4-.5-.5-2 0-4 2-5-3.5-1.5-7.5-.5-9.5 2.5Z"/>' },
    'witch-hat': { t: '<path d="M8 17c2-5 3-11 8-14-1 4 0 9 1 14Z"/>', l: '<path d="M8 17c2-5 3-11 8-14-1 4 0 9 1 14"/><ellipse cx="12" cy="18" rx="9.5" ry="2.5"/><path d="M8.5 15h9"/>' },
  },
  christmas: {
    snowflake: { t: '<circle cx="12" cy="12" r="2.5"/>', l: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>' },
    gift: { t: '<rect x="4" y="9" width="16" height="4"/>', l: '<rect x="4" y="9" width="16" height="4" rx="1"/><path d="M5.5 13v7.5h13V13M12 9v11.5M12 9C10 5 6.5 5 7.5 7.5 8 9 12 9 12 9Zm0 0c2-4 5.5-4 4.5-1.5C16 9 12 9 12 9Z"/>' },
    tree: { t: '<path d="M12 3l6 9h-3l4 6H5l4-6H6Z"/>', l: '<path d="M12 3l6 9h-3l4 6H5l4-6H6Z"/><path d="M12 18v3"/>' },
  },
};

export const SEASON_ICONS = Object.fromEntries(SEASONS.map((id) => [id, Object.keys(ICONS[id])]));

/** One seasonal icon as a standalone SVG file, in the storybook icon style. */
export function seasonIcon(id, name, theme) {
  const ink = theme === 'dark' ? '#efe6cf' : C.ink;
  const { t, l } = ICONS[id][name];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" aria-hidden="true"><g fill="${C.amber}" transform="translate(.8 .8)">${t}</g><g fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${l}</g></svg>\n`;
}

// ---------- Hero accents, in the coordinates of the hero art layer (1000 by 760) ----------

const G = 664;
// Where Hoot sits on the lantern post: hoot(P, 566, 366, 0.64) in heroLayers.
const HOOT = `translate(${f(566 - 128 * 0.64)} ${f(366 - 246 * 0.64)}) scale(.64)`;

const ACCENTS = {
  newyear: (P) => `${burst(250, 170, 46, K.gold)}${burst(380, 110, 30, K.pink)}${burst(150, 270, 26, K.sky)}${burst(940, 90, 34, K.lilac)}${confetti(220, 560, 260, 60, 5, [K.gold, K.pink, K.sky, P.line], 16)}`,
  carnival: (P) => `${flags(240, 470, 560, 380, 40, [K.pink, K.gold, K.mint, K.purple], 18)}${flags(580, 380, 880, 440, 30, [K.gold, K.purple, K.pink, K.mint], 18)}${confetti(200, 520, 700, 120, 9, [K.gold, K.pink, K.mint, K.sky, P.line], 26)}`,
  easter: () => `${egg(232, G + 6, 13, K.mint, K.gold)}${egg(262, G + 10, 11, K.lilac, K.snow)}${egg(500, G + 10, 12, K.pink, K.snow)}${egg(612, G + 18, 11, K.sky, K.gold)}${egg(884, G + 40, 12, K.gold, K.snow)}<g fill="${K.pink}">${[[214, G - 2], [520, G + 2], [900, G + 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/><circle cx="${x + 8}" cy="${y - 4}" r="3.5"/><circle cx="${x + 15}" cy="${y + 1}" r="4"/>`).join('')}</g>`,
  valentine: () => `${heart(690, 120, 1.4, K.rose)}${heart(820, 200, 1, K.pink)}${heart(320, 180, 1.2, K.pink)}${heart(420, 110, 0.8, K.rose)}${flags(240, 480, 560, 400, 30, [K.pink, K.rose, K.snow], 16)}`,
  junina: () => `${flags(200, 420, 560, 360, 46, [K.red, K.gold, K.sky, K.mint, K.pink], 20)}${flags(580, 360, 880, 420, 34, [K.gold, K.red, K.mint, K.sky], 20)}${bonfire(470, G + 30, 1)}`,
  halloween: (P) => `${pumpkin(228, G + 2, 20)}${pumpkin(492, G + 18, 16)}${pumpkin(886, G + 46, 18, false)}${bat(700, 112, 2.2, P.ink)}${bat(830, 190, 1.5, P.ink)}${bat(330, 150, 1.7, P.ink)}`,
  christmas: () => `${pine(214, G + 8, 120)}<g fill="${K.snow}">${[[300, 120], [420, 220], [700, 80], [880, 260], [180, 330], [960, 150], [520, 300]].map(([x, y], i) => `<circle class="tw tw-${i % 3}" cx="${x}" cy="${y}" r="${3 + (i % 3)}"/>`).join('')}</g><path d="M650 ${G - 190}q105 38 210 0" fill="none" stroke="${INK}" stroke-width="2"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle class="tw tw-${i % 3}" cx="${f(668 + i * 29)}" cy="${f(G - 190 + 26 * Math.sin((i / 6) * Math.PI) + 6)}" r="5" fill="${[K.red, K.gold, K.pine, K.sky][i % 4]}"/>`).join('')}`,
};

/** The hero accent of a season: props over the town and Hoot's costume, aligned with the hero art layer. */
export function seasonHero(id, P, theme = 'light') {
  const c = COSTUMES[id];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 760" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">${theme === 'dark' ? RIM : ''}${ACCENTS[id](P)}<g transform="${HOOT}">${dressed(c.head, theme)}</g></svg>\n`;
}

/** Every seasonal file, keyed by its path under assets/seasons/. */
export function seasonFiles(palettes) {
  const files = {};
  for (const id of SEASONS) {
    for (const [theme, P] of palettes) {
      files[`${id}/hoot-${theme}.svg`] = seasonHoot(id, theme);
      files[`${id}/hero-${theme}.svg`] = seasonHero(id, P, theme);
      for (const name of SEASON_ICONS[id]) files[`${id}/icon-${name}-${theme}.svg`] = seasonIcon(id, name, theme);
    }
  }
  return files;
}
