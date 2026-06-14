const CACHE_NAME = 'controle-financeiro-v1';
const ASSETS_TO_CACHE = [
    './',
    './controle_financeiro.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ Cache aberto');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(err => console.log('❌ Erro ao cachear:', err))
    );
});

// Ativar Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('️ Cache antigo removido:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptando requisições
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache first, then network
                return response || fetch(event.request);
            })
            .catch(() => {
                // Se falhar, retornar página offline
                if (event.request.mode === 'navigate') {
                    return caches.match('./controle_financeiro.html');
                }
            })
    );
});