var inputName = document.getElementById('inputName');
var inputPassword = document.getElementById('inputPassword');
var inputLogin = document.getElementById('inputLogin');
// let conteudo = document.getElementById('conteudo');

function registrar() {
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
    firebase.auth().signInWithEmailAndPassword(inputName.value, inputPassword.value).then((user) => {
        // Signed in
        // ...
        carregarConteudo();
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
}

