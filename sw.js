/* =========================================================
   PROSKILLS · SERVICE WORKER (một cho toàn bộ ứng dụng)
   - Khi phát hành bản mới: đổi VERSION cho trùng APP_VER trong config.js.
   - Mạng trước, bộ nhớ sau: có mạng luôn lấy bản mới nhất; mất mạng mở bản đã lưu.
   - Mọi tệp của module được lưu tự động sau lần mở đầu tiên có mạng.
   - Không bao giờ đụng tới bài làm (localStorage) của học viên.
   ========================================================= */
'use strict';
const VERSION = 'PS1.3.10';
const BASE = new URL(self.registration.scope);
const PREFIX = 'proskills-' + encodeURIComponent(BASE.pathname) + '-';
const SHELL = PREFIX + 'shell-' + VERSION;
const RUNTIME = PREFIX + 'runtime';
const CORE = [
  './', 'index.html', 'offline.html', 'config.js', 'manifest.webmanifest',
  'core/core.js', 'core/core.css', 'core/pwa.js',
  'hub/hub.js', 'hub/hub.css',
  'icons/logo.svg', 'icons/app-192.png', 'icons/app-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'
];
const abs = p => new URL(p, BASE).href;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(cache =>
    Promise.all(CORE.map(p => cache.add(new Request(abs(p), { cache: 'reload' })).catch(() => null)))
  ));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== SHELL && k !== RUNTIME).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'ACTIVATE_UPDATE') event.waitUntil(self.skipWaiting());
});

async function trim(cache, max) {
  const keys = await cache.keys();
  if (keys.length > max) await Promise.all(keys.slice(0, keys.length - max).map(k => cache.delete(k)));
}
async function fromCache(request) {
  const exact = await caches.match(request);
  if (exact) return exact;
  return caches.match(request, { ignoreSearch: true });
}
async function offlinePage() {
  const r = await caches.match(abs('offline.html'));
  return r || new Response('Bạn đang mất mạng. Hãy kết nối lại để mở lần đầu.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
function networkFirst(event) {
  const request = event.request;
  const net = fetch(request).then(async response => {
    if (response && response.ok && response.type === 'basic') {
      try { const c = await caches.open(RUNTIME); await c.put(request, response.clone()); trim(c, 200); } catch (e) {}
    }
    return response;
  });
  event.waitUntil(net.then(() => undefined, () => undefined));
  return (async () => {
    const cached = await fromCache(request);
    if (!cached) {
      try { return await net; } catch (e) { return request.mode === 'navigate' ? offlinePage() : new Response('', { status: 503 }); }
    }
    let timer;
    const quick = net.then(r => (r && r.ok ? r : cached), () => cached);
    const slow = new Promise(resolve => { timer = setTimeout(() => resolve(cached), 3500); });
    return Promise.race([quick, slow]).finally(() => clearTimeout(timer));
  })();
}
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  if (url.pathname.endsWith('/sw.js')) return;
  event.respondWith(networkFirst(event));
});
