const CACHE_NAME = 'mon50cc-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.css',
  '/js/gps-core.js',
  '/js/jarvis-voice.js',
  '/js/v3-smartcity.js',
  '/js/silicon-valley.js',
  '/js/ghost-rider-v2.js',
  '/js/social-map.js',
  '/js/rgpd-cnil.js',
  '/js/web4-recovery.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
