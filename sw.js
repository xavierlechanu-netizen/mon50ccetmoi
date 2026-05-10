const CACHE_NAME = 'mon50ccetmoi-v50020-ULTIMATE';
const STATIC_ASSETS = [
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './js/crypto-js.min.js',
  './manifest.json'
];

// Install : only pre-cache truly static assets (icons, manifest)
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing v50020...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting()) // Prend le contrôle immédiatement
  );
});

// Activate : purge ALL old caches and claim clients right away
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Purging legacy cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prend le contrôle sans rechargement
  );
});

// Message : permet à la page de déclencher skipWaiting manuellement
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  // Ignorer les schémas non supportés (chrome-extension, data, etc.)
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // Toujours aller chercher sur le réseau pour les APIs externes
  if (url.hostname.includes('googleapis') || url.hostname.includes('gstatic') ||
      url.hostname.includes('firebase') || url.hostname.includes('firebaseio')) {
    event.respondWith(fetch(event.request).catch(() => {
      return new Response('Network error', { status: 408 });
    }));
    return;
  }

  // Stratégie Network-First pour les fichiers JS, HTML, CSS (toujours du code frais)
  const isAppFile = /\.(js|html|css)(\?.*)?$/.test(url.pathname);
  if (isAppFile) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        // Mettre en cache la nouvelle version
        if (networkResponse.ok && event.request.method === 'GET') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        // Offline : servir depuis le cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') return caches.match('./index.html');
          return new Response('Offline', { status: 503 });
        });
      })
    );
    return;
  }

  // Cache-First pour les assets statiques (images, fonts)
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok && event.request.method === 'GET') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => new Response('Offline', { status: 503 }));
    })
  );
});
