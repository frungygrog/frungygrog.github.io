// Service Worker for mappi! PWA
// Strategy:
// - Navigation requests (documents): network-first to always get latest index.html
// - Static assets (js/css/img/font): cache-first (Vite hashed filenames are safe to cache)
// - API and other requests: go to network
// - Offline fallback to cached /index.html when navigation fails

const STATIC_CACHE = 'mappi-static-v2';
const PRECACHE_URLS = [
  '/index.html', // offline fallback only; navigation uses network-first
  '/favicon.ico',
  '/icon.png',
  '/192.png',
  '/512.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((err) => console.warn('SW install: precache failed', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names.map((n) => (n !== STATIC_CACHE ? caches.delete(n) : Promise.resolve()))
    );
    await self.clients.claim();
  })());
});

function isSameOrigin(url) {
  try {
    const u = new URL(url, self.location.origin);
    return u.origin === self.location.origin;
  } catch {
    return false;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests
  if (!isSameOrigin(req.url)) return;

  // Never cache API calls
  if (url.pathname.startsWith('/api/')) return;

  // Network-first for navigations/documents to pick up new builds immediately
  const isNav = req.mode === 'navigate' || req.destination === 'document';
  if (isNav) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Optionally cache the latest index.html as fallback
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put('/index.html', copy)).catch(() => {});
          return res;
        })
        .catch(async () => {
          // Offline fallback to cached index
          const fallback = await caches.match('/index.html');
          return fallback || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // Cache-first for static assets (hashed files)
  const isStatic = ['script', 'style', 'image', 'font'].includes(req.destination) || /\.(?:js|css|png|jpg|jpeg|svg|webp|woff2?)$/i.test(url.pathname);
  if (isStatic && req.method === 'GET') {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (!res || res.status !== 200) return res;
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        });
      })
    );
    return;
  }

  // Default: network
  // Let the request pass through without interception
});

