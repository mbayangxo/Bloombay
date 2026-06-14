// BloomBay service worker — v1
// Enables PWA installability. Caching strategy can be enhanced later.

const CACHE = "bloombay-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(["/", "/waitlist", "/about", "/safety"])
    )
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Only intercept same-origin GET requests
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) {
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cache landing pages for offline fallback
        if (res.ok && (e.request.url === self.location.origin + "/" || e.request.url.endsWith("/waitlist"))) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((cached) => cached ?? new Response("Offline", { status: 503 })))
  );
});
