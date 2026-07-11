const CACHE = {
  STATIC: "faro-static-v1",
  API: "faro-api-v1",
  PAGES: "faro-pages-v1",
};

const QUEUE_DB = "faro-offline-queue";
const QUEUE_STORE = "requests";

// ---- IndexedDB queue helpers ----

async function openQueueDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(QUEUE_DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(QUEUE_STORE, { autoIncrement: true });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function addToQueue(entry) {
  const db = await openQueueDB();
  const tx = db.transaction(QUEUE_STORE, "readwrite");
  tx.objectStore(QUEUE_STORE).add(entry);
  await new Promise((r) => (tx.oncomplete = r));
}

async function getQueue() {
  const db = await openQueueDB();
  const tx = db.transaction(QUEUE_STORE, "readonly");
  const store = tx.objectStore(QUEUE_STORE);
  return new Promise((resolve) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}

async function getQueueCount() {
  const db = await openQueueDB();
  const tx = db.transaction(QUEUE_STORE, "readonly");
  const store = tx.objectStore(QUEUE_STORE);
  return new Promise((resolve) => {
    const req = store.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
}

async function clearQueue() {
  const db = await openQueueDB();
  const tx = db.transaction(QUEUE_STORE, "readwrite");
  tx.objectStore(QUEUE_STORE).clear();
  await new Promise((r) => (tx.oncomplete = r));
}

async function replayQueue() {
  const items = await getQueue();
  if (!items.length) return { replayed: 0, failed: 0 };

  let replayed = 0;
  let failed = 0;

  for (const entry of items) {
    try {
      const response = await fetch(entry.url, {
        method: entry.method,
        headers: entry.headers,
        body: entry.body,
      });
      if (!response.ok) {
        failed++;
        continue;
      }
      replayed++;
    } catch {
      // If still offline or request fails, keep it in the queue
      return { replayed, failed: items.length - replayed };
    }
  }

  await clearQueue();
  return { replayed, failed };
}

async function notifyClients(type, data) {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage({ type, ...data });
  }
}

// ---- Install & Activate ----

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

// ---- Cache strategies ----

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

// ---- Fetch handler ----

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // POST / mutating requests: try network first, queue on failure
  if (request.method !== "GET") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          try {
            const clone = request.clone();
            const body = await clone.text();
            await addToQueue({
              url: request.url,
              method: request.method,
              headers: Object.fromEntries(request.headers.entries()),
              body,
              timestamp: Date.now(),
            });
            const count = await getQueueCount();
            notifyClients("QUEUE_UPDATED", { count });
            if ("sync" in self.registration) {
              self.registration.sync.register("faro-replay-queue");
            }
          } catch {}
          return new Response(null, { status: 503, statusText: "Queued for retry" });
        }
      })(),
    );
    return;
  }

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

// ---- Background Sync ----

self.addEventListener("sync", (event) => {
  if (event.tag === "faro-replay-queue") {
    event.waitUntil(
      (async () => {
        const result = await replayQueue();
        await notifyClients("QUEUE_REPLAYED", result);
        const remaining = await getQueueCount();
        if (remaining > 0 && "sync" in self.registration) {
          self.registration.sync.register("faro-replay-queue");
        }
        await notifyClients("QUEUE_UPDATED", { count: remaining });
      })(),
    );
  }
});

// ---- Message from client ----

self.addEventListener("message", (event) => {
  const { data } = event;
  if (!data || !data.action) return;

  event.waitUntil(
    (async () => {
      if (data.action === "GET_QUEUE_COUNT") {
        const count = await getQueueCount();
        event.source.postMessage({ type: "QUEUE_UPDATED", count });
      }

      if (data.action === "RETRY_QUEUE") {
        const result = await replayQueue();
        event.source.postMessage({ type: "QUEUE_REPLAYED", ...result });
        const remaining = await getQueueCount();
        event.source.postMessage({ type: "QUEUE_UPDATED", count: remaining });
      }
    })(),
  );
});
