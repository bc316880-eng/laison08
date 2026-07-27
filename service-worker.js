/*
=========================
 LAISON SERVICE WORKER
=========================
*/


const CACHE_NAME = "laison-v2";



const FILES_TO_CACHE = [
  
  "./",
  
  "./index.html",
  "./chat.html",
  "./login.html",
  
  "./manifest.json"
  
];






/*
=========================
 INSTALAR NOVA VERSÃO
=========================
*/


self.addEventListener(
  "install",
  (event) => {
    
    
    event.waitUntil(
      
      caches.open(CACHE_NAME)
      
      .then(
        (cache) => {
          
          
          return cache.addAll(
            FILES_TO_CACHE
          );
          
          
        })
      
    );
    
    
    self.skipWaiting();
    
    
  });







/*
=========================
 ATIVAR E LIMPAR CACHE ANTIGO
=========================
*/


self.addEventListener(
  "activate",
  (event) => {
    
    
    event.waitUntil(
      
      caches.keys()
      
      .then(
        (cacheNames) => {
          
          
          return Promise.all(
            
            cacheNames.map(
              
              (cache) => {
                
                
                if (
                  cache !== CACHE_NAME
                ) {
                  
                  return caches.delete(cache);
                  
                }
                
                
              })
            
          );
          
          
        })
      
    );
    
    
    self.clients.claim();
    
    
  });







/*
=========================
 BUSCAR ARQUIVOS
=========================
*/


self.addEventListener(
  "fetch",
  (event) => {
    
    
    event.respondWith(
      
      fetch(event.request)
      
      .catch(
        
        () => {
          
          
          return caches.match(
            event.request
          );
          
          
        })
      
    );
    
    
  });