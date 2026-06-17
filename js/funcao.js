const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');

const URL_API_CADASTRO = 'http://localhost:3000/api/usuarios';
const URL_API_LOGIN = 'http://localhost:3000/api/login';
const URL_API_TAREFA = 'http://localhost:3000/api/tarefas';

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

//TELA AGENDA

const modalTarefa = document.getElementById('modalTarefa');
const adicionarTarefa = document.getElementById('adicionarTarefa');
const criarTarefa = document.getElementById('criarTarefa');

const disciplina = document.getElementById('disciplina');
const descricao = document.getElementById('descricao');
const dataAtual = document.getElementById('dataAtual');
const dataEntrega = document.getElementById('dataEntrega');

// Abre a sobreposição ao clicar no botão
if (adicionarTarefa && modalTarefa) {
adicionarTarefa.addEventListener('click', () => {
    modalTarefa.style.display = 'block';
});
}
if(modalTarefa){
    modalTarefa.addEventListener('click',() =>{
        modalTarefa.style.display = 'none';
    });
}
//Fecha a sobreposição ao enviar tarefa
if (criarTarefa) {
criarTarefa.addEventListener('click', async (event) => {
    console.log('Botão clicado');
    event.preventDefault();

    const disciplinaValor = disciplina.value.trim();
    const descricaoValor = descricao.value.trim();
    const dataAtualValor = dataAtual.value.trim();
    const dataEntregaValor = dataEntrega.value.trim();  

     if (!disciplinaValor || !descricaoValor || !dataAtualValor || !dataEntregaValor) {
        alert("Preencha todos os campos!");
        return;
    }

    const tarefa = {
        disciplina: disciplinaValor,  
        descricao: descricaoValor,    
        dataAtual: dataAtualValor,   
        dataEntrega: dataEntregaValor
    };

    const modalPai = window.parent.document.getElementById('modalTarefa');
        if (modalPai) {
        modalPai.style.display = 'none';
        }
        if (modalTarefa) {
        modalTarefa.style.display = 'none';
}

    console.log('Vai chamar enviarTarefa');
    await enviarTarefa(tarefa);

    document.getElementById('formTarefa').reset();
});
}
//Enviando a tarefa para o banco
async function enviarTarefa(tarefa){
    try {
        const resposta = await fetch(URL_API_TAREFA, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarefa)
        });
        const resultado = await resposta.json();

        if (resposta.ok) {
            alert('Tarefa Criada!');
            mostrarTarefas()
        } else {
            alert('Erro: ' + (resultado.mensagem || 'Não foi possível salvar tarefa'));
        }
    } catch (erro) {
        alert('Não foi possível conectar ao servidor.');
    }
}


//Pegar as tarefas do banco
async function mostrarTarefas() {
    try{
        const resposta = await fetch(URL_API_TAREFA);
        const dados = await resposta.json();

        const listaTarefas = window.parent.document.getElementById('semana') || document.getElementById('semana'); //linha feita pela IA como correção de erros encontrados.

        if (listaTarefas) {
            listaTarefas.innerHTML = '';

           dados.forEach(item => {

            // Atribuindo os valores do objeto 'item' para as suas variáveis // Linhas feitas por IA
            const disciplinaValor = item.disciplina;
            const descricaoValor = item.descricao;
            const dataAtualValor = new Date(item.dataAtual);
            const dataEntregaValor = new Date(item.dataEntrega);

            const diferencaEmMilissegundos = dataEntregaValor - dataAtualValor; 
            const diferencaEmDias = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));
            const tempoLimite = diferencaEmDias + " dias";
                
            const corFundo = diferencaEmDias <= 3 ? '#ff0000' : (diferencaEmDias <= 7 ? '#ffff00' : '#008000');
                     listaTarefas.innerHTML += `
                     <li style="background-color: ${corFundo};">${disciplinaValor} - 
                     ${descricaoValor} - 
                     ${tempoLimite} - 
                     <button onclick="carregarEdicao('${item.id}')">✎</button> -
                     <button onclick="excluirTarefa('${item.id}')">🗑</button></li>`;

        });
    }
     } catch (erro) {
        console.error('Erro ao buscar o dado:', erro);
  }
}
document.addEventListener("DOMContentLoaded", mostrarTarefas);


async function excluirTarefa(id) {
    if(!confirm("Tem certeza que deseja excluir essa tarefa?")){
        return;
    }
    try{
        const resposta = await fetch(`${URL_API_TAREFA}/${id}`,{
            method: 'DELETE'
        });
        if(resposta.ok){
            alert("Tarefa excluida");
            window.parent.mostrarTarefas();
        }else{
            alert("Não foi possivel excluir a tarefa");
        }
    }catch (erro) {
        console.error('Não foi possível conectar ao servidor.');
}
}

function carregarEdicao(id){
    const iframe = document.getElementById('paginaTarefa');
    const modal = document.getElementById('modalTarefa');
    
    if(iframe) iframe.src = `tela12.html?id=${id}`;
    if(modal) modal.style.display = 'block';
}

let idAtual = null;

//Função feita com IA
function iniciarPagina(){
    const parametrosDaURL = new URLSearchParams(window.location.search);
    const idEdicao = parametrosDaURL.get('id');

   if (idEdicao) {
        idAtual = idEdicao; // Guarda o ID na variável global
        editarTarefa(idAtual); // Chama a função que preenche os dados (Passo 3)
    } else {
        idAtual = null; // Garante que está vazio se for uma nova tarefa
        document.getElementById('formTarefa').reset()
    }
}

async function editarTarefa(id){
    if(!confirm("Deseja atualizar essa tarefa?")){
        return;
    }
    try{

        const resposta = await fetch(URL_API_TAREFA + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify()
        });
        const resultado = await resposta.json();

        if (resposta.ok) {
            alert('Tarefa Atualizada!');
        } else {
            alert('Erro: ' + (resultado.mensagem || 'Não foi possível atualizar tarefa'));
        }
    } catch (erro) {
        alert('Não foi possível conectar ao servidor.');
    }
}