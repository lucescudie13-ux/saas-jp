// Service worker minimal — rend l'app installable (PWA) et met en cache les
// ressources statiques. IMPORTANT : on ne met JAMAIS en cache le HTML ni les
// requêtes /api (contenu authentifié) pour éviter de servir la page d'un
// utilisateur à un autre. Seuls les assets immuables sont mis en cache.
const CACHE = "hibi-static-v2";
const PRECACHE = ["/icons/icon-192.png", "/icons/icon-512.png", "/logo.webp"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isStatic =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icons") ||
    /\.(png|jpe?g|webp|svg|gif|ico|woff2?|ttf|otf)$/.test(url.pathname);

  if (isStatic) {
    // Cache-first pour les ressources statiques immuables.
    e.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return resp;
        })
      )
    );
  }
  // Tout le reste (HTML, /api, contenu dynamique) : réseau normal, jamais en cache.
});
