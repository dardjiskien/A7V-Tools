// Service worker : met toute l'app en cache pour un usage 100 % hors-ligne.
// Incrémente CACHE_VERSION à chaque modification de index.html.
const CACHE_VERSION = 'a7v-stacking-v7';
const ASSETS = ['./', './index.html', './manifest.json', './apple-touch-icon.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) =>
      cached || fetch(event.request).catch(() =>
        event.request.mode === 'navigate' ? caches.match('./index.html') : undefined
      )
    )
  );
});
