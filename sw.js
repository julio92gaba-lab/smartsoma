/* SmartSoma — Service Worker */

const CACHE_NAME = 'smartsoma-v2';

const ASSETS_TO_CACHE = [
  '/app.html',
  '/app.js',
  '/app.css',
  '/pwa-install.js',
  '/manifest.json',
  '/logo-home.png',
  '/icon-192.png',
  '/icon-512.png',
  '/01uber.png',
  '/02bolt.png',
  '/04despesas.png',
  '/05distancia.png'
];

/* ── INSTALL: guarda os assets essenciais em cache ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* ── ACTIVATE: limpa caches antigos ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── FETCH: cache-first para assets, network-first para API ── */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  /* Deixa passar pedidos externos (Supabase, CDN, etc.) */
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        /* Guarda em cache só respostas válidas */
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        /* Offline fallback: devolve o app.html para rotas de navegação */
        if (event.request.mode === 'navigate') {
          return caches.match('/app.html');
        }
      });
    })
  );
});