// Brian Kiboi Portfolio — Service Worker
// PWA install support + resilient offline experience.
// Strategy: NETWORK-FIRST for everything (same-origin), cache as offline
// fallback. Files are hand-edited in place with a fixed filename, so cache-first
// would serve stale bundles to returning visitors — network-first never does.
const VERSION = 'portfolio-v2';
const PRECACHE_URLS = ['/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache a copy for offline use, then return the fresh response.
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then(
          (cached) =>
            cached ||
            (request.mode === 'navigate'
              ? caches.match('/')
              : new Response('', { status: 504, statusText: 'Offline' }))
        )
      )
  );
});