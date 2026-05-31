// Minimal service worker — required for PWA install criteria.
// Network-only pass-through; no caching to avoid stale content.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(
      () => new Response('', { status: 504, statusText: 'Offline' })
    )
  );
});
