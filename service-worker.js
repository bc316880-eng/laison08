
const CACHE_NAME = "laison-v3";


const FILES_TO_CACHE = [


"index.html",

"home.html",

"chat.html",

"perfil.html",

"friends.html",



"style.css",

"chat.css",



"script.js",

"chat.js",



"manifest.json",



"icon.png",

"icon-192.png",

"icon-512.png"


];





/*
=========================
 INSTALAÇÃO
=========================
*/


self.addEventListener(
"install",
event=>{


event.waitUntil(


caches.open(CACHE_NAME)

.then(cache=>{


return cache.addAll(
FILES_TO_CACHE
);


})


);



self.skipWaiting();


});







/*
=========================
 ATIVAÇÃO
=========================
*/


self.addEventListener(
"activate",
event=>{


event.waitUntil(


caches.keys()

.then(
(cacheNames)=>{


return Promise.all(


cacheNames.map(
(cache)=>{


if(
cache !== CACHE_NAME
){


return caches.delete(cache);


}


}

)


);


}


)


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
event=>{


event.respondWith(


caches.match(
event.request
)

.then(
(response)=>{


return response || fetch(event.request);


}

)


);


});








/*
=========================
 ATUALIZAÇÃO MANUAL
=========================
*/


self.addEventListener(
"message",
event=>{


if(
event.data === "SKIP_WAITING"
){


self.skipWaiting();


}


});
