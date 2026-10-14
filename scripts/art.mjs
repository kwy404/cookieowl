// Hoot, the cookieowl mascot, and the rest of the art, as SVG strings.
// scripts/build-art.mjs writes them to assets/ and docs/assets/.

export const C = {
  navy: '#1b2547',
  navyDeep: '#111833',
  wing: '#2a3972',
  wingLine: '#3d4f92',
  face: '#f8eed8',
  belly: '#f3e2bf',
  bellyLine: '#dcc392',
  amber: '#f2b134',
  amberDeep: '#d98a1c',
  beak: '#ea8f25',
  cookie: '#d99343',
  cookieEdge: '#b06a22',
  chip: '#6b3912',
  white: '#ffffff',
  rim: '#e8edf9',
  ink: '#1b2240',
};

const SILHOUETTE = [
  // body and ear tufts
  'M128 64C182 64 208 106 208 158C208 208 174 240 128 240C82 240 48 208 48 158C48 106 74 64 128 64Z',
  'M74 96L58 50L104 76Z',
  'M182 96L198 50L152 76Z',
  // wings
  'M54 140C34 182 58 226 100 222C112 220 114 206 102 200C82 192 70 172 68 146Z',
  'M202 140C222 182 198 226 156 222C144 220 142 206 154 200C174 192 186 172 188 146Z',
  // cap
  'M84 66C86 34 170 34 172 66L174 80L82 80Z',
];

