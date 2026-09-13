// Brian Kiboi Portfolio — Service Worker
// PWA install support + resilient offline experience.
//
// Strategy:
//   - Hashed/static assets (/desktop_pc/, /planet/, /assets/*) are CACHE-FIRST:
//     the 3D scene + images load instantly on repeat visits (no loading bar).
//   - Navigations and root files (/, index.html, manifest.json, etc.) are
//     NETWORK-FIRST and runtime-cached, so edits go live without a cache dance.
//   - On install the whole 3D scene + hero images are precached in the
//     background, so the next visit has zero asset loading.
const VERSION = 'portfolio-v4';
const PRECACHE_URLS = [
      "/",
      "/assets/brian-dp.webp",
      "/assets/herobg-ecbfddc8.webp",
      "/assets/image.webp",
      "/desktop_pc/scene.bin",
      "/desktop_pc/scene.gltf",
      "/desktop_pc/textures/Material.002_baseColor.png",
      "/desktop_pc/textures/Material.023_baseColor.jpeg",
      "/desktop_pc/textures/Material.024_baseColor.jpeg",
      "/desktop_pc/textures/Material.074_0_baseColor.png",
      "/desktop_pc/textures/Material.074_10_baseColor.jpeg",
      "/desktop_pc/textures/Material.074_11_baseColor.png",
      "/desktop_pc/textures/Material.074_12_baseColor.jpeg",
      "/desktop_pc/textures/Material.074_13_baseColor.png",
      "/desktop_pc/textures/Material.074_14_baseColor.png",
      "/desktop_pc/textures/Material.074_15_baseColor.png",
      "/desktop_pc/textures/Material.074_16_baseColor.png",
      "/desktop_pc/textures/Material.074_17_baseColor.png",
      "/desktop_pc/textures/Material.074_18_baseColor.png",
      "/desktop_pc/textures/Material.074_18_emissive.png",
      "/desktop_pc/textures/Material.074_19_baseColor.png",
      "/desktop_pc/textures/Material.074_1_baseColor.jpeg",
      "/desktop_pc/textures/Material.074_20_baseColor.png",
      "/desktop_pc/textures/Material.074_21_baseColor.png",
      "/desktop_pc/textures/Material.074_22_baseColor.png",
      "/desktop_pc/textures/Material.074_23_baseColor.png",
      "/desktop_pc/textures/Material.074_24_baseColor.png",
      "/desktop_pc/textures/Material.074_24_emissive.png",
      "/desktop_pc/textures/Material.074_25_baseColor.jpeg",
      "/desktop_pc/textures/Material.074_26_baseColor.png",
      "/desktop_pc/textures/Material.074_27_baseColor.png",
      "/desktop_pc/textures/Material.074_27_emissive.png",
      "/desktop_pc/textures/Material.074_28_baseColor.png",
      "/desktop_pc/textures/Material.074_29_baseColor.png",
      "/desktop_pc/textures/Material.074_2_baseColor.jpeg",
      "/desktop_pc/textures/Material.074_30_baseColor.png",
      "/desktop_pc/textures/Material.074_31_baseColor.png",
      "/desktop_pc/textures/Material.074_32_baseColor.jpeg",
      "/desktop_pc/textures/Material.074_33_baseColor.png",
      "/desktop_pc/textures/Material.074_34_baseColor.jpeg",
      "/desktop_pc/textures/Material.074_35_baseColor.png",
      "/desktop_pc/textures/Material.074_36_baseColor.jpeg",
      "/desktop_pc/textures/Material.074_39_baseColor.jpeg",
      "/desktop_pc/textures/Material.074_3_baseColor.png",
      "/desktop_pc/textures/Material.074_40_baseColor.png",
      "/desktop_pc/textures/Material.074_4_baseColor.png",
      "/desktop_pc/textures/Material.074_4_emissive.png",
      "/desktop_pc/textures/Material.074_5_baseColor.png",
      "/desktop_pc/textures/Material.074_6_baseColor.png",
      "/desktop_pc/textures/Material.074_7_baseColor.png",
      "/desktop_pc/textures/Material.074_8_baseColor.png",
      "/desktop_pc/textures/Material.074_9_baseColor.png",
      "/desktop_pc/textures/Material.074_9_emissive.png",
      "/desktop_pc/textures/Material.074_baseColor.png",
      "/desktop_pc/textures/Material_baseColor.jpeg",
      "/desktop_pc/textures/Material_metallicRoughness.png",
      "/desktop_pc/textures/Tasten_2_baseColor.jpeg",
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

  const isStatic =
    url.pathname.startsWith('/desktop_pc/') ||
    url.pathname.startsWith('/planet/') ||
    url.pathname.startsWith('/assets/');

  if (isStatic) {
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