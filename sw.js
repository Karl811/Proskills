/* =========================================================
   PROSKILLS · SERVICE WORKER (một cho toàn bộ ứng dụng)
   - Khi phát hành bản mới: đổi VERSION cho trùng APP_VER trong config.js.
   - Mạng trước, bộ nhớ sau: có mạng luôn lấy bản mới nhất; mất mạng mở bản đã lưu.
   - Mọi tệp của module được lưu tự động sau lần mở đầu tiên có mạng.
   - Không bao giờ đụng tới bài làm (localStorage) của học viên.
   ========================================================= */
'use strict';
const VERSION = 'PS1.3.27';
const BASE = new URL(self.registration.scope);
const PREFIX = 'proskills-' + encodeURIComponent(BASE.pathname) + '-';
const SHELL = PREFIX + 'shell-' + VERSION;
const RUNTIME = PREFIX + 'runtime';
const CORE = [
  './', 'index.html', 'offline.html', 'config.js', 'manifest.webmanifest',
  'core/core.js', 'core/core.css', 'core/pwa.js',
  'hub/hub.js', 'hub/lich.js', 'hub/hub.css',
  'icons/logo.svg', 'icons/app-192.png', 'icons/app-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png',
  'routine/index.html', 'routine/proskills.js?v=' + VERSION
];
/* Shin Routine (routine/): tải sẵn chạy ngầm khi cài service worker, để đóng dấu được cả khi mất mạng.
   Bộ nhớ riêng theo phiên bản Shin: chỉ tải lại khi đổi ROUTINE_VER (trùng APP_VER trong routine/scripts/core.js
   và các ?v= trong routine/index.html). Thêm/bớt tệp trong routine/ thì sửa danh sách này. */
const ROUTINE_VER = 'M.Claude.3.3.41';
const ROUTINE = PREFIX + 'routine-' + ROUTINE_VER;
const ROUTINE_FILES = [
  "assets/breathing/exhale.mp3",
  "assets/breathing/hills.svg",
  "assets/breathing/hold.mp3",
  "assets/breathing/inhale.mp3",
  "assets/breathing/night.svg",
  "assets/breathing/river.svg",
  "assets/fonts/bvp-latin-400.woff2",
  "assets/fonts/bvp-latin-500.woff2",
  "assets/fonts/bvp-latin-600.woff2",
  "assets/fonts/bvp-latin-700.woff2",
  "assets/fonts/bvp-latin-ext-400.woff2",
  "assets/fonts/bvp-latin-ext-500.woff2",
  "assets/fonts/bvp-latin-ext-600.woff2",
  "assets/fonts/bvp-latin-ext-700.woff2",
  "assets/fonts/bvp-vietnamese-400.woff2",
  "assets/fonts/bvp-vietnamese-500.woff2",
  "assets/fonts/bvp-vietnamese-600.woff2",
  "assets/fonts/bvp-vietnamese-700.woff2",
  "assets/fonts/dancing-script-regular.ttf",
  "assets/fonts/material-symbols-0.woff2",
  "assets/fonts/noto-sans-jp-0.woff2",
  "assets/fonts/nunito-latin-ext.woff2",
  "assets/fonts/nunito-latin.woff2",
  "assets/fonts/nunito-vietnamese.woff2",
  "assets/fonts/roboto-flex-latin-ext.woff2",
  "assets/fonts/roboto-flex-latin.woff2",
  "assets/fonts/roboto-flex-vietnamese.woff2",
  "assets/game/habit-game.css",
  "assets/game/habit-game.js",
  "assets/game/matter-0.19.0.min.js",
  "assets/touch/circle-check.svg",
  "assets/touch/circle-minus.svg",
  "boot.js",
  "design-game.css",
  "design-system.css",
  "design-system.js",
  "habit-game.html",
  "icon-192.png",
  "icon-512.png",
  "scripts/core.js",
  "scripts/extensions.js",
  "scripts/habits.js",
  "scripts/how-visual.js",
  "scripts/interaction.js",
  "scripts/interface.js",
  "scripts/rules-v2.js",
  "styles/base.css",
  "styles/components.css",
  "styles/extensions.css",
  "styles/fonts39.css",
  "styles/habits.css"
].map(p => 'routine/' + p + (/\.(?:js|css)$/.test(p) ? '?v=' + ROUTINE_VER : ''));
const abs = p => new URL(p, BASE).href;

self.addEventListener('install', event => {
  event.waitUntil(Promise.all([
    caches.open(SHELL).then(cache =>
      Promise.all(CORE.map(p => cache.add(new Request(abs(p), { cache: 'reload' })).catch(() => null)))),
    warmRoutine()
  ]));
});
/* tải Shin Routine vào bộ nhớ riêng; tệp đã có thì bỏ qua, tệp lỗi thì để lần sau */
async function warmRoutine() {
  try {
    const cache = await caches.open(ROUTINE);
    await Promise.all(ROUTINE_FILES.map(async p => {
      const url = abs(p);
      if (await cache.match(url)) return;
      try { const r = await fetch(new Request(url, { cache: 'reload' })); if (r && r.ok) await cache.put(url, r); } catch (e) {}
    }));
  } catch (e) {}
}
async function routineReady() {
  try { const c = await caches.open(ROUTINE); const k = await c.keys(); return k.length >= ROUTINE_FILES.length; } catch (e) { return false; }
}
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== SHELL && k !== RUNTIME && k !== ROUTINE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('message', event => {
  const t = event.data && event.data.type;
  /* ACTIVATE_UPDATE: Proskills · SKIP_WAITING: nút "Cập nhật" trong Shin Routine */
  if (t === 'ACTIVATE_UPDATE' || t === 'SKIP_WAITING') event.waitUntil(self.skipWaiting());
  /* Shin Routine hỏi đã sẵn sàng mở khi mất mạng chưa */
  else if (t === 'GET_STATUS' && event.ports && event.ports[0]) {
    const port = event.ports[0];
    event.waitUntil(routineReady().then(ok => { if (!ok) warmRoutine(); port.postMessage({ coreReady: ok, version: VERSION }); }));
  }
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
