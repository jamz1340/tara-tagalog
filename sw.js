/* Offline support. Online: fetch the newest files. Offline or slow: use the saved copy.
   If you add a new file to the app, add it to FILES and change VERSION. */
const VERSION = 'tara-v1';
const FILES = ['./', 'index.html', 'styles.css', 'content-1.js', 'content-2.js', 'content-3.js', 'content-4.js', 'store.js', 'sync.js', 'audio.js', 'exercises.js', 'app.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('tara-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  /* GitHub backup requests and anything off-site are never cached. */
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const saved = await cache.match(e.request, { ignoreSearch: true });
    const network = fetch(e.request, { cache: 'no-cache' }).then(res => { if (res.ok) cache.put(e.request, res.clone()); return res; });
    if (!saved) return network.catch(() => cache.match('index.html'));
    const timeout = new Promise(r => setTimeout(() => r(saved), 2500));
    return Promise.race([network.then(res => (res.ok ? res : saved)).catch(() => saved), timeout]);
  })());
});