/** The full mascot. `rim` adds a light outline for dark backgrounds. */
export function mascot({ rim = false, id = 'h' } = {}) {
  const outline = rim
    ? `<g fill="${C.rim}" stroke="${C.rim}" stroke-width="12" stroke-linejoin="round">${SILHOUETTE.map((d) => `<path d="${d}"/>`).join('')}<circle cx="128" cy="204" r="34"/></g>`
    : `<ellipse cx="128" cy="244" rx="64" ry="7" fill="${C.navy}" opacity=".14"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="${id}-t">
<title id="${id}-t">Hoot, the cookieowl mascot: an owl in a guard cap holding a cookie</title>
<defs>
<mask id="${id}-bite"><rect width="256" height="256" fill="#fff"/><circle cx="150" cy="174" r="10" fill="#000"/><circle cx="160" cy="182" r="8" fill="#000"/></mask>
<linearGradient id="${id}-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26336a"/><stop offset="1" stop-color="${C.navy}"/></linearGradient>
</defs>
${outline}
<path d="${SILHOUETTE[1]}" fill="${C.navy}"/>
<path d="${SILHOUETTE[2]}" fill="${C.navy}"/>
<path d="${SILHOUETTE[0]}" fill="url(#${id}-body)"/>
<ellipse cx="128" cy="186" rx="54" ry="50" fill="${C.belly}"/>
<g fill="none" stroke="${C.bellyLine}" stroke-width="3" stroke-linecap="round"><path d="M106 162l6 6 6-6M138 162l6 6 6-6M122 176l6 6 6-6"/></g>
<circle cx="99" cy="126" r="35" fill="${C.face}"/>
<circle cx="157" cy="126" r="35" fill="${C.face}"/>
<path d="M76 102C88 94 104 94 114 102" fill="none" stroke="${C.navy}" stroke-width="5" stroke-linecap="round"/>
<path d="M142 102C152 94 168 94 180 102" fill="none" stroke="${C.navy}" stroke-width="5" stroke-linecap="round"/>
<circle cx="99" cy="128" r="23" fill="${C.amber}"/>
<circle cx="157" cy="128" r="23" fill="${C.amber}"/>
<circle cx="99" cy="128" r="23" fill="none" stroke="${C.amberDeep}" stroke-width="3"/>
<circle cx="157" cy="128" r="23" fill="none" stroke="${C.amberDeep}" stroke-width="3"/>
<circle cx="102" cy="131" r="13" fill="${C.navyDeep}"/>
<circle cx="154" cy="131" r="13" fill="${C.navyDeep}"/>
<circle cx="108" cy="124" r="5" fill="${C.white}"/>
<circle cx="160" cy="124" r="5" fill="${C.white}"/>
<circle cx="98" cy="137" r="2.2" fill="${C.white}" opacity=".8"/>
<circle cx="150" cy="137" r="2.2" fill="${C.white}" opacity=".8"/>
<path d="M119 150Q128 146 137 150L128 166Z" fill="${C.beak}"/>
<g mask="url(#${id}-bite)">
<circle cx="128" cy="204" r="32" fill="${C.cookie}"/>
<circle cx="128" cy="204" r="32" fill="none" stroke="${C.cookieEdge}" stroke-width="3"/>
<circle cx="128" cy="204" r="25" fill="none" stroke="#e7a95a" stroke-width="2" stroke-dasharray="3 7" opacity=".9"/>
<ellipse cx="114" cy="192" rx="5" ry="4" fill="${C.chip}"/>
<ellipse cx="134" cy="200" rx="4" ry="3.4" fill="${C.chip}"/>
<ellipse cx="118" cy="214" rx="4.6" ry="3.6" fill="${C.chip}"/>
<ellipse cx="140" cy="220" rx="4" ry="3.2" fill="${C.chip}"/>
<ellipse cx="104" cy="206" rx="3.2" ry="2.6" fill="${C.chip}"/>
</g>
<path d="${SILHOUETTE[3]}" fill="${C.wing}"/>
<path d="${SILHOUETTE[4]}" fill="${C.wing}"/>
<g fill="none" stroke="${C.wingLine}" stroke-width="3" stroke-linecap="round"><path d="M64 168C70 186 80 198 94 204M60 186C68 200 78 210 92 214"/><path d="M192 168C186 186 176 198 162 204M196 186C188 200 178 210 164 214"/></g>
<g fill="${C.amber}"><path d="M104 236q-6 6-2 8q4 0 6-4q2 4 6 4q4-2-2-8Z"/><path d="M140 236q-6 6-2 8q4 0 6-4q2 4 6 4q4-2-2-8Z"/></g>
<g transform="rotate(-7 128 62)">
<path d="${SILHOUETTE[5]}" fill="${C.navyDeep}"/>
<rect x="84" y="62" width="88" height="10" rx="2" fill="${C.amber}"/>
<path d="M80 74Q128 98 178 74L176 70Q128 88 82 70Z" fill="#0a0f22"/>
<path d="M118 40h20v10c0 8-10 13-10 13s-10-5-10-13Z" fill="${C.amber}" stroke="${C.amberDeep}" stroke-width="2"/>
<path d="M128 44l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7Z" fill="${C.navyDeep}"/>
</g>
</svg>
`;
}

/** Just the head with the cap, for the favicon and small marks. */
export function head({ rim = false, id = 'hh', title = 'Hoot, the cookieowl owl' } = {}) {
  const outline = rim ? `<g fill="${C.rim}" stroke="${C.rim}" stroke-width="10" stroke-linejoin="round"><path d="M40 70L26 22L74 50Z"/><path d="M216 70L230 22L182 50Z"/><circle cx="128" cy="138" r="98"/><path d="M60 48C62 8 194 8 196 48L198 62L58 62Z"/></g>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="${id}-t">
<title id="${id}-t">${title}</title>
${outline}
<path d="M40 70L26 22L74 50Z" fill="${C.navy}"/>
<path d="M216 70L230 22L182 50Z" fill="${C.navy}"/>
<circle cx="128" cy="138" r="98" fill="${C.navy}"/>
<circle cx="88" cy="140" r="50" fill="${C.face}"/>
<circle cx="168" cy="140" r="50" fill="${C.face}"/>
<circle cx="88" cy="142" r="34" fill="${C.amber}"/>
<circle cx="168" cy="142" r="34" fill="${C.amber}"/>
<circle cx="92" cy="146" r="19" fill="${C.navyDeep}"/>
<circle cx="164" cy="146" r="19" fill="${C.navyDeep}"/>
<circle cx="100" cy="135" r="7" fill="${C.white}"/>
<circle cx="172" cy="135" r="7" fill="${C.white}"/>
<path d="M114 186Q128 180 142 186L128 210Z" fill="${C.beak}"/>
<g transform="rotate(-6 128 46)">
<path d="M60 48C62 8 194 8 196 48L198 62L58 62Z" fill="${C.navyDeep}"/>
<rect x="60" y="44" width="136" height="13" rx="3" fill="${C.amber}"/>
<path d="M54 58Q128 92 202 58L198 54Q128 80 58 54Z" fill="#0a0f22"/>
<path d="M114 12h28v14c0 11-14 18-14 18s-14-7-14-18Z" fill="${C.amber}"/>
</g>
</svg>
`;
}

