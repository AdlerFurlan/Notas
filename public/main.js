var inputName = document.getElementById('inputName');
var inputPassword = document.getElementById('inputPassword');
var inputLogin = document.getElementById('inputLogin');
// let conteudo = document.getElementById('conteudo');
let userId = '';

function registrar() {
    var inputName = document.getElementById('inputName');
    var inputPassword = document.getElementById('inputPassword');
    firebase.auth().createUserWithEmailAndPassword(inputName.value, inputPassword.value)
      .then((user) => {
        // Signed in
        // ...
        console.log("Registrado com Sucesso!");
        console.log(user);

      }).catch((error) => {

        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ..
    });
}

function autenticar() {
    var inputName = document.getElementById('inputName');
    var inputPassword = document.getElementById('inputPassword');
    firebase.auth().signInWithEmailAndPassword(inputName.value, inputPassword.value).then((user) => {
        // Signed in
        // ...

        userId = user.user.uid;
        carregarConteudo();
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
}


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAaPUdK0tQ2VylOSrYUVjJ7eV6Gsr7JwCs",
    authDomain: "notas-e3083.firebaseapp.com",
    projectId: "notas-e3083",
    storageBucket: "notas-e3083.appspot.com",
    messagingSenderId: "509369719391",
    appId: "1:509369719391:web:59c34e6455eabef11d19ea",
    measurementId: "G-5FX6QCJ1TM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let conteudo = document.getElementById('conteudo');

let loginHTML = `
    <h1>Login</h1>
    <p class="text-muted"> Please enter your login and password!</p>

    <input type="text" name="" placeholder="Username" id="inputName">
    <input type="password" name="" placeholder="Password" id="inputPassword">

    <a class="forgot text-muted" href="#">Forgot password?</a>

    <input type="submit"  onclick="autenticar()" name="" value="Login" href="#" id="inputLogin">
    <input type="submit" onclick="registrar()" name="" value="Register" href="#" id="inputRegister">

    <div class="col-md-12">
        <ul class="social-network social-circle">
            <li><a href="#" class="icoFacebook" title="Facebook"><i class="fab fa-facebook-f"></i></a></li>
            <li><a href="#" class="icoTwitter" title="Twitter"><i class="fab fa-twitter"></i></a></li>
            <li><a href="#" class="icoGoogle" title="Google +"><i class="fab fa-google-plus"></i></a></li>
        </ul>
    </div>
`;
conteudo.innerHTML = loginHTML;

function carregarConteudo() {
    conteudo.classList.remove("box")
    firebase.database().ref(`Notas/${userId}`).once('value').then(snapshot => {
        let dados = snapshot.val();
        console.log(dados);
        let todasDivs = ``;
        for (const key in dados) {
            if (Object.hasOwnProperty.call(dados, key)) {
                const dado = dados[key];
                todasDivs += adicionarNota(dado.titulo, dado.texto, key);
            }
        }

        let notasHTML = `
        <nav class="navbar fixed-top">
            <div class="div-navbar"></div>
        </nav>
        <div class="corpo">
            <div class="div-corpo">
                <div class="notaNova">
                    <h2>Criar nova nota...</h2>
                    <p>Título:</p>
                    <input id="tituloNovo" type="text">
                    <p>Texto:</p>
                    <textarea id="textoNovo" class="texto" type="text" rows="4"></textarea>
                    <button class="btmSalvar" onclick="criarNota()">Salvar Nota</button>
                </div>
                <div class="containerNotas" id="containerNotas">
                    ${todasDivs}
                </div>
            </div>
        </div>`;
        // snapshot.forEach(value => {
        //     console.log({value.});
        // })
        conteudo.innerHTML = notasHTML;
    })

}
function criarNota(){
    let texto = document.getElementById('textoNovo').value;
    let titulo = document.getElementById('tituloNovo').value;
    let novo = document.getElementById('containerNotas');
    let data = Date.now();
    if (texto != null && texto != '' && texto != undefined && titulo != null && titulo != '' && titulo != undefined){
        let cardNovo = {
            "titulo": titulo,
            "texto": texto,
            "data": data,
            "modificacao":''
        };
        const notaId = firebase.database().ref('Notas').push().key;
        firebase.database().ref(`Notas/${userId}/${notaId}`).set(cardNovo).then(()=>{
            console.log('sucesso ao gravar!');
            let divNova = adicionarNota(titulo, texto, notaId);
            novo.insertAdjacentHTML('afterbegin', divNova);
        });
    }
}
function adicionarNota(titulo, texto, key){
    return `
    <div class="notaNova notaCriada" id=${key}>
        <p>${titulo}</p>
        <textarea id="${key}1" onfocus="liberarEdição(event)" onfocusout="tirarEdição(event)" class="texto" type="text" rows="4">${texto}</textarea>
        <div class="botoes">
            <button id="${key}12" value="${key}" onclick="editarNota(event)" class="btmSalvar btmEditar">Editar</button>
            <button value="${key}" onclick="excluirNota(event)" class="btmSalvar btmExcluir">Excluir</button>
        </div>
    </div>
    `;
}
function excluirNota(event){
    console.log(event.target.value);
    firebase.database().ref(`Notas/${userId}/${event.target.value}`).remove().then((result)=>{
        console.log({result});
    });
    let chave = event.target.value;
    console.log(chave);
    let div = document.getElementById(chave);
    div.parentNode.removeChild(div);
}
function editarNota(event){
    modificacao = Date.now();
    firebase.database().ref(`Notas/${userId}/${event.target.value}/modificacao`).set(modificacao).then(()=>{});
    let chave = event.target.value;
    textoNovo = document.getElementById(chave+1).value;
    console.log(textoNovo);
    firebase.database().ref(`Notas/${userId}/${event.target.value}/texto`).set(textoNovo).then(()=>{});
    console.log(modificacao);
}
function liberarEdição(event){
    let chave = event.target.id;
    console.log(chave);
    let botao = document.getElementById(chave+2);
    botao.style.opacity = 1;
}
function tirarEdição(event){
    let chave = event.target.id;
    console.log(chave);
    let botao = document.getElementById(chave+2);
    botao.style.opacity = 0;
}