const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');

const URL_API_CADASTRO = 'http://localhost:3000/api/usuarios';
const URL_API_LOGIN = 'http://localhost:3000/api/login';

async function criarConta(){
    const nome = inputNome ? inputNome.value.trim() : '';
    const email = inputEmail ? inputEmail.value.trim() : '';
    const senha = inputSenha ? inputSenha.value : '';

    if(!nome || !email || !senha){
        alert('Erro: Todos os campos são obrigatórios!');
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
            alert('Conta criada com sucesso!');
            window.location.href = 'tela4.html';
        } else {
            alert('Erro: ' + (resultado.erro || resultado.mensagem || 'Erro ao cadastrar'));
        }
    } catch (erro) {
        alert('Não foi possível conectar ao servidor.');
    }
}

async function fazerLogin(){
    const email = inputEmail ? inputEmail.value.trim() : '';
    const senha = inputSenha ? inputSenha.value : '';

    if(!email || !senha){
        alert('Erro: Todos os campos são obrigatórios!');
        return;
    }

    const usuario = {email: email, senha: senha};

    try {
        const resposta = await fetch(URL_API_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert('Login realizado com sucesso!');
            window.location.href = 'tela4.html';
        } else {
            alert('Erro: ' + (resultado.mensagem || 'Erro ao fazer login'));
        }
    } catch (erro) {
        alert('Não foi possível conectar ao servidor.');
    }
}