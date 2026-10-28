import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import '../neon.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const {
  glyphs,
  mountX,
  WEEK_MS,
  STORAGE_KEYS,
  DEFAULT_VERSES,
  wrapTextIntoLines,
  normalizeRows,
  getCatalog,
  saveCatalog,
  selectNextVerse,
  syncFromBackendIfDue,
  captureAiReferral,
} = globalThis.NeonEngine;

function createMockStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

test('glyphs cover full A-Z alphabet, 0-9 numerals, and punctuation', () => {
  const expectedChars = [
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    ',', '.', ':', ';', "'", '-', '?', '!',
  ];
  for (const ch of expectedChars) {
    assert.ok(glyphs[ch], `Missing glyph for '${ch}'`);
    assert.ok(typeof glyphs[ch].w === 'number' && glyphs[ch].w > 0, `Invalid width for '${ch}'`);
    assert.match(glyphs[ch].d, /^M/, `Invalid SVG path for '${ch}'`);
    if (glyphs[ch].w > 20) {
      assert.ok(typeof mountX[ch] === 'number', `Missing mountX for wide glyph '${ch}'`);
    }
  }
});

test('all verses in verses.json and DEFAULT_VERSES contain only supported glyphs', async () => {
  const raw = JSON.parse(await readFile(join(ROOT, 'verses.json'), 'utf8'));
  assert.ok(Array.isArray(raw.verses) && raw.verses.length >= 10);
  assert.equal(raw.syncIntervalDays, 7);

  for (const verse of [...raw.verses, ...DEFAULT_VERSES]) {
    assert.ok(verse.id && verse.reference && verse.text);
    const rows = normalizeRows(verse);
    assert.ok(rows.length >= 1 && rows.length <= 8);
    for (const row of rows) {
      for (const ch of row.text) {
        assert.ok(ch === ' ' || glyphs[ch], `Unsupported char '${ch}' in verse ${verse.id}`);
      }
    }
  }
});

test('wrapTextIntoLines and normalizeRows dynamically wrap custom arbitrary quotes', () => {
  const custom = {
    id: 'custom-quote',
    reference: 'Custom 1:1',
    text: 'Light shines in the darkness, and the darkness has not overcome it!',
  };
  const rows = normalizeRows(custom);
  assert.ok(rows.length >= 3 && rows.length <= 6);
  assert.equal(rows[0].y, 39);
  assert.equal(rows[rows.length - 1].y, 554);
  for (const row of rows) {
    assert.ok(row.width >= 440 && row.width <= 606);
    assert.ok(['amber', 'blue', 'white', 'rose'].includes(row.color));
  }
});

test('every page refresh selects a new quote/verse from localStorage', () => {
  const storage = createMockStorage();
  const catalog = getCatalog(storage);
  assert.ok(catalog.length >= 10);

  const seenIds = [];
  for (let i = 0; i < catalog.length; i++) {
    const { verse, index } = selectNextVerse(storage, '');
    assert.equal(index, i);
    seenIds.push(verse.id);
    if (i > 0) {
      assert.notEqual(seenIds[i], seenIds[i - 1], 'Consecutive refreshes must display a different verse');
    }
  }
  assert.equal(new Set(seenIds).size, catalog.length, 'Should cycle through all stored verses');

  // Next refresh wraps cleanly around to index 0
  const wrapped = selectNextVerse(storage, '');
  assert.equal(wrapped.index, 0);
});

test('weekly sync policy only fetches from backend when 7 days have elapsed', async () => {
  const storage = createMockStorage();
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;

  globalThis.fetch = async () => {
    fetchCalls++;
    return {
      ok: true,
      json: async () => ({
        verses: [{ id: 'weekly-test', reference: 'Test 7:7', text: 'Refreshed after one week.' }],
      }),
    };
  };

  try {
    // 1. Initial sync (no LAST_SYNC timestamp yet) -> fetches from backend
    const firstSync = await syncFromBackendIfDue(storage, false);
    assert.equal(firstSync, true);
    assert.equal(fetchCalls, 1);
    assert.equal(getCatalog(storage)[0].id, 'weekly-test');

    // 2. Subsequent check 2 days later (< 7 days) -> does NOT fetch
    storage.setItem(STORAGE_KEYS.LAST_SYNC, String(Date.now() - 2 * 24 * 60 * 60 * 1000));
    const earlySync = await syncFromBackendIfDue(storage, false);
    assert.equal(earlySync, false);
    assert.equal(fetchCalls, 1);

    // 3. Check 8 days later (>= 7 days / WEEK_MS) -> fetches from backend
    storage.setItem(STORAGE_KEYS.LAST_SYNC, String(Date.now() - (WEEK_MS + 1000)));
    const dueSync = await syncFromBackendIfDue(storage, false);
    assert.equal(dueSync, true);
    assert.equal(fetchCalls, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('captureAiReferral detects and normalizes AI search engine referrers', () => {
  assert.equal(captureAiReferral('https://chatgpt.com/'), 'chatgpt.com');
  assert.equal(captureAiReferral('https://www.perplexity.ai/search?q=news+dieppe'), 'perplexity.ai');
  assert.equal(captureAiReferral('https://claude.ai/chat/123'), 'claude.ai');
  assert.equal(captureAiReferral('https://search.brave.com/search?q=glass+neon'), 'search.brave.com');
  assert.equal(captureAiReferral('android-app://com.openai.chatgpt'), 'chatgpt-app');
  assert.equal(captureAiReferral('https://example.com/'), null);
  assert.equal(captureAiReferral(''), null);
  assert.equal(captureAiReferral(null), null);
});
