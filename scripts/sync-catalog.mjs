// Regenerate the DEFAULT_VERSES seed inside neon.js from verses.json.
//
//   npm run sync:catalog
//
// verses.json is the canonical catalog: it is what the service worker syncs
// weekly and what the admin tooling edits. neon.js needs a synchronous seed so
// the very first paint can render a verse without waiting on the network, so it
// carries a copy. This script keeps that copy honest, and test/catalog.test.js
// fails the build if the two ever drift apart again.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const CATALOG = new URL('../verses.json', import.meta.url);
const ENGINE = new URL('../neon.js', import.meta.url);

const q = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

function renderVerse(verse) {
  const lines = verse.lines.map((line) => {
    const parts = [`text: ${q(line.text)}`];
    if (typeof line.width === 'number') parts.push(`width: ${line.width}`);
    if (line.color) parts.push(`color: ${q(line.color)}`);
    return `      { ${parts.join(', ')} },`;
  });
  return [
    '  {',
    `    id: ${q(verse.id)},`,
    `    reference: ${q(verse.reference)},`,
    `    text: ${q(verse.text)},`,
    '    lines: [',
    ...lines,
    '    ],',
    '  },',
  ].join('\n');
}

const payload = JSON.parse(await readFile(CATALOG, 'utf8'));
if (!Array.isArray(payload.verses) || payload.verses.length === 0) {
  throw new Error('verses.json has no verses');
}

const engine = await readFile(ENGINE, 'utf8');
const start = engine.indexOf('const DEFAULT_VERSES = [');
const end = engine.indexOf('\n];', start);
if (start === -1 || end === -1) {
  throw new Error('could not locate the DEFAULT_VERSES block in neon.js');
}

const block = ['const DEFAULT_VERSES = [', ...payload.verses.map(renderVerse), '];'].join('\n');
const next = engine.slice(0, start) + block + engine.slice(end + 3);

if (next === engine) {
  console.log('DEFAULT_VERSES already matches verses.json — nothing to do.');
} else {
  await writeFile(ENGINE, next);
  console.log(`Regenerated DEFAULT_VERSES in neon.js from ${payload.verses.length} verses.`);
}
