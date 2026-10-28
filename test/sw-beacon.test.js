import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const SW_SOURCE = await readFile(fileURLToPath(new URL('../sw.js', import.meta.url)), 'utf8');
const ORIGIN = 'https://news.dieppe.app';

// Load sw.js in a sandbox and drive its fetch handler. `cacheHit` decides whether the cache
// answers; every network request the worker makes is recorded in `fetches`.
function loadWorker({ cacheHit, online = true, fetchFails = false }) {
  const handlers = {};
  const fetches = [];
  const cache = {
    match: async () => (cacheHit ? { cached: true } : undefined),
    put: async () => {},
  };
  const sandbox = {
    URL,
    URLSearchParams,
    Response,
    self: {
      location: { origin: ORIGIN },
      navigator: { onLine: online },
      addEventListener: (type, fn) => { handlers[type] = fn; },
    },
    caches: { open: async () => cache },
    fetch: async (url, init) => {
      fetches.push({ url: typeof url === "string" ? url : url.url, init });
      if (fetchFails) throw new Error('offline');
      return { status: 200, clone: () => ({}) };
    },
  };
  vm.runInNewContext(SW_SOURCE, sandbox);
  return { handlers, fetches };
}

async function dispatch(worker, url, { mode = 'navigate', method = 'GET' } = {}) {
  let answer;
  const waits = [];
  worker.handlers.fetch({
    request: { url, mode, method },
    respondWith: (p) => { answer = p; },
    waitUntil: (p) => { waits.push(p); },
  });
  const response = answer ? await answer : undefined;
  await Promise.all(waits);
  return response;
}

test('cache answer plus utm_source sends exactly one report with only the utm tags', async () => {
  const worker = loadWorker({ cacheHit: true });
  await dispatch(worker, `${ORIGIN}/?utm_source=sig&utm_medium=email&secret=abc`);
  assert.equal(worker.fetches.length, 1);
  assert.equal(worker.fetches[0].url, '/_t?utm_source=sig&utm_medium=email');
  assert.equal(worker.fetches[0].init.cache, 'no-store');
  assert.equal(worker.fetches[0].init.credentials, 'omit');
});

test('a visit without utm_source sends nothing', async () => {
  const worker = loadWorker({ cacheHit: true });
  await dispatch(worker, `${ORIGIN}/?utm_medium=email`);
  await dispatch(worker, `${ORIGIN}/`);
  assert.equal(worker.fetches.length, 0);
});

test('a network answer is not reported, nginx already logged it', async () => {
  const worker = loadWorker({ cacheHit: false });
  await dispatch(worker, `${ORIGIN}/?utm_source=sig&utm_medium=email`);
  assert.deepEqual(worker.fetches.map((f) => f.url), [`${ORIGIN}/?utm_source=sig&utm_medium=email`]);
});

test('sub-resources and the report path itself are never reported', async () => {
  const worker = loadWorker({ cacheHit: true });
  await dispatch(worker, `${ORIGIN}/styles.css?utm_source=sig`, { mode: 'no-cors' });
  const beacon = await dispatch(worker, `${ORIGIN}/_t?utm_source=sig`);
  assert.equal(beacon, undefined, 'the worker lets /_t go straight to the network');
  assert.equal(worker.fetches.length, 0);
});

test('offline or failing reports never break the page', async () => {
  const offline = loadWorker({ cacheHit: true, online: false });
  const page = await dispatch(offline, `${ORIGIN}/?utm_source=sig`);
  assert.deepEqual(page, { cached: true });
  assert.equal(offline.fetches.length, 0);

  const failing = loadWorker({ cacheHit: true, fetchFails: true });
  const page2 = await dispatch(failing, `${ORIGIN}/?utm_source=sig`);
  assert.deepEqual(page2, { cached: true });
});
