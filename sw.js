const CACHE_NAME = 'twin-team-v1';
const assetsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js'
];

// تثبيت الـ Service Worker وحفظ الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(assetsToCache);
      })
  );
});

// تفعيل الـ Service Worker ومسح أي كاش قديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

// استرجاع الملفات من الكاش لما التطبيق يفتح
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});