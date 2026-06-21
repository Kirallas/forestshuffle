const CACHE_NAME = 'my-app-cache-v2';
const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const withScope = (path) => `${scopePath}${path}`;
const urlsToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/iconx/android-chrome-192x192.png',
  '/iconx/android-chrome-maskable-192x192.png',
  '/iconx/apple-touch-icon.png',
  '/iconx/android-chrome-512x512.png',
  '/iconx/android-chrome-maskable-512x512.png',
  '/iconx/favicon.ico',
  '/img/cave.png',
  '/img/points.png',
  '/img/splash.png',
  '/img/top-forest.png',
].map(withScope);

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.addAll(urlsToCache);
          })
  );
});


self.addEventListener('install', event => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  event.waitUntil(
      caches.keys()
          .then(cacheNames => Promise.all(
              cacheNames
                  .filter(cacheName => cacheName !== CACHE_NAME)
                  .map(cacheName => caches.delete(cacheName))
          ))
          .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetching:', event.request.url);
});
