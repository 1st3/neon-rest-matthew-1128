import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import '../neon.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const { DEFAULT_VERSES } = globalThis.NeonEngine;

const canonical = JSON.parse(await readFile(join(ROOT, 'verses.json'), 'utf8'));

// verses.json is the source of truth. neon.js keeps a synchronous copy so the
// first paint can render without waiting on the network; run `npm run sync:catalog`
// to regenerate it. This test fails the build when the two drift apart.
test('the DEFAULT_VERSES seed in neon.js matches the canonical verses.json catalog', () => {
  assert.ok(Array.isArray(canonical.verses) && canonical.verses.length > 0);

  const canonicalIds = canonical.verses.map((v) => v.id);
  const seedIds = DEFAULT_VERSES.map((v) => v.id);

  assert.deepEqual(
    seedIds,
    canonicalIds,
    'the seed catalog and verses.json list different verses; run `npm run sync:catalog`'
  );

  for (const source of canonical.verses) {
    const seed = DEFAULT_VERSES.find((v) => v.id === source.id);
    assert.ok(seed, `missing ${source.id} in the seed catalog`);

    assert.equal(seed.reference, source.reference, `${source.id}: reference drifted`);
    assert.equal(seed.text, source.text, `${source.id}: verse text drifted`);

    assert.equal(
      seed.lines?.length,
      source.lines?.length,
      `${source.id}: line count drifted`
    );
    for (const [index, line] of (source.lines ?? []).entries()) {
      const seedLine = seed.lines?.[index];
      assert.ok(seedLine, `${source.id}: missing line ${index}`);
      assert.equal(seedLine.text, line.text, `${source.id}: line ${index} text drifted`);
      assert.equal(seedLine.width, line.width, `${source.id}: line ${index} width drifted`);
      assert.equal(seedLine.color, line.color, `${source.id}: line ${index} color drifted`);
    }
  }
});

test('every verse carries the fields the renderer and the accessibility layer rely on', () => {
  for (const verse of canonical.verses) {
    assert.ok(verse.id, 'verse is missing an id');
    assert.ok(verse.reference, `${verse.id} is missing a reference`);
    assert.ok(verse.text, `${verse.id} is missing its text`);
    assert.ok(Array.isArray(verse.lines) && verse.lines.length > 0, `${verse.id} has no lines`);
    for (const line of verse.lines) {
      assert.ok(line.text, `${verse.id} has a line without text`);
      assert.ok(['amber', 'blue', 'white', 'rose'].includes(line.color), `${verse.id} has an unknown color`);
      assert.ok(line.width >= 440 && line.width <= 606, `${verse.id} has an out-of-range width`);
    }
  }
});
