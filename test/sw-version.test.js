import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

const sw = await readFile(join(ROOT, 'sw.js'), 'utf8');
const workflow = await readFile(join(ROOT, '.github', 'workflows', 'deploy.yml'), 'utf8');

test('the cache name is derived from a build id, so every deploy invalidates the old shell', () => {
  assert.match(sw, /^const BUILD_ID = '[^']+';$/m, 'sw.js must declare a BUILD_ID');
  assert.match(
    sw,
    /^const CACHE_NAME = `news-dieppe-\$\{BUILD_ID\}`;$/m,
    'the cache name must be derived from BUILD_ID'
  );
  assert.doesNotMatch(
    sw,
    /^const CACHE_NAME = 'news-dieppe-v\d+';$/m,
    'a hardcoded cache name pins returning visitors to a stale app shell'
  );
});

test('the deploy workflow really stamps the build id into sw.js', () => {
  const sedMatch = workflow.match(/sed\s+-i\.bak\s+"s\/([^/]+)\/([^/]+)\/"/);
  assert.ok(sedMatch, 'deploy.yml must stamp the build id into sw.js with sed');

  const [, pattern, replacement] = sedMatch;
  const stamped = sw.replace(new RegExp(pattern, 'm'), replacement.replace('${BUILD_ID}', 'teststamp'));

  assert.notEqual(stamped, sw, 'the stamp command does not match the BUILD_ID line in sw.js');
  assert.match(stamped, /^const BUILD_ID = 'teststamp';$/m);
});

test('the precache list matches the files the app actually ships', async () => {
  const block = sw.match(/const PRECACHE_ASSETS = \[([\s\S]*?)\];/)[1];
  const assets = [...block.matchAll(/'([^']+)'/g)].map((m) => m[1]);

  assert.ok(assets.includes('./blank-shirt.webp'), 'the backdrop must be precached');
  assert.ok(!assets.includes('./blank-shirt.png'), 'the 1.8 MB source photograph must not be precached');
  assert.ok(!assets.includes('./manifest.webmanifest'), 'the duplicate manifest must not be precached');
  assert.ok(assets.includes('./site.webmanifest'), 'the single manifest must be precached');

  for (const asset of assets) {
    if (asset === './') continue;
    const rel = asset.replace(/^\.\//, '');
    await assert.doesNotReject(
      readFile(join(ROOT, rel)),
      `${asset} is precached but missing from the repository`
    );
  }
});
