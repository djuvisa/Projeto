
async function criarConta(){
    let nome = document.getElementById('nome').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;

    if(!nome || !email || !senha){
        alert("Erro: Todos os campos são obrigatórios!");
        return;
    }

    const usuario = {nome: nome, email: email, ssenha: senha};

     window.location.href = "tela4.html"; 
     return true;

}