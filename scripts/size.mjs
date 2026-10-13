// Prints the gzip and brotli size of the script tag build and fails when the
// gzip size reaches the 15 kB budget.
import { readFileSync } from 'node:fs';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const LIMIT = 15000;
const file = new URL('../dist/cookieowl.js', import.meta.url);
const raw = readFileSync(file);
const gz = gzipSync(raw, { level: 9 }).length;
const br = brotliCompressSync(raw).length;
const kb = (n) => `${(n / 1000).toFixed(2)} kB`;
console.log(`dist/cookieowl.js: ${kb(raw.length)} minified, ${kb(gz)} gzip, ${kb(br)} brotli (budget ${kb(LIMIT)} gzip)`);
if (gz >= LIMIT) {
  console.error(`dist/cookieowl.js is over budget by ${gz - LIMIT} bytes`);
  process.exit(1);
}
