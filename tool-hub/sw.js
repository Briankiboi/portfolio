const CACHE = 'dm-tools-v4';
const SHELL = [
  '/tool-hub/',
  '/tool-hub/index.html',
  '/tool-hub/manifest.json',
  '/tool-hub/assets/css/app.css',
  '/tool-hub/assets/css/hub.css',
  '/tool-hub/assets/css/site-header.css',
  '/tool-hub/assets/js/app.js',
  '/tool-hub/assets/js/catalog.js',
  '/tool-hub/assets/js/site-header.js',
  '/tool-hub/assets/js/site-search.js',
  '/tool-hub/assets/icon-512.png',
  '/tool-hub/assets/icon-install.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  /* Never touch cross-origin requests: if a tool calls an API or fetches a
     page that the browser CORS-blocks, the error must reach the tool's own
     error handling — not a cached same-origin page substituted here. */
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/tool-hub/')))
  );
});
