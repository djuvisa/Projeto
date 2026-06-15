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

    modalTarefa.style.display = 'none';
    await enviarTarefa(tarefa); //Deve enviar a tarefa para o banco 
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
        } else {
            alert('Erro: ' + (resultado.mensagem || 'Não foi possível salvar tarefa'));
        }
    } catch (erro) {
        alert('Não foi possível conectar ao servidor.');
    }
}

//Pegar as tarefas do banco
async function mostrarTarefas(tarefa) {
    try{
        const resposta = await fetch(URL_API_TAREFA);
        const dados = await resposta.json();

        const tempoLimite = dataEntrega - dataAtual;

        document.getElementById('semana').innerHTML = '';

        dados.forEach(item => {

            // Atribuindo os valores do objeto 'item' para as suas variáveis
            const disciplinaValor = item.disciplina;
            const descricaoValor = item.descricao;
            const dataAtualValor = new Date(item.dataAtual);
            const dataEntregaValor = new Date(item.dataEntrega);

            const diferencaEmMilissegundos = dataEntregaValor - dataAtualValor; 
            const diferencaEmDias = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));
            const tempoLimite = diferencaEmDias + " dias";


            let corFundo = '';
            if(diferencaEmDias >= 0 && diferencaEmDias < 3){
                                 corFundo.style.backgroudColor = 'red';
            }
            else if(diferencaEmDias < 5){
                semanaTarefa = "semana2"
            }
            else if(diferencaEmDias < 7){
                semanaTarefa = "semana3"
            }
                const listaTarefas = document.getElementById(semanaTarefa);
                if(listaTarefas){
                     listaTarefas.innerHTML += `
                     <li style="${corFundo}">${disciplinaValor} - 
                     {descricaoValor} - 
                     {tempoLimite} - 
                     <button onclick="editarTarefa('${item.id}')">✎</button> -
                     <button onclick="excluirTarefa('${item.id}')">🗑</button></li>`;
                }
        });

        } catch (erro) {
        console.error('Erro ao buscar o dado:', erro);
  }
}


async function exluirTarefa(id) {
    if(!confirm("Tem certeza que deseja excluir essa tarefa?")){
        return;
    }
    try{
        const resposta = await fetch(`${URL_API_TAREFA}\${id}`,{
            method: 'DELETE'
        });
        if(resposta.ok){
            alert("Tarefa excluida");
            mostrarTarefas();
        }else{
            alert("Não foi possivel excluir a tarefa");
        }
    }catch (erro) {
        console.error('Não foi possível conectar ao servidor.');
}
}

async function editarTarefa(id){
    if(!confirm("Deseja atualizar essa tarefa?")){
        return;
    }
    try{
        const resposta = await fetch(URL_API_TAREFA, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarefa)
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