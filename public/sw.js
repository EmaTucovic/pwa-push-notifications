console.log("SW loaded");

const cacheVersion = 'v1';
const currentCache = {
    offline: 'offline-cache' + cacheVersion
}
const offlineUrl = 'offlinePage.html';

self.addEventListener('install', (event)=>{
    event.waitUntil(
        caches.open(currentCache.offline).then( cache => {
            return cache.addAll([
                './offline.svg',
                offlineUrl
            ]).then(
                ()=>console.log("caching sucessfull")
            )
        })
    )
});

self.addEventListener('fetch', (event)=>{
    // request.mode = navigate isn't supported in all browsers
    // so include a check for Accept: text/html header.
    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
        fetch(event.request.url).catch(error => {
            // Return the offline page
            return caches.match(offlineUrl);
        })
    );
    }
    else{
        // Respond with everything else if we can
        event.respondWith(caches.match(event.request)
                        .then(function (response) {
                        return response || fetch(event.request);
                    })
            );
    }
});

self.addEventListener("push", (event)=>{
    const dataFromServer = event.data.json();
    console.log("push received");

    self.registration.showNotification(dataFromServer.title, {
        body: 'Hello there from sw'
    })
})