/* Bus Tycoon HK + Neon Bus Strike — service worker
   Handles the game pages' own assets. Other pages on the site are untouched. */

const CACHE = "bus-tycoon-v7";
const CORE = [
  "./game.html",
  "./arcade.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];
const CORE_PATHS = new Set(CORE.map((asset) => new URL(asset, self.location.href).pathname));

const PAGE_FILES = ["./game.html", "./arcade.html"];

function pagePath(asset) {
  return new URL(asset, self.location.href).pathname;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith("bus-tycoon-") && key !== CACHE).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

/* Network first so page updates arrive; fall back to the cached copy offline
   or when the server errors. */
function networkFirstPage(event, request, asset) {
  const cacheKey = pagePath(asset);
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(asset, copy));
          return response;
        }
        return caches.match(cacheKey).then((hit) => hit || response);
      })
      .catch(() => caches.match(cacheKey).then((hit) => hit || caches.match(request)))
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  for (const asset of PAGE_FILES) {
    if (url.pathname === pagePath(asset) || url.pathname === pagePath(asset) + "/") {
      networkFirstPage(event, request, asset);
      return;
    }
  }

  if (CORE_PATHS.has(url.pathname)) {
    event.respondWith(
      caches.match(request).then((hit) => {
        if (hit) return hit;
        return fetch(request).then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});
