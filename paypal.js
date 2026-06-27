import {

getAuth

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


import {

getDatabase,

ref,

get,

update

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";



import {

initializeApp

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";





const firebaseConfig={


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





let mensagensComprar = 0;

let valorComprar = 0;





window.abrirPagamento=function(){


document.getElementById(

"sectionPagamento"

).style.display="flex";


}





window.fecharPagamento=function(){


document.getElementById(

"sectionPagamento"

).style.display="none";


}







window.comprarPacote=function(qtd,valor){



mensagensComprar = qtd;


valorComprar = valor;



criarPayPal();



}







function criarPayPal(){



document.getElementById(

"paypal-button-container"

).innerHTML="";





paypal.Buttons({



createOrder(data,actions){


return actions.order.create({


purchase_units:[


{


amount:{


value:valorComprar


}



}

]


});



},







async onApprove(data,actions){



await actions.order.capture();





const user =
auth.currentUser;




const caminho =

ref(

db,

"users/"+user.uid+"/ia"

);





const snap =

await get(caminho);





let atual = 0;




if(snap.exists()){


atual =

snap.val().mensagens || 0;


}





atual += mensagensComprar;







await update(

caminho,


{


mensagens:atual


}


);






alert(

"Compra concluída! +" +

mensagensComprar +

" mensagens"

);





fecharPagamento();



}






}).render(

"#paypal-button-container"

);



}