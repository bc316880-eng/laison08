/*
=========================
 IMPORTAÇÕES FIREBASE
=========================
*/


import {

initializeApp

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";



import {

getAuth,

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";



import {

getDatabase,

ref,

push,

set,

get,

onValue,

update

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";





/*
=========================
 FIREBASE CONFIG
=========================
*/


const firebaseConfig = {


apiKey:
"AIzaSyDsP7lNqu-tDpJxpsyv8t1DW0M_u2EAE3o",


authDomain:
"bartolomeu-cruz.firebaseapp.com",


databaseURL:
"https://bartolomeu-cruz-default-rtdb.firebaseio.com",


projectId:
"bartolomeu-cruz",


storageBucket:
"bartolomeu-cruz.appspot.com",


messagingSenderId:
"408863884951",


appId:
"1:408863884951:web:13e8c2282139c1307dcbd2"


};





const app =
initializeApp(firebaseConfig);



const auth =
getAuth(app);



const db =
getDatabase(app);








/*
=========================
 SUPABASE GROQ
=========================
*/


const SUPABASE_URL =

"https://eqvntuiwxwygtjgaccfa.supabase.co/functions/v1/GROQ";




const SUPABASE_ANON_KEY =

"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxdm50dWl3eHd5Z3RqZ2FjY2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MDM4MDYsImV4cCI6MjEwMDI3OTgwNn0.2IpQGth9u34pJgf5QT5jsUtZsJz_MB6eyx-Xm2Ffcac";









/*
=========================
 CSS DINÂMICO
=========================
*/


const style =
document.createElement("style");



style.textContent = `


.conversation{


display:flex;

flex-direction:column;

gap:5px;

padding:14px;

background:#151515;

border-radius:15px;

margin-bottom:12px;

overflow:hidden;


}



.conversation-title{


font-size:15px;

font-weight:600;

color:white;


}



.conversation-message{


font-size:13px;

color:#999;

white-space:nowrap;

overflow:hidden;

text-overflow:ellipsis;

max-width:220px;


}



.conversation-date{


font-size:11px;

color:#666;


}


`;



document.head.appendChild(style);









/*
=========================
 ELEMENTOS HTML
=========================
*/


const loading =
document.getElementById("loading");



const messages =
document.getElementById("messages");



const input =
document.getElementById("messageInput");



const sendButton =
document.getElementById("sendButton");



const typing =
document.getElementById("typing");



const menu =
document.getElementById("menu");



const overlay =
document.getElementById("overlay");



const conversationList =
document.getElementById("conversationList");



const openMenu =
document.getElementById("openMenu");



const closeMenu =
document.getElementById("closeMenu");



const newChat =
document.getElementById("newChat");








/*
=========================
 VARIÁVEIS GLOBAIS
=========================
*/


let uid = "";


let currentChat = "";
/*
=========================
 LOGIN FIREBASE
=========================
*/

onAuthStateChanged(
auth,
async(user)=>{

if(!user){

window.location.href =
"index.html";

return;

}

uid = user.uid;

await iniciarSistema();

});





/*
=========================
 INICIAR SISTEMA
=========================
*/

async function iniciarSistema(){

loading.style.display = "flex";

const chatsRef =
ref(
db,
`users/${uid}/chats`
);

const snapshot =
await get(chatsRef);

if(!snapshot.exists()){

await criarNovaConversa();

}else{

const chats =
snapshot.val();

const lista =
Object.entries(chats)

.sort(
(a,b)=>

b[1].updatedAt -
a[1].updatedAt

);

currentChat =
lista[0][0];

}

carregarMensagens();

carregarConversas();

loading.style.display =
"none";

}





/*
=========================
 NOVA CONVERSA
=========================
*/

async function criarNovaConversa(){

const chatsRef =
ref(
db,
`users/${uid}/chats`
);

const novo =
push(chatsRef);

currentChat =
novo.key;

await set(
novo,
{

title:
"Nova conversa",

lastMessage:
"",

createdAt:
Date.now(),

updatedAt:
Date.now()

}

);

messages.innerHTML="";

}





/*
=========================
 BOTÃO NOVA CONVERSA
=========================
*/

newChat.onclick =
async()=>{

await criarNovaConversa();

carregarMensagens();

};





/*
=========================
 HISTÓRICO
=========================
*/

function carregarConversas(){

const chatsRef =
ref(
db,
`users/${uid}/chats`
);

onValue(
chatsRef,
(snapshot)=>{

conversationList.innerHTML="";

if(!snapshot.exists())
return;

const chats =
snapshot.val();

Object.entries(chats)

.sort(
(a,b)=>

b[1].updatedAt -
a[1].updatedAt

)

.forEach(
([id,chat])=>{

const item =
document.createElement("div");

item.className =
"conversation";

const data =
new Date(chat.updatedAt);

item.innerHTML = `

<div class="conversation-title">

${chat.title}

</div>

<div class="conversation-message">

${chat.lastMessage || "Sem mensagens"}

</div>

<div class="conversation-date">

${data.toLocaleDateString("pt-PT")}

${data.toLocaleTimeString("pt-PT",{

hour:"2-digit",

minute:"2-digit"

})}

</div>

`;

item.onclick=()=>{

currentChat=id;

carregarMensagens();

menu.classList.remove(
"active"
);

overlay.classList.remove(
"active"
);

};

conversationList.appendChild(
item
);

});

});

}
/*
=========================
 CARREGAR MENSAGENS
=========================
*/

function carregarMensagens(){

if(!currentChat)
return;

const mensagensRef =
ref(
db,
`users/${uid}/chats/${currentChat}/messages`
);

onValue(
mensagensRef,
(snapshot)=>{

messages.innerHTML="";

if(!snapshot.exists())
return;

Object.values(snapshot.val())

.sort(
(a,b)=>
a.time-b.time
)

.forEach(
(msg)=>{

mostrarMensagem(msg);

});

messages.scrollTop =
messages.scrollHeight;

});

}





/*
=========================
 MOSTRAR MENSAGEM
=========================
*/

function mostrarMensagem(msg){

const div =
document.createElement("div");

div.className =
"message " +
(
msg.sender==="user"
?
"user"
:
"ai"
);

const hora =
new Date(msg.time)
.toLocaleTimeString(
"pt-PT",
{
hour:"2-digit",
minute:"2-digit"
}
);

div.innerHTML = `

<div class="text">

${msg.text}

</div>

<div class="time">

${hora}

</div>

`;

messages.appendChild(div);

}





/*
=========================
 HISTÓRICO IA
=========================
*/

async function pegarHistorico(){

const mensagensRef =
ref(
db,
`users/${uid}/chats/${currentChat}/messages`
);

const snapshot =
await get(mensagensRef);

if(!snapshot.exists())
return [];

return Object.values(
snapshot.val()
)

.sort(
(a,b)=>
a.time-b.time
)

.slice(-20)

.map(
(msg)=>({

role:
msg.sender==="user"
?
"user"
:
"assistant",

content:
msg.text

})
);

}





/*
=========================
 ENVIAR MENSAGEM
=========================
*/

sendButton.onclick =
enviarMensagem;

input.addEventListener(
"keydown",
(e)=>{

if(
e.key==="Enter"
&&
!e.shiftKey
){

e.preventDefault();

enviarMensagem();

}

});





async function enviarMensagem(){

const texto =
input.value.trim();

if(!texto)
return;

input.value="";

await salvarMensagem(
"user",
texto
);

typing.style.display=
"flex";

try{

const resposta =
await fetch(
SUPABASE_URL,
{

method:"POST",

headers:{

"Authorization":
"Bearer " +
SUPABASE_ANON_KEY,

"apikey":
SUPABASE_ANON_KEY,

"Content-Type":
"application/json"

},

body:JSON.stringify({

message:
texto,

history:
await pegarHistorico()

})

}

);

if(!resposta.ok){

throw new Error(
"Erro " +
resposta.status
);

}

const dados =
await resposta.json();

typing.style.display=
"none";

await salvarMensagem(
"ai",
dados.reply
);

}
catch(e){

console.error(e);

typing.style.display=
"none";

await salvarMensagem(

"ai",

"Erro ao comunicar com a inteligência artificial."

);

}

}/*
=========================
SALVAR MENSAGEM
=========================
*/

async function salvarMensagem(sender,texto){

if(!currentChat) return;

const mensagensRef =
ref(
db,
`users/${uid}/chats/${currentChat}/messages`
);

const nova =
push(mensagensRef);

await set(
nova,
{
sender:sender,
text:texto,
time:Date.now()
}
);



/*
=========================
RESUMO PARA HISTÓRICO
=========================
*/

let resumo = texto;

if(texto.length > 60){

const limite = 60;

resumo =
texto.substring(0, limite)
+ "...";

}



/*
=========================
ATUALIZAR CONVERSA
=========================
*/

const conversaRef =
ref(
db,
`users/${uid}/chats/${currentChat}`
);

const conversa =
await get(conversaRef);

let titulo = "Nova conversa";

if(conversa.exists()){

titulo =
conversa.val().title ||
"Nova conversa";

}



/* primeira mensagem vira o título */

if(
titulo==="Nova conversa"
&&
sender==="user"
){

titulo =
texto.substring(0,30);

if(texto.length>30){

titulo+="...";

}

}



await update(
conversaRef,
{

title:titulo,

lastMessage:resumo,

updatedAt:Date.now()

}
);

}





/*
=========================
MENU
=========================
*/

openMenu.onclick=()=>{

menu.classList.add("active");

overlay.classList.add("active");

};



closeMenu.onclick=()=>{

menu.classList.remove("active");

overlay.classList.remove("active");

};



overlay.onclick=()=>{

menu.classList.remove("active");

overlay.classList.remove("active");

};





/*
=========================
AUTO ALTURA INPUT
=========================
*/

input.addEventListener(
"input",
()=>{

input.style.height="auto";

input.style.height=
input.scrollHeight+"px";

});





/*
=========================
STATUS ONLINE
=========================
*/

function atualizarStatus(){

const status =
document.getElementById("status");

if(!status) return;

if(navigator.onLine){

status.textContent="Online";

status.style.color="#00ff88";

}else{

status.textContent="Offline";

status.style.color="#ff3333";

}

}

window.addEventListener(
"online",
atualizarStatus
);

window.addEventListener(
"offline",
atualizarStatus
);

atualizarStatus();





/*
=========================
LOADING
=========================
*/

window.addEventListener(
"load",
()=>{

setTimeout(()=>{

loading.style.display="none";

},600);

});





/*
=========================
LUCIDE
=========================
*/

lucide.createIcons();