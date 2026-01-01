const APP_SHELL_CACHE = "hsc-app-shell-v3";
const RUNTIME_CACHE = "hsc-runtime-v3";
const API_CACHE = "hsc-api-v3";
const APP_SHELL_FILES = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => ![APP_SHELL_CACHE, RUNTIME_CACHE, API_CACHE].includes(cacheName))
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || !request.url.startsWith("http")) {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkWithCacheFallback(request, API_CACHE));
    return;
  }

  if (request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          cacheResponse(APP_SHELL_CACHE, request, response.clone());
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkWithCacheFallback(request, RUNTIME_CACHE));
});

self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(retryFailedRequests());
  }
});

self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New achievement unlocked! Keep up the great work.",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    vibrate: [100, 50, 100],
    data: {
      timestamp: Date.now(),
      url: "/dashboard"
    }
  };

  event.waitUntil(
    self.registration.showNotification("HSC Learning", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const existingClient = clientList.find((client) => client.url.includes(targetUrl));
      if (existingClient) {
        return existingClient.focus();
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data?.type === "GET_CACHE_SIZE") {
    getCacheSize().then((size) => event.ports[0].postMessage({ cacheSize: size }));
  }
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    cacheResponse(RUNTIME_CACHE, request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    if (request.destination === "image") {
      return new Response("", { status: 503, statusText: "Offline" });
    }
    throw error;
  }
}

async function networkWithCacheFallback(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    cacheResponse(cacheName, request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    if (request.destination === "document") {
      return caches.match("/offline.html");
    }
    throw error;
  }
}

function cacheResponse(cacheName, request, response) {
  caches.open(cacheName).then((cache) => cache.put(request, response));
}

async function retryFailedRequests() {
  console.log("retryFailedRequests placeholder triggered");
}

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let total = 0;
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    total += keys.length;
  }
  return total;
}
