var CACHE_NAME = 'alekeagle-me-v1';
var urlsToCache = [
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js',
    'https://fonts.googleapis.com/css?family=K2D',
    'https://fonts.gstatic.com/s/k2d/v3/J7aTnpF2V0EjZKUsrLc.woff2',
    'https://fonts.gstatic.com/s/k2d/v3/J7aTnpF2V0EjcKUs.woff2',
    '/',
    '/me/',
    '/me/upload/',
    '/me/uploads/',
    '/me/uploads/info/',
    '/assets/css/universal.css',
    '/assets/js/memory.js',
    '/assets/images/circle.png',
    '/assets/images/me_irl.png',
    '/assets/images/empty.gif',
    '/assets/js/snackbar.js'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.keys().then(cacheNames => {
            if (cacheNames.includes(CACHE_NAME)) {
                caches.delete(CACHE_NAME).then(() => {
                    caches.open(CACHE_NAME).then(function (cache) {
                        console.log('Opened cache');
                        return cache.addAll(urlsToCache.map(url => {
                            return new Request(url, { mode: 'no-cors' });
                        }));
                    });
                })
            }
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type === 'opaque' || response.url.includes('/api/')) {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});