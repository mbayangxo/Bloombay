// Bloombay Service Worker — offline-first for the member portal
const CACHE = "bloombay-v2";

// Shell routes precached on install
const PRECACHE = [
  "/",
  "/member",
  "/member/happenings",
  "/member/plans",
  "/member/clubs",
];

// These paths must always go to the network
const NETWORK_ONLY_PREFIXES = [
  "/api/",
  "/auth/",
  "/_next/webpack-hmr",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== "GET") return;

  // Skip network-only API/auth routes
  if (NETWORK_ONLY_PREFIXES.some((p) => url.pathname.startsWith(p))) return;

  // Skip cross-origin except Supabase storage (images)
  const isSameOrigin = url.origin === self.location.origin;
  const isSupabaseStorage = url.hostname.includes("supabase.co") && url.pathname.includes("/storage/");
  if (!isSameOrigin && !isSupabaseStorage) return;

  // Supabase API requests — network only
  if (url.hostname.includes("supabase.co") && !isSupabaseStorage) return;

  // Next.js static chunks — cache first, then network (immutable)
  if (url.pathname.startsWith("/_next/static/")) {
    e.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }

  // Page navigations — network first, fall back to cached version
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            caches.open(CACHE).then((c) => c.put(request, res.clone()));
          }
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached;
            // Fall back to cached /member shell for any member/* route
            if (url.pathname.startsWith("/member")) {
              return caches.match("/member") ?? new Response("You're offline. Please reconnect to use Bloombay.", { status: 503, headers: { "Content-Type": "text/plain" } });
            }
            return new Response("You're offline.", { status: 503, headers: { "Content-Type": "text/plain" } });
          })
        )
    );
    return;
  }

  // Images and other assets — stale-while-revalidate
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const fetched = fetch(request).then((res) => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        }).catch(() => cached ?? new Response("", { status: 503 }));
        return cached ?? fetched;
      })
    )
  );
});
