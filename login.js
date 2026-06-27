import {

initializeApp

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";


import {

getAuth,

signInWithEmailAndPassword,

signInWithPopup,

GoogleAuthProvider

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";



import {

getDatabase,

ref,

get,

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


const provider =
new GoogleAuthProvider();





function loader(status){


document.getElementById("loader")
.style.display = status ? "flex" : "none";


}





// LOGIN EMAIL


document
.getElementById("loginForm")
.addEventListener("submit",async(e)=>{


e.preventDefault();


loader(true);



const email =
document.getElementById("email").value;


const password =
document.getElementById("password").value;




try{


await signInWithEmailAndPassword(

auth,

email,

password

);



window.location.href="home.html";



}catch(error){


alert(error.message);


}



loader(false);



});








// LOGIN GOOGLE


document
.getElementById("google")
.addEventListener("click",async()=>{


loader(true);



try{


const result =

await signInWithPopup(

auth,

provider

);



const user =
result.user;




const usuario =

await get(

ref(

db,

"users/"+user.uid

)

);





if(!usuario.exists()){



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



}



window.location.href="home.html";



}catch(error){


alert(error.message);


}



loader(false);



});