/** A compact favicon: the owl head on a rounded navy tile. */
export function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect width="64" height="64" rx="14" fill="${C.navyDeep}"/>
<path d="M12 22L9 8L22 16Z" fill="#2b3a72"/>
<path d="M52 22L55 8L42 16Z" fill="#2b3a72"/>
<circle cx="32" cy="36" r="24" fill="#2b3a72"/>
<circle cx="22" cy="36" r="12" fill="${C.face}"/>
<circle cx="42" cy="36" r="12" fill="${C.face}"/>
<circle cx="22" cy="37" r="8.5" fill="${C.amber}"/>
<circle cx="42" cy="37" r="8.5" fill="${C.amber}"/>
<circle cx="23" cy="38" r="4.6" fill="${C.navyDeep}"/>
<circle cx="41" cy="38" r="4.6" fill="${C.navyDeep}"/>
<circle cx="25" cy="35.5" r="1.8" fill="#fff"/>
<circle cx="43" cy="35.5" r="1.8" fill="#fff"/>
<path d="M28.5 47Q32 45.5 35.5 47L32 53Z" fill="${C.beak}"/>
<path d="M15 18C16 6 48 6 49 18L50 22L14 22Z" fill="${C.amber}"/>
<path d="M12 22.5Q32 31 52 22.5L51 21Q32 27 13 21Z" fill="#0a0f22"/>
</svg>
`;
}

// ---------- Icons ----------
// 48 by 48, two tones: a line color (navy in light, pale in dark) and amber.

const ICONS = {
  block: (l, a) => `<path d="M24 5l15 6v11c0 10-6.5 17-15 21C15.5 39 9 32 9 22V11Z" fill="none" stroke="${l}" stroke-width="3" stroke-linejoin="round"/><rect x="17" y="21" width="14" height="11" rx="2.5" fill="${a}"/><path d="M19.5 21v-3a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="${l}" stroke-width="3"/>`,
  'auto-block': (l, a) => `<circle cx="21" cy="21" r="12" fill="none" stroke="${l}" stroke-width="3"/><path d="M30 30l10 10" stroke="${l}" stroke-width="3.5" stroke-linecap="round"/><path d="M15 21h12" stroke="${a}" stroke-width="3.5" stroke-linecap="round"/>`,
  'consent-mode': (l, a) => `<rect x="6" y="9" width="26" height="12" rx="6" fill="none" stroke="${l}" stroke-width="3"/><circle cx="26" cy="15" r="4" fill="${a}"/><rect x="16" y="27" width="26" height="12" rx="6" fill="none" stroke="${l}" stroke-width="3"/><circle cx="22" cy="33" r="4" fill="${l}"/>`,
  categories: (l, a) => `<path d="M24 6l18 9-18 9-18-9Z" fill="${a}" stroke="${l}" stroke-width="3" stroke-linejoin="round"/><path d="M6 24l18 9 18-9M6 33l18 9 18-9" fill="none" stroke="${l}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`,
  languages: (l, a) => `<circle cx="24" cy="24" r="17" fill="none" stroke="${l}" stroke-width="3"/><path d="M7 24h34M24 7c-6 6-6 28 0 34M24 7c6 6 6 28 0 34" fill="none" stroke="${l}" stroke-width="2.5"/><circle cx="35" cy="13" r="6" fill="${a}"/>`,
  accessibility: (l, a) => `<circle cx="24" cy="24" r="18" fill="none" stroke="${l}" stroke-width="3"/><circle cx="24" cy="14" r="3.5" fill="${a}"/><path d="M14 20l10 2 10-2M24 22v8l-5 9M24 30l5 9" fill="none" stroke="${l}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  lightweight: (l, a) => `<path d="M38 8C22 8 12 18 12 34l-4 6" fill="none" stroke="${l}" stroke-width="3" stroke-linecap="round"/><path d="M38 8C38 26 28 36 12 34C14 22 22 12 38 8Z" fill="${a}" stroke="${l}" stroke-width="3" stroke-linejoin="round"/><path d="M18 30l10-10" stroke="${l}" stroke-width="2.5" stroke-linecap="round"/>`,
  frameworks: (l, a) => `<path d="M10 14h10a4 4 0 1 1 8 0h10v10a4 4 0 1 0 0 8v8H10Z" fill="none" stroke="${l}" stroke-width="3" stroke-linejoin="round"/><circle cx="19" cy="29" r="5" fill="${a}"/>`,
  'audit-log': (l, a) => `<rect x="10" y="8" width="28" height="34" rx="4" fill="none" stroke="${l}" stroke-width="3"/><rect x="18" y="5" width="12" height="7" rx="2" fill="${a}" stroke="${l}" stroke-width="2.5"/><path d="M16 22h16M16 29h16M16 36h9" stroke="${l}" stroke-width="3" stroke-linecap="round"/>`,
  'privacy-signal': (l, a) => `<path d="M14 26V14a3 3 0 0 1 6 0v10M20 22V10a3 3 0 0 1 6 0v12M26 22V12a3 3 0 0 1 6 0v12M32 24v-6a3 3 0 0 1 6 0v10c0 9-6 15-14 15s-11-4-15-11l-3-6a3 3 0 0 1 5-3l3 4" fill="none" stroke="${l}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="38" cy="9" r="5" fill="${a}"/>`,
  embed: (l, a) => `<rect x="5" y="10" width="38" height="28" rx="5" fill="none" stroke="${l}" stroke-width="3"/><path d="M20 17l11 7-11 7Z" fill="${a}"/><path d="M5 31h38" stroke="${l}" stroke-width="2" stroke-dasharray="3 3"/>`,
  reopen: (l, a) => `<circle cx="24" cy="24" r="17" fill="none" stroke="${l}" stroke-width="3"/><circle cx="18" cy="23" r="5" fill="${a}"/><circle cx="30" cy="23" r="5" fill="${a}"/><circle cx="18" cy="23" r="2" fill="${l}"/><circle cx="30" cy="23" r="2" fill="${l}"/><path d="M22 31l2 3 2-3Z" fill="${a}"/>`,
  'dark-mode': (l, a) => `<path d="M30 7a17 17 0 1 0 11 27A14 14 0 0 1 30 7Z" fill="none" stroke="${l}" stroke-width="3" stroke-linejoin="round"/><circle cx="36" cy="13" r="2.5" fill="${a}"/><circle cx="41" cy="22" r="1.8" fill="${a}"/>`,
  cookie: (l, a) => `<path d="M40 22a6 6 0 0 1-8-7 6 6 0 0 1-6-8A17 17 0 1 0 40 22Z" fill="${a}" stroke="${l}" stroke-width="3" stroke-linejoin="round"/><circle cx="18" cy="22" r="2.6" fill="${l}"/><circle cx="25" cy="31" r="2.6" fill="${l}"/><circle cx="16" cy="32" r="2" fill="${l}"/>`,
};

export const ICON_NAMES = Object.keys(ICONS);

export function iconSvg(name, theme) {
  const line = theme === 'dark' ? '#e3e8f7' : C.ink;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">${ICONS[name](line, C.amber)}</svg>\n`;
}

/** The icon paths alone, for an inline sprite that follows currentColor. */
export function iconSymbol(name) {
  return `<symbol id="ic-${name}" viewBox="0 0 48 48">${ICONS[name]('currentColor', 'var(--ic-accent, #f2b134)')}</symbol>`;
}

// ---------- Banner ----------

function stars(seed, n, w, h, color) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = (rnd() * w).toFixed(1);
    const y = (rnd() * h).toFixed(1);
    const r = (0.6 + rnd() * 1.6).toFixed(2);
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${(0.35 + rnd() * 0.6).toFixed(2)}"/>`;
  }
  return out;
}

export function banner(theme) {
  const dark = theme === 'dark';
  const bg = dark ? ['#0b1027', '#1a2350'] : ['#fff8ea', '#eef2fc'];
  const text = dark ? '#f3f5fc' : C.ink;
  const sub = dark ? '#b7c0dc' : '#4d5778';
  const pill = dark ? '#222d5c' : '#ffffff';
  const pillLine = dark ? '#33417a' : '#dfe3ef';
  const inner = mascot({ rim: dark, id: `b${theme[0]}` }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title[^>]*>[^<]*<\/title>/, '');
  const pills = ['One script tag', 'Real blocking', 'Consent Mode v2', 'Under 15 kB'];
  let x = 64;
  const pillSvg = pills
    .map((p) => {
      const w = p.length * 9.4 + 34;
      const g = `<g transform="translate(${x} 262)"><rect width="${w}" height="38" rx="19" fill="${pill}" stroke="${pillLine}"/><circle cx="19" cy="19" r="5" fill="${C.amber}"/><text x="32" y="25" font-size="16" font-weight="600" fill="${text}">${p}</text></g>`;
      x += w + 12;
      return g;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" width="1200" height="360" role="img" aria-labelledby="bn-t">
<title id="bn-t">cookieowl: free cookie consent for LGPD and GDPR that really blocks trackers</title>
<defs><linearGradient id="bn-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient>
<radialGradient id="bn-moon" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="${dark ? '#f7e3ad' : '#f8cf73'}"/><stop offset="1" stop-color="${dark ? '#f7e3ad' : '#f8cf73'}" stop-opacity="0"/></radialGradient></defs>
<clipPath id="bn-clip"><rect width="1200" height="360" rx="28"/></clipPath>
<g clip-path="url(#bn-clip)">
<rect width="1200" height="360" fill="url(#bn-bg)"/>
<g>${stars(7, dark ? 70 : 26, 1200, 360, dark ? '#ffffff' : '#c9a24c')}</g>
<circle cx="1010" cy="150" r="150" fill="url(#bn-moon)" opacity="${dark ? 0.35 : 0.5}"/>
<circle cx="1010" cy="150" r="92" fill="${dark ? '#f6e2a8' : '#fbd982'}" opacity="${dark ? 0.95 : 0.9}"/>
<circle cx="980" cy="120" r="14" fill="${dark ? '#e7cd88' : '#f2c25c'}" opacity=".6"/><circle cx="1040" cy="178" r="10" fill="${dark ? '#e7cd88' : '#f2c25c'}" opacity=".6"/>
<path d="M820 360C860 300 930 286 1010 296C1090 306 1150 330 1200 360Z" fill="${dark ? '#121a3d' : '#f3e2bf'}"/>
<g transform="translate(880 64) scale(1.12)">${inner}</g>
</g>
<g font-family="system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
<text x="64" y="118" font-size="72" font-weight="800" fill="${text}" letter-spacing="-1.5">cookie<tspan fill="${C.amber}">owl</tspan></text>
<text x="66" y="172" font-size="27" font-weight="600" fill="${text}">Cookie consent for LGPD and GDPR</text>
<text x="66" y="210" font-size="21" fill="${sub}">that really blocks trackers until visitors say yes. Free and open source.</text>
${pillSvg}
</g>
</svg>
`;
}
