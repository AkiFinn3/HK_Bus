/* Bus Tycoon HK — service worker
   Only handles the game's own assets. Other pages on the site are untouched. */

const CACHE = "bus-tycoon-v3";
const CORE = [
  "./game.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];
const CORE_PATHS = new Set(CORE.map((asset) => new URL(asset, self.location.href).pathname));

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

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isGamePage = url.pathname.endsWith("/game.html") || url.pathname.endsWith("/game.html/");
  const isCore = CORE_PATHS.has(url.pathname);

  if (isGamePage) {
    // Network first so updates arrive; fall back to the cached copy offline or on server errors.
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put("./game.html", copy));
            return response;
          }
          return caches.match("./game.html").then((hit) => hit || response);
        })
        .catch(() => caches.match("./game.html").then((hit) => hit || caches.match(request)))
    );
    return;
  }

  if (isCore) {
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
