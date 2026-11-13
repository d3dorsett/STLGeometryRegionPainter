/* STL Geometry Region Painter — offline shell v1.20-pwa2.
 * Change CACHE_VERSION whenever any required app file changes.
 * An update installs atomically; an unsuccessful install leaves the previous
 * active worker/cache intact. New workers wait for old tabs to close.
 */
const CACHE_VERSION = 'stl-region-painter-v1.20-pwa2';
const REQUIRED_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './vendor/three/three.module.js',
  './vendor/three/addons/controls/OrbitControls.js',
  './vendor/three/addons/loaders/STLLoader.js',
  './vendor/jszip/jszip.esm.js'
];
const CACHE_PREFIX = 'stl-region-painter-';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    try {
      // Explicit fetches bypass HTTP cache to avoid mixing old and new versions.
      for (const path of REQUIRED_FILES) {
        const request = new Request(new URL(path, self.registration.scope), {cache: 'reload'});
        const response = await fetch(request);
        if (!response.ok || response.type === 'opaque') {
          throw new Error(`Failed to cache ${path}: HTTP ${response.status}`);
        }
        await cache.put(request, response);
      }
    } catch (error) {
      await caches.delete(CACHE_VERSION);
      throw error;
    }
    // Do not call skipWaiting: keep the previous version serving open tabs.
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_VERSION)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  // Only serve known app-shell resources; never cache user STL/3MF data.
  // Match known shell paths without query strings (e.g. ?utm_source=...).
  // The cache lookup below also ignores the search string.
  const allowed = REQUIRED_FILES.some(path => new URL(path, self.registration.scope).pathname === url.pathname);
  if (!allowed) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(event.request, {ignoreSearch: true});
    if (cached) return cached;
    return fetch(event.request);
  })());
});
