/* SmartSoma — Service Worker */

const CACHE_NAME = 'smartsoma-v6';
const NETWORK_TIMEOUT = 4000; /* ms: sem resposta da rede, usa a cache se existir */

const ASSETS_TO_CACHE = [
  '/app',
  '/app.js',
  '/app.css',
  '/ui-v2.js',
  '/ui-v2.css',
  '/cloud-init.js',
  '/supabase.min.js',
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

/* ── FETCH: rede primeiro (atualizações chegam sozinhas), cache como reserva offline ── */
self.addEventListener('fetch', event => {
  const request = event.request;

  /* Só GET; deixa passar pedidos externos (Supabase, CDN, etc.) */
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(networkFirst(request));
});

function networkFirst(request) {
  return new Promise(resolve => {
    let settled = false;

    /* Rede lenta: se já houver cópia em cache, usa-a e deixa a rede atualizar a cache */
    const timer = setTimeout(() => {
      caches.match(request).then(cached => {
        if (cached && !settled) { settled = true; resolve(cached); }
      });
    }, NETWORK_TIMEOUT);

    fetch(request).then(response => {
      clearTimeout(timer);
      /* Guarda em cache só respostas válidas (nunca redirecionamentos) */
      if (response && response.status === 200 && response.type === 'basic' && !response.redirected) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
      }
      if (!settled) { settled = true; resolve(response); }
    }).catch(() => {
      clearTimeout(timer);
      if (settled) return;
      /* Offline */
      caches.match(request, { ignoreSearch: request.mode === 'navigate' }).then(cached => {
        if (cached) { settled = true; return resolve(cached); }
        if (request.mode === 'navigate') {
          return caches.match('/app').then(fallback => {
            settled = true;
            resolve(fallback || Response.error());
          });
        }
        settled = true;
        resolve(Response.error());
      });
    });
  });
}
