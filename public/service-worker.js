// This is the service worker with the Cache-first network

const CACHE = "lupapp-v1";
const precacheFiles = [
  "/tickets_project/",
  "/tickets_project/index.html",
  "/tickets_project/manifest.json",
  "/tickets_project/icon.png",
  "/tickets_project/login-image.png",
];

// Install Service Worker
self.addEventListener("install", function (event) {
  console.log("Service Worker: Installing....");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("Service Worker: Caching App Shell at the moment...");
      return cache.addAll(precacheFiles);
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", function (event) {
  console.log("Service Worker: Activating....");

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (oldCache) {
          if (oldCache !== CACHE) {
            console.log("Service Worker: Removing Old Cache", oldCache);
            return caches.delete(oldCache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event: Try cache first, then network
self.addEventListener("fetch", function (event) {
  console.log("Service Worker: Fetch", event.request.url);

  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        console.log("Service Worker: Found in Cache", event.request.url);
        return response;
      }

      console.log(
        "Service Worker: Not in Cache, fetching from network",
        event.request.url
      );
      return fetch(event.request)
        .then(function (response) {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response as it's a stream and can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE).then(function (cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(function (error) {
          console.log(
            "Service Worker: Fetch failed; returning offline page instead.",
            error
          );
          // You could return a custom offline page here
          return caches.match("/tickets_project/");
        });
    })
  );
});
