// Service worker del panel Entrejuegos — Admin.
// Solo cachea el shell visual, nunca los datos: reservas, juegos, precios,
// etc. siempre se piden en vivo a Firebase.

const CACHE_NAME = "entrejuegos-admin-shell-v1";
const SHELL_FILES = ["./admin.html", "./config.js", "./manifest-admin.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.hostname.includes("googleapis") || url.hostname.includes("firebase") || url.hostname.includes("gstatic")) {
    return;
  }
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match("./admin.html")))
  );
});
