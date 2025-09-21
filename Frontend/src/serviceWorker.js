// src/serviceWorker.js

const CACHE_NAME = 'weather-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.js',     // Adjust paths as needed after build
  '/static/css/main.css',
  // Add other static assets you want to cache upfront
];

// Install service worker and cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate service worker and clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler: respond with cached assets or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;  // Serve from cache
      }
      return fetch(event.request).then(networkResponse => {
        // Cache new requests dynamically
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Fallback logic when offline and not cached
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
