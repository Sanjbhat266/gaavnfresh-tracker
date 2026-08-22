var CACHE = 'gaavn-stock-v5';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})); }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  var url = e.request.url;
  if(url.indexOf('script.google.com')>=0){ return; }
  if(url.indexOf('.html')>=0 || url.endsWith('/') ){
    e.respondWith(fetch(e.request,{cache:'no-store'}).catch(function(){ return caches.match(e.request); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(c){ return c || fetch(e.request); }));
});
