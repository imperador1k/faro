const CACHE = {
  STATIC: "faro-static-v1",
  API: "faro-api-v1",
  PAGES: "faro-pages-v1",
};

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE.STATIC && k !== CACHE.API && k !== CACHE.PAGES)
          .map((k) => caches.delete(k)),
      );
      await clients.claim();
    })(),
  );
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return cached;
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Return a minimal offline fallback for page navigations
    if (request.destination === "document") {
      return new Response(
        "<html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Faro</title><style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc;color:#0f172a;text-align:center;padding:2rem}div{max-width:400px}h1{font-size:1.5rem;margin-bottom:0.5rem}p{color:#475569;line-height:1.5}</style></head><body><div><h1>Sem ligacao a internet</h1><p>As funcionalidades offline estao disponiveis mas algumas acoes precisam de rede.</p></div></body></html>",
        { headers: { "Content-Type": "text/html;charset=UTF-8" } },
      );
    }
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || (await fetchPromise);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Navigation requests: network-first, fallback to cache
  if (request.destination === "document" || request.mode === "navigate") {
    event.respondWith(networkFirst(request, CACHE.PAGES));
    return;
  }

  // Next.js static assets (JS, CSS, fonts): cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/fonts/") ||
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font"
  ) {
    event.respondWith(cacheFirst(request, CACHE.STATIC));
    return;
  }

  // Images and media: cache-first
  if (
    request.destination === "image" ||
    request.destination === "video" ||
    request.destination === "audio" ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|mp4|mp3|webm|woff2?)$/)
  ) {
    event.respondWith(cacheFirst(request, CACHE.STATIC));
    return;
  }

  // API calls: network-first, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, CACHE.API));
    return;
  }
});
