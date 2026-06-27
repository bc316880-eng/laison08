import {

initializeApp

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";


import {

getAuth,

createUserWithEmailAndPassword,

signInWithPopup,

GoogleAuthProvider

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


import {

getDatabase,

ref,

set

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";





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



const app = initializeApp(firebaseConfig);


const auth = getAuth(app);


const db = getDatabase(app);



const googleProvider =
new GoogleAuthProvider();



function loader(estado){


document.getElementById("loader")
.style.display = estado ? "flex" : "none";


}





// CADASTRO


document
.getElementById("registerForm")
.addEventListener("submit", async(e)=>{


e.preventDefault();


loader(true);



const name =
document.getElementById("name").value;


const email =
document.getElementById("email").value;


const password =
document.getElementById("password").value;




try{


const result =

await createUserWithEmailAndPassword(

auth,

email,

password

);



const user =
result.user;



await set(

ref(
db,

"users/"+user.uid

),

{


profile:{


name:name,


email:email,


createdAt:Date.now()


},


ia:{


mensagens:30,


ultimaRenovacao:Date.now()


},


wallet:{


coins:0


},


personagens:{},


chats:{}



}



);



window.location.href="home.html";



}catch(error){


alert(error.message);


}



loader(false);



});







// GOOGLE LOGIN



document
.getElementById("google")
.addEventListener("click", async()=>{


loader(true);



try{


const result =

await signInWithPopup(

auth,

googleProvider

);



const user =
result.user;



await set(

ref(
db,

"users/"+user.uid

),

{


profile:{


name:user.displayName,


email:user.email,


createdAt:Date.now()


},


ia:{


mensagens:30,


ultimaRenovacao:Date.now()


},


wallet:{


coins:0


}


}

);



window.location.href="home.html";



}catch(error){


alert(error.message);


}



loader(false);



});