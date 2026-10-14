// Writes the mascot, banners, favicon and icon set to assets/ (and the
// favicon to docs/). Usage: npm run art
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ICON_NAMES, banner, favicon, head, iconSvg, mascot } from './art.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = (rel, content) => {
  const file = join(root, rel);
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, content);
};

out('assets/mascot.svg', mascot());
out('assets/mascot-dark.svg', mascot({ rim: true, id: 'hd' }));
out('assets/mascot-head.svg', head());
out('assets/mascot-head-dark.svg', head({ rim: true, id: 'hhd' }));
out('assets/favicon.svg', favicon());
out('assets/banner.svg', banner('light'));
out('assets/banner-dark.svg', banner('dark'));
for (const name of ICON_NAMES) {
  out(`assets/icons/light/${name}.svg`, iconSvg(name, 'light'));
  out(`assets/icons/dark/${name}.svg`, iconSvg(name, 'dark'));
}
console.log(`wrote mascot, head, favicon, 2 banners and ${ICON_NAMES.length * 2} icons`);
