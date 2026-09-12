// Service worker de Entrejuegos Eventos.
// Cachea solo el "shell" visual estático (para carga rápida e instalación
// como app). Los datos reales (disponibilidad, reservas, promos) SIEMPRE
// se piden en vivo a Firebase — nunca se sirven desde este cache, para que
// la disponibilidad que ve el cliente sea siempre la real.

const CACHE_NAME = "entrejuegos-shell-v1";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./config.js",
  "./manifest.json",
  "./assets/logo.jpg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
];

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

  // Nunca cachear llamadas a Firebase/Google (datos siempre en vivo).
  if (url.hostname.includes("googleapis") || url.hostname.includes("firebase") || url.hostname.includes("gstatic")) {
    return;
  }

  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => caches.match("./index.html"))
      );
    })
  );
});
