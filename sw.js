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

// Push notifications: attempt to fetch the latest notification to show a contextual message.
const SW_URL = new URL(self.location.href)
const API_BASE = SW_URL.searchParams.get('api') || ''

self.addEventListener('push', (event) => {
  const fallback = {
    title: '',
    body: 'You have a new notification',
    url: '/#/',
  }
  event.waitUntil((async () => {
    try {
      const endpoint = API_BASE ? `${API_BASE}/api/me/notifications` : '/api/me/notifications'
      const res = await fetch(endpoint, { credentials: 'include' })
      if (res && res.ok) {
        const j = await res.json().catch(() => null)
        const items = Array.isArray(j?.items) ? j.items : []
        const newest = items[0]
        if (newest) {
          let body = 'You have a new notification'
          let url = '/#/'
          const kind = String(newest.kind || '')
          const text = newest.text || ''
          const notifId = newest.id || Date.now()
          
          switch (kind) {
            case 'comment':
              body = text || 'Someone commented on your post.'
              url = '/#/mp/feed'
              break
            case 'reaction':
              body = text || 'Someone reacted to your post.'
              url = '/#/md/feed'
              break
            case 'star':
              body = 'A moderator starred your post.'
              url = '/#/mp/feed'
              break
            case 'likes5':
              body = 'Your post hit 5 likes!'
              url = '/#/mp/feed'
              break
            case 'inspiration':
              body = text || 'Someone marked you as an inspiration!'
              url = '/#/profile'
              break
            case 'system':
            default: {
              let parsed = null
              try { parsed = text && typeof text === 'string' ? JSON.parse(text) : null } catch {}
              if (parsed && parsed.type === 'queue_invite') {
                body = `${parsed.inviter_username || 'Someone'} invited you to ${parsed.queue_name || 'a queue'}`
                url = '/#/md/queues'
              } else {
                body = (typeof text === 'string' && text) ? text : 'You have a new notification'
                url = '/#/'
              }
              break
            }
          }
          await self.registration.showNotification('mappi!', {
            body,
            icon: '/192.png',
            badge: '/192.png',
            tag: `mappi-${notifId}`,
            renotify: false,
            requireInteraction: false,
            data: { url },
          })
          return
        }
      }
    } catch {}
    await self.registration.showNotification('mappi!', {
      body: fallback.body,
      icon: '/192.png',
      badge: '/192.png',
      tag: `mappi-${Date.now()}`,
      renotify: false,
      requireInteraction: false,
      data: { url: fallback.url },
    })
  })())
})

self.addEventListener('notificationclick', (event) => {
  const url = event.notification?.data?.url || '/#/'
  event.notification.close()
  event.waitUntil((async () => {
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true })
    const existing = clientList.find(c => typeof c.url === 'string' && c.url.includes(url))
    if (existing) { await existing.focus(); return }
    await clients.openWindow(url)
  })())
})

