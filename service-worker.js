const CACHE_NAME = 'sirrch-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/index.js',
  '/icon.svg',
  '/favicon.svg',
  '/og.png',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.hostname === 'api.dictionaryapi.dev') {
    event.respondWith(
      fetch(event.request).catch(() => new Response('{}', { status: 503 }))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
