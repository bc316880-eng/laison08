// ===============================
// LAISON SERVICE WORKER
// ===============================

const CACHE_NAME = "laison-v1";


const FILES_TO_CACHE = [
  
  "./",
  "./index.html",
  "./style.css",
  "./chatboot.js",
  "./manifest.json",
  
  "./icon-192.png",
  "./icon-512.png"
  
];


// Instalar

self.addEventListener("install", event => {
  
  event.waitUntil(
    
    caches.open(CACHE_NAME)
    
    .then(cache => {
      
      return cache.addAll(FILES_TO_CACHE);
      
    })
    
  );
  
});


// Ativar e limpar cache antigo

self.addEventListener("activate", event => {
  
  event.waitUntil(
    
    caches.keys()
    
    .then(keys => {
      
      return Promise.all(
        
        keys.map(key => {
          
          if (key !== CACHE_NAME) {
            
            return caches.delete(key);
            
          }
          
        })
        
      );
      
    })
    
  );
  
});


// Buscar arquivos

self.addEventListener("fetch", event => {
  
  
  event.respondWith(
    
    caches.match(event.request)
    
    .then(response => {
      
      return response || fetch(event.request);
      
    })
    
  );
  
  
});