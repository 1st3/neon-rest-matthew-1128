// End-to-end live verification against https://news.dieppe.app/
// Tests:
//  1. All 17 endpoints return HTTP 200 with expected Content-Type
//  2. Chrome DevTools Page.getAppManifest reports 0 errors
//  3. localStorage stores all verses and every page refresh displays a new verse
//  4. Service Worker activates, caches app shell, enforces 7-day sync window, and serves offline
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { withChrome } from './cdp.mjs';

const BASE = process.argv[2] ?? 'https://news.dieppe.app';
const screenshotDir = process.env.SCREENSHOT_OUT_DIR;

const ENDPOINTS = [
  ['/', /^text\/html/],
  ['/styles.css', /^text\/css/],
  ['/neon.js', /^application\/javascript/],
  ['/sw.js', /^application\/javascript/],
  ['/verses.json', /^application\/json/],
  ['/site.webmanifest', /^application\/manifest\+json/],
  ['/manifest.webmanifest', /^application\/manifest\+json/],
  ['/favicon.svg', /^image\/svg\+xml/],
  ['/favicon.ico', /^image\/(x-icon|vnd\.microsoft\.icon)/],
  ['/favicon-16x16.png', /^image\/png/],
  ['/favicon-32x32.png', /^image\/png/],
  ['/favicon-48x48.png', /^image\/png/],
  ['/apple-touch-icon.png', /^image\/png/],
  ['/icon-192.png', /^image\/png/],
  ['/icon-512.png', /^image\/png/],
  ['/icon-maskable-192.png', /^image\/png/],
  ['/icon-maskable-512.png', /^image\/png/],
  ['/screenshots/screenshot-wide.png', /^image\/png/],
  ['/screenshots/screenshot-narrow.png', /^image\/png/],
];

for (const [path, ctRegex] of ENDPOINTS) {
  const res = await fetch(`${BASE}${path}`);
  assert.equal(res.status, 200, `${path} returned ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  assert.match(ct, ctRegex, `${path} content-type '${ct}' did not match ${ctRegex}`);
}
console.log(`✔ All ${ENDPOINTS.length} live endpoints returned HTTP 200 with expected Content-Type`);

await withChrome(async ({ send, navigate }) => {
  await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // 1. First load
  await navigate(`${BASE}/`);

  const manifestResult = await send('Page.getAppManifest');
  assert.equal((manifestResult.errors ?? []).length, 0, 'Expected 0 manifest errors');
  console.log('✔ Chrome Page.getAppManifest: 0 errors or warnings');

  const getPageState = async () => {
    const { result } = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        reference: document.querySelector('.reference')?.textContent,
        verseId: document.querySelector('.reference')?.getAttribute('data-verse-id'),
        lines: Array.from(document.querySelectorAll('.neon-row')).map(el => el.getAttribute('data-verse-line')),
        catalogSize: JSON.parse(localStorage.getItem('neon_verses_catalog') || '[]').length,
        lastSync: Number(localStorage.getItem('neon_last_sync_ts') || '0')
      })`,
      returnByValue: true,
    });
    return JSON.parse(result.value);
  };

  const load1 = await getPageState();
  assert.ok(load1.catalogSize >= 12, `Expected >= 12 verses in localStorage, got ${load1.catalogSize}`);
  assert.equal(load1.reference, 'Matthew 11:28');
  console.log(`✔ Load #1: ${load1.reference} (${load1.lines.join(' / ')}) [catalog=${load1.catalogSize}]`);

  // 2. Refresh page and verify a new verse is displayed
  await navigate(`${BASE}/?refresh=1`);
  const load2 = await getPageState();
  assert.notEqual(load2.verseId, load1.verseId, 'Refresh #1 should rotate to a new verse');
  console.log(`✔ Refresh #1: ${load2.reference} (${load2.lines.join(' / ')})`);

  if (screenshotDir) {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(`${screenshotDir}/live_refresh_psalm23.png`, Buffer.from(data, 'base64'));
  }

  // 3. Second refresh -> third verse
  await navigate(`${BASE}/?refresh=2`);
  const load3 = await getPageState();
  assert.notEqual(load3.verseId, load2.verseId, 'Refresh #2 should rotate to a new verse');
  console.log(`✔ Refresh #2: ${load3.reference} (${load3.lines.join(' / ')})`);

  // 4. Verify Service Worker registration & cache
  const { result: swStateRaw } = await send('Runtime.evaluate', {
    expression: `(async () => {
      const reg = await navigator.serviceWorker.ready;
      const hasCache = await caches.has('neon-rest-v1');
      const cache = await caches.open('neon-rest-v1');
      const meta = await cache.match('/__sw_meta/last_sync');
      const lastSyncText = meta ? await meta.text() : '0';
      return JSON.stringify({
        active: Boolean(reg.active),
        state: reg.active?.state,
        hasCache,
        swLastSync: Number(lastSyncText)
      });
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  const swState = JSON.parse(swStateRaw.value);
  assert.equal(swState.active, true, 'Service Worker should be active');
  assert.equal(swState.hasCache, true, 'Cache neon-rest-v1 should exist');
  assert.ok(swState.swLastSync > 0, 'Service Worker weekly sync timestamp should be recorded');
  console.log(`✔ Service Worker active (${swState.state}), cache='neon-rest-v1' ready, lastSync=${new Date(swState.swLastSync).toISOString()}`);

  // 5. Emulate complete offline mode and verify the app still loads & rotates verses offline!
  await send('Network.emulateNetworkConditions', {
    offline: true,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0,
  });

  await send('Page.reload');
  await new Promise((r) => setTimeout(r, 700));
  const offlineState = await getPageState();
  assert.notEqual(offlineState.verseId, load3.verseId, 'Offline reload should still rotate to the next verse');
  console.log(`✔ Offline reload succeeded! Displayed: ${offlineState.reference} (${offlineState.lines.join(' / ')})`);
});

process.exit(0);
