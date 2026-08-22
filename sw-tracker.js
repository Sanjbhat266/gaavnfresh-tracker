var CACHE='gaavn-tracker-v164';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})); }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  var url=e.request.url;
  if(url.indexOf('script.google.com')>=0 || url.indexOf('googleapis')>=0){ return; } // never cache sheet/api calls
  if(e.request.method!=='GET'){ return; }
  if(url.indexOf('.html')>=0 || url.endsWith('/')){
    // network-first for the app shell so updates flow, cache fallback for offline
    e.respondWith(
      fetch(e.request,{cache:'no-store'}).then(function(r){
        var c=r.clone(); caches.open(CACHE).then(function(cache){ cache.put(e.request,c); }); return r;
      }).catch(function(){ return caches.match(e.request); })
    );
    return;
  }
  // cache-first for other assets (fonts, cdn libs)
  e.respondWith(caches.match(e.request).then(function(c){
    return c || fetch(e.request).then(function(r){ var cc=r.clone(); caches.open(CACHE).then(function(cache){ try{cache.put(e.request,cc);}catch(x){} }); return r; }).catch(function(){ return c; });
  }));
});
