const CACHE_NAME = 'pv-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './assets/css/index.css',
  './assets/js/main.js',
  './assets/js/data.js',
  './assets/js/ai-chatbot.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
