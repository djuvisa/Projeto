const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');

 const URL_API_CADASTRO = 'http://localhost:3000/api/usuarios';

async function criarConta(){
    let nome = inputNome.value;
    let email = inputEmail.value;
    let senha = inputSenha.value;

    if(!nome || !email || !senha){
        alert("Erro: Todos os campos são obrigatórios!");
        return;
    }

    const usuario = {nome: nome, email: email, senha: senha};

    try {
        const resposta = await fetch(URL_API_CADASTRO, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Conta criada com sucesso!");
            window.location.href = "tela4.html"; 
        } else {
            alert("Erro: " + (resultado.mensagem || "Erro ao cadastrar"));
        }
    } catch (erro) {
        alert("Não foi possível conectar ao servidor.");
    }

}

async function fazerLogin(){
    let email = inputEmail.value;
    let senha = inputSenha.value;

    if(!email || !senha){
        alert("Erro: Todos os campos são obrigatórios!");
        return;
    }

    //Código gerado pela IA a partir do prompt 'Como conectar o código acima com banco de dados SQLITLE pelo node
    const usuario = {email: email, senha: senha};

     try {
        // Envia os dados para o seu servidor Node.js
        const resposta = await fetch(URL_API_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            window.location.href = "tela4.html"; 
        } else {
            alert("Erro: " + resultado.mensagem);
        }
    } catch (erro) {
        alert("Não foi possível conectar ao servidor.");
    }

}