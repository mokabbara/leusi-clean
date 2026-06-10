/**
 * LEUSI AI — Service Worker (Phase 1, frontend-only)
 *
 * Strategy:
 *   - Pre-cache the app shell on install (index.html, manifest, icons).
 *   - Network-first for the AI Worker (NEVER cache AI responses).
 *   - Cache-first for static assets (icons, manifest).
 *   - Stale-while-revalidate for Wikimedia images (so lessons work offline once seen).
 *   - Offline fallback: return the cached index.html for navigation requests.
 *
 * Important: AI calls (https://leusi-ai.moekab.workers.dev) are deliberately
 *   bypassed by the cache so users always get fresh AI responses and so a
 *   stale cache can never break the AI integration.
 */

const VERSION = 'leusi-v1.0.0';
const APP_CACHE = `${VERSION}-shell`;
const IMG_CACHE = `${VERSION}-images`;

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
];

const AI_BACKEND_HOSTS = [
  'leusi-ai.moekab.workers.dev',
];

// ─── Install ────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) =>
      // addAll fails fast; use individual add() with catch so a missing icon
      // doesn't break the whole install.
      Promise.all(
        SHELL_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn('[SW] skip', url, err.message))
        )
      )
    )
  );
  self.skipWaiting();
});

// ─── Activate ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch ──────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return; // never cache POST / API calls

  const url = new URL(request.url);

  // 1) AI Worker — ALWAYS network, never cache.
  if (AI_BACKEND_HOSTS.includes(url.hostname)) {
    return; // let the browser handle it normally
  }

  // 2) Wikimedia educational images — stale-while-revalidate
  if (url.hostname === 'upload.wikimedia.org') {
    event.respondWith(staleWhileRevalidate(request, IMG_CACHE));
    return;
  }

  // 3) Same-origin navigation requests — network first, fallback to cached index.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('./index.html').then((c) => c || Response.error())
      )
    );
    return;
  }

  // 4) Other same-origin assets — cache first, then network.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // 5) Cross-origin (CDN) — network first.
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

// ─── Helpers ────────────────────────────────────────────────
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached || (await networkPromise) || Response.error();
}

// ─── Messaging (optional, for skipWaiting from page) ────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
