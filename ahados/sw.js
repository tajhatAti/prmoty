/* AhadOs — service worker (PWA offline support) */
const CACHE = 'ahados-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/themes.css',
  './css/os.css',
  './css/apps.css',
  './js/icons.js',
  './js/data.js',
  './js/core.js',
  './js/apps.js',
  './js/main.js',
  './assets/icons/icon-512.png',
  './assets/wallpapers/wall-aurora.jpg',
  './assets/wallpapers/wall-neon.jpg',
  './assets/wallpapers/wall-minimal.jpg',
  './assets/wallpapers/wall-dark.jpg',
  './assets/wallpapers/wall-sunset.jpg',
  './assets/wallpapers/wall-ahad.jpg',
  './assets/wallpapers/photo-food.jpg',
  './assets/wallpapers/photo-travel.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
      return res;
    }))
  );
});
