// 앱 껍데기만 저장한다. API 요청과 외부 주소는 건드리지 않는다.
const CACHE = "memotter-mwwd1td8";
const SHELL = ["./", "app.js", "styles.css", "manifest.webmanifest", "icon.svg", "logo.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("memotter-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return r;
  }).catch(async () => (await caches.match(e.request)) || Response.error()));
});
