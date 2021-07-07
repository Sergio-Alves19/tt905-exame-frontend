function submitTask(){
    const form = document.forms['task_form'];
    const task = form["task"].value;
    const materia = form["materia"].value;
    const data_conclusao = form["data_conclusao"].value;
    const status = form["status"].value;

    const select = document.getElementById("taskList").value;
    
    if (select){
        updateFirebase(task, materia, data_conclusao, status, select);
    } else {
        postFirebase(task, materia, data_conclusao, status);
    }
    
    return false;
}

var firebaseConfig = {
    apiKey: "AIzaSyDtPwNR9Al9ia3gfAylfXdk4wZTAkJ1Mvw",
    authDomain: "tt905-exame-b1032.firebaseapp.com",
    databaseURL: "https://tt905-exame-b1032-default-rtdb.firebaseio.com",
    projectId: "tt905-exame-b1032",
    storageBucket: "tt905-exame-b1032.appspot.com",
    messagingSenderId: "157668140701",
    appId: "1:157668140701:web:7d23ab38289030dd581674"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var msgRef = firebase.database().ref('messages');

/*
    CRUD
*/

function postFirebase(task, materia, data_conclusao, status){
    const uid = firebase.auth().currentUser.uid;
    msgRef.child(`${uid}`).push().set(
        {
            task : task,
            materia: materia,
            data_conclusao: data_conclusao,
            status: status
        }
    );
}

function onLoad(){
    // getFromFirebase();
}

function getFromFirebase(){
    const uid = firebase.auth().currentUser.uid;
    msgRef.child(`${uid}`).on(
        'value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const select = document.getElementById("taskList");
                select.innerHTML = "";
                option = document.createElement('option');
                select.appendChild(option);
                for (var [key, value] of Object.entries(data)){
                    option = document.createElement('option');
                    option.value = key;
                    option.innerHTML = value.task;
                    select.appendChild(option);
                }
            }
          }
    );
}

function deleteForm(){
    const select = document.getElementById("taskList").value;
    
    if (select){
        const uid = firebase.auth().currentUser.uid;
        msgRef.child(`${uid}`).child(select).remove();
    }
    return false;
}

function updateFirebase(task, materia, data_conclusao, status, select){
    const uid = firebase.auth().currentUser.uid;
    msgRef.child(`${uid}`).child(select).update(
        {
            task : task,
            materia: materia,
            data_conclusao: data_conclusao,
            status: status
        }
    );
}

/*
    Autenticação
*/

function switchCadastro(){
    document.getElementById("div_login").className="closed";
    document.getElementById("div_cadastro").className="open";
}

function switchLogin(){
    document.getElementById("div_login").className="open";
    document.getElementById("div_cadastro").className="closed";
}

async function logout(){
    try {
        await firebase.auth().signOut();
        const uid = firebase.auth().currentUser.uid;
        msgRef.child(`${uid}`).off('value');
    } catch (error) {
        
    }
    
}

async function submitCadastro(){
    event.preventDefault();

    const form = document.forms["login_form"];

    const email = form.email.value;
    const password = form.senha.value;
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        console.log("Usuário cadastrado com sucesso.");
    } catch (error){
        alert(error.message);
    }
}

async function submitEntrar(){
    event.preventDefault();

    const form = document.forms["login_form"];

    const email = form.email.value;
    const password = form.senha.value;
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log("Usuário logado com sucesso.");
    } catch (error){
        alert(error.message);
    }
}

firebase.auth().onAuthStateChanged((user) => {
    header_form = document.getElementById("header_form");
    logged_user = document.getElementById("logged_user");
    if (user) {
        // Usuário logado
        var uid = user.uid;
        header_form.className = "closed";
        logged_user.className = "open";

        user_span = document.getElementById("user_span");
        user_span.innerHTML = user.email;

        getFromFirebase();

    } else {
        // Usuário deslogado
        header_form.className = "open";
        logged_user.className = "closed";
    }
});