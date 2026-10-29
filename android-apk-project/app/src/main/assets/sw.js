// ==========================================
// OFFLINE SERVICE WORKER CACHE
// Enables 100% offline gameplay on Android & PC
// ==========================================

const CACHE_NAME = 'project-psyco-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './phaser.min.js',
    './audio.js',
    './dhaka_map.js',
    './game.js',
    './manifest.json',
    './assets/sprites/home.jpg',
    './assets/sprites/evening city.png',
    './assets/sprites/vangarasta.png',
    './assets/sprites/boss-office.png',
    './assets/sprites/baba.png',
    './assets/sprites/walkbaba.png',
    './assets/sprites/walkbaba1.png',
    './assets/sprites/walkbaba2.png',
    './assets/sprites/bikeride.png',
    './assets/sprites/kuttasleep.jpg',
    './assets/sprites/kuttavau.png',
    './assets/sprites/poristhanside.png',
    './assets/sprites/bus-topdown.png',
    './assets/sprites/top_bike.png',
    './assets/sprites/hunda.png',
    './assets/sprites/momo-boss.png',
    './assets/sprites/momo-happy.png',
    './assets/sprites/files.png',
    './assets/sprites/golla.png',
    './assets/sprites/heart.png',
    './assets/sprites/choco.png',
    './assets/sprites/flower.png',
    './assets/sprites/keys.png',
    './assets/sprites/win.png',
    './assets/sprites/l1.png',
    './assets/sprites/l2.png',
    './assets/sprites/l3.png',
    './assets/sprites/l4.png',
    './assets/sprites/l5.png',
    './assets/sprites/l6.png',
    './assets/sprites/l7.png',
    './assets/sprites/l8.png',
    './assets/sprites/l9.png',
    './assets/sprites/l10.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Caching all offline game assets');
            return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
                console.warn('[ServiceWorker] Some assets skipped during pre-cache:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache:', key);
                    return caches.delete(key);
                }
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            }).catch(() => {
                // Offline fallback
                return caches.match('./index.html');
            });
        })
    );
});
