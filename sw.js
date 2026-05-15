const CACHE_NAME = 'mon50ccetmoi-v50109-GOLD';
const TILES_CACHE_NAME = 'mon50cc-tiles-v1';

const STATIC_ASSETS = [
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './js/crypto-js.min.js',
  './manifest.json'
];

// Install : only pre-cache truly static assets (icons, manifest)
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing v50109-GOLD + Offline Maps...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate : purge only old app caches, keep tiles cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // On garde le cache de tuiles même si on met à jour l'app
          if (cacheName !== CACHE_NAME && cacheName !== TILES_CACHE_NAME) {
            console.log('[ServiceWorker] Purging legacy cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ============================================================
// MESSAGE API : Contrôle depuis la page (offline-map.js)
// ============================================================
self.addEventListener('message', (event) => {
  if (!event.data) return;

  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    // Télécharger un paquet de tuiles pour une zone
    case 'CACHE_TILES': {
      const { urls, jobId } = event.data;
      if (!urls || !urls.length) return;

      const port = event.ports[0];
      let cached = 0;
      let failed = 0;
      const total = urls.length;

      caches.open(TILES_CACHE_NAME).then(async (cache) => {
        for (const tileUrl of urls) {
          try {
            // Vérifie si déjà en cache
            const existing = await cache.match(tileUrl);
            if (existing) {
              cached++;
            } else {
              const resp = await fetch(tileUrl, {
                headers: { 'User-Agent': 'mon50ccetmoi-offline/1.0' }
              });
              if (resp.ok) {
                await cache.put(tileUrl, resp);
                cached++;
              } else {
                failed++;
              }
            }
          } catch (e) {
            failed++;
          }

          // Rapport de progression toutes les 20 tuiles
          if (port && (cached + failed) % 20 === 0) {
            port.postMessage({
              type: 'CACHE_PROGRESS',
              jobId,
              cached,
              failed,
              total,
              percent: Math.round(((cached + failed) / total) * 100)
            });
          }
        }

        // Rapport final
        if (port) {
          port.postMessage({
            type: 'CACHE_COMPLETE',
            jobId,
            cached,
            failed,
            total
          });
        }
        console.log(`[SW Tiles] Zone cached: ${cached}/${total} (${failed} failed)`);
      });
      break;
    }

    // Obtenir les stats du cache de tuiles
    case 'GET_TILES_STATS': {
      const port = event.ports[0];
      caches.open(TILES_CACHE_NAME).then(async (cache) => {
        const keys = await cache.keys();
        let totalSize = 0;
        // On estime la taille (pas d'API officielle, on échantillonne)
        const sample = keys.slice(0, 50);
        for (const req of sample) {
          const resp = await cache.match(req);
          if (resp) {
            const blob = await resp.blob();
            totalSize += blob.size;
          }
        }
        const avgSize = sample.length > 0 ? totalSize / sample.length : 8000;
        const estimatedTotalMb = Math.round((avgSize * keys.length) / (1024 * 1024) * 10) / 10;

        if (port) {
          port.postMessage({
            type: 'TILES_STATS',
            count: keys.length,
            estimatedMb: estimatedTotalMb
          });
        }
      });
      break;
    }

    // Effacer tout le cache de tuiles
    case 'CLEAR_TILES_CACHE': {
      const port = event.ports[0];
      caches.delete(TILES_CACHE_NAME).then(() => {
        if (port) port.postMessage({ type: 'TILES_CLEARED' });
        console.log('[SW Tiles] Cache effacé.');
      });
      break;
    }
  }
});

// ============================================================
// FETCH : Interception des requêtes
// ============================================================
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // ── Tuiles OpenStreetMap / OpenTopo : Cache-First (offline tiles)
  const isTile = url.hostname.includes('tile.openstreetmap.org') ||
                 url.hostname.includes('tile.opentopomap.org') ||
                 url.hostname.includes('a.tile.openstreetmap.org') ||
                 url.hostname.includes('b.tile.openstreetmap.org') ||
                 url.hostname.includes('c.tile.openstreetmap.org');

  if (isTile) {
    event.respondWith(
      caches.open(TILES_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const resp = await fetch(event.request);
          if (resp.ok) cache.put(event.request, resp.clone());
          return resp;
        } catch (e) {
          return new Response('Tile offline', { status: 503 });
        }
      })
    );
    return;
  }

  // ── APIs externes → toujours réseau
  if (url.hostname.includes('googleapis') || url.hostname.includes('gstatic') ||
      url.hostname.includes('firebase') || url.hostname.includes('firebaseio') ||
      url.hostname.includes('nominatim') || url.hostname.includes('osrm')) {
    event.respondWith(fetch(event.request).catch(() => {
      return new Response('Network error', { status: 408 });
    }));
    return;
  }

  // ── Fichiers App (JS/HTML/CSS) → Network-First
  const isAppFile = /\.(js|html|css)(\?.*)?$/.test(url.pathname);
  if (isAppFile) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok && event.request.method === 'GET') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') return caches.match('./index.html');
          return new Response('Offline', { status: 503 });
        });
      })
    );
    return;
  }

  // ── Assets statiques (images, fonts) → Cache-First
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
