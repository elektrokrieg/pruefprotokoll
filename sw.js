// Service Worker - Elektro Krieg Pruefprotokoll
const CACHE_NAME = 'pruefprotokoll-v1.0.0';
const BASE = '/pruefprotokoll/';
const ASSETS = [BASE, BASE + 'index.html', BASE + 'manifest.json', BASE + 'icon-192.png', BASE + 'icon-512.png', BASE + 'apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => Promise.allSettled(ASSETS.map(u => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // version.json immer frisch
  if (url.pathname.endsWith('version.json')) { e.respondWith(fetch(req).catch(() => new Response('{}'))); return; }
  // Seite selbst: erst Netz, sonst Cache (offline)
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE_NAME).then(ca => ca.put(BASE + 'index.html', c)); return r; })
      .catch(() => caches.match(BASE + 'index.html').then(r => r || caches.match(BASE))));
    return;
  }
  e.respondWith(caches.match(req).then(c => c || fetch(req).then(r => {
    if (r && r.status === 200) { const cl = r.clone(); caches.open(CACHE_NAME).then(ca => ca.put(req, cl)); }
    return r;
  })));
});
