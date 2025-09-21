const CACHE_NAME = 'weather-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  // Add your static assets you want cached here
];

// Install service worker and cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Fetch handler for requests
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // For weather API requests, try cache first, then network and update cache
  if (request.url.includes('api.weatherapi.com')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const networkFetch = fetch(request).then(networkResponse => {
          caches.open(CACHE_NAME).then(cache => cache.put(request, networkResponse.clone()));
          return networkResponse;
        }).catch(() => cachedResponse); // fallback to cache if offline
        return cachedResponse || networkFetch;
      })
    );
  } else {
    // For other assets, serve cache first, then network
    event.respondWith(
      caches.match(request).then(response => response || fetch(request))
    );
  }
});
