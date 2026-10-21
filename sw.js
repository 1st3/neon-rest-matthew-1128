const CACHE_NAME = 'news-dieppe-v1';
const META_SYNC_URL = '/__sw_meta/last_sync';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './neon.js',
  './verses.json',
  './blank-shirt.png',
  './site.webmanifest',
  './manifest.webmanifest',
  './favicon.svg',
  './favicon.ico',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './favicon-48x48.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
];

async function getLastSync(cache) {
  const metaResp = await cache.match(META_SYNC_URL);
  if (!metaResp) return 0;
  const text = await metaResp.text();
  const parsed = Number.parseInt(text, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function setLastSync(cache, timestamp) {
  await cache.put(
    META_SYNC_URL,
    new Response(String(timestamp), {
      headers: { 'content-type': 'text/plain' },
    })
  );
}

async function broadcastVersesUpdate(verses, syncedAt) {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of clients) {
    client.postMessage({
      type: 'VERSES_UPDATED',
      verses,
      syncedAt,
    });
  }
}

async function syncVersesIfDue(force = false) {
  const cache = await caches.open(CACHE_NAME);
  const lastSync = await getLastSync(cache);
  const now = Date.now();
  const cachedVerses = await cache.match('./verses.json');

  if (!force && cachedVerses && lastSync > 0 && now - lastSync < WEEK_MS) {
    return { updated: false, response: cachedVerses, lastSync };
  }

  try {
    const freshResp = await fetch('./verses.json', { cache: 'no-store' });
    if (freshResp && freshResp.ok) {
      const cloneForCache = freshResp.clone();
      const cloneForJson = freshResp.clone();
      await cache.put('./verses.json', cloneForCache);
      await setLastSync(cache, now);

      try {
        const data = await cloneForJson.json();
        if (Array.isArray(data?.verses)) {
          await broadcastVersesUpdate(data.verses, now);
        }
      } catch {}

      return { updated: true, response: freshResp, lastSync: now };
    }
  } catch {
    // Offline fallback to cached copy
  }

  return { updated: false, response: cachedVerses, lastSync };
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_ASSETS);
      await setLastSync(cache, Date.now());
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Weekly sync policy for backend verses endpoint
  if (url.pathname.endsWith('/verses.json')) {
    event.respondWith(
      (async () => {
        const { response } = await syncVersesIfDue(false);
        if (response) return response;
        return new Response(JSON.stringify({ verses: [] }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      })()
    );
    return;
  }

  // Cache-first for static assets & offline app shell
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;

      try {
        const networkResp = await fetch(request);
        if (networkResp && networkResp.status === 200) {
          cache.put(request, networkResp.clone());
        }
        return networkResp;
      } catch {
        if (request.mode === 'navigate') {
          const fallback = (await cache.match('./index.html')) || (await cache.match('./'));
          if (fallback) return fallback;
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'CHECK_WEEKLY_SYNC') {
    event.waitUntil(syncVersesIfDue(Boolean(data.force)));
  }
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'weekly-verse-sync') {
    event.waitUntil(syncVersesIfDue(false));
  }
});
