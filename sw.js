// Brian Kiboi Portfolio — Service Worker
// PWA install support + resilient offline experience.
//
// Strategy:
//   - The 3D scene (/desktop_pc/scene.glb, /planet/) is NETWORK-FIRST with a
//     fresh copy written back, so a broken/partial cached model can never wedge
//     the hero into the blue fallback sphere again. Cache only as offline backup.
//   - Hashed images (/assets/*) are CACHE-FIRST: instant on repeat visits.
//   - Navigations and root files (/, index.html, manifest.json, etc.) are
//     NETWORK-FIRST and runtime-cached, so edits go live without a cache dance.
const VERSION = 'portfolio-v9';
const PRECACHE_URLS = [
      "/",
      "/assets/brian-dp.webp",
      "/assets/herobg-ecbfddc8.webp",
      "/assets/image.webp",
      "/desktop_pc/scene.glb",
      "/planet/scene.bin",
      "/planet/scene.gltf",
      "/planet/textures/Clouds_baseColor.png",
      "/planet/textures/Planet_baseColor.png"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => Promise.allSettled(PRECACHE_URLS.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
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
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  const is3dScene =
    url.pathname.startsWith('/desktop_pc/') ||
    url.pathname.startsWith('/planet/');
  const isStaticImage = url.pathname.startsWith('/assets/');

  if (is3dScene) {
    // NETWORK-FIRST: the live GLTF/bin is always the source of truth so the
    // hero desktop always loads. Cache is only the offline fallback.
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || new Response('', { status: 504, statusText: 'Offline' }))
        )
    );
    return;
  }

  if (isStaticImage) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(VERSION).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
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