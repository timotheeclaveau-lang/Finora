// Finora : s'ouvre depuis le cache (sans internet) et se met à jour en arrière-plan
const V="finora-v4.1";
const FILES=["./","./index.html","./manifest.webmanifest","./icon-180.png","./icon-192.png","./icon-512.png","./confidentialite.html","./cookies.html","./conditions.html","./mentions-legales.html","./accessibilite.html"];
// tout est sur ce site : aucun appel à un autre serveur
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES).then(()=>c.addAll(["./lib/pdfjs/pdf.min.js","./lib/pdfjs/pdf.worker.min.js"]).catch(()=>{}))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;const u=new URL(req.url);if(u.origin!==location.origin)return;
  const key=req.mode==="navigate"&&/\/$|index\.html$/.test(u.pathname)?"./index.html":req;
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(key,{ignoreSearch:true});
    const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==="opaque"))c.put(key,r.clone());return r}).catch(()=>hit);
    return hit||net;
  }));
});
