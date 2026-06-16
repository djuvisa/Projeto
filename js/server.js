// Importação das bibliotecas necessárias
// A ideia da base do codigo foi feita por IA
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const path = require('path');


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..')));

// Inicializar banco de dados SQLite
const dbPath = path.join(__dirname, '..', 'data.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    inicializarBancoDados();
  }
});

// Rotas do banco de dados

function hashSenha(senha) {
  return crypto.createHash('sha256').update(senha).digest('hex');
}
//
// Função para inicializar o banco de dados
function inicializarBancoDados() {
// tabela usuat
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela usuarios:', err);
    } else {
      console.log('Tabela usuarios verificada/criada com sucesso');
    }
  });
 // Tabela tarefas
  db.run(`
    CREATE TABLE IF NOT EXISTS tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  disciplina TEXT NOT NULL,
  descricao TEXT NOT NULL,
  dataAtual TEXT NOT NULL,
  dataEntrega TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
)
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela tarefas:', err);
    } else {
      console.log('Tabela tarefas verificada/criada com sucesso');
    }
  });
}
// Rotas da API

// GET - Listar todos os usuários
app.get('/api/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios', (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET - Buscar usuário por ID
app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
      return;
    }
    res.json(row);
  });
});

// POST - Criar novo usuário
app.post('/api/usuarios', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    return;
  }

  const senhaHash = hashSenha(senha);
  const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  db.run(sql, [nome, email, senhaHash], function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, nome, email });
  });
});
// POST - Criar tarefa
app.post('/api/tarefas', (req, res) => {
   console.log('Recebido:', req.body);
  const { disciplina, descricao, dataAtual, dataEntrega } = req.body;

  const sql = `
    INSERT INTO tarefas
    (disciplina, descricao, dataAtual, dataEntrega)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [disciplina, descricao, dataAtual, dataEntrega],
    function(err) {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        disciplina,
        descricao,
        dataAtual,
        dataEntrega
      });
    }
  );
});

app.get('/api/tarefas', (req, res) => {
  db.all('SELECT * FROM tarefas ORDER BY criado_em DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows); // Entrega a lista de tarefas salva para o seu frontend
  });
});


// DELETE - Deletar tarefa
app.delete('/api/tarefas/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tarefas WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ erro: 'Tarefa não encontrado' });
      return;
    }
    res.json({ mensagem: 'Tarefa excluida com sucesso' });
  });
});

// POST - Fazer login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    return;
  }

  const senhaHash = hashSenha(senha);
  db.get('SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?', [email, senhaHash], (err, row) => {
    if (err) {
      res.status(500).json({ mensagem: err.message });
      return;
    }

    if (!row) {
      res.status(401).json({ mensagem: 'Email ou senha inválidos' });
      return;
    }

    res.json({ mensagem: 'Login realizado com sucesso', usuario: row });
  });
});

// POST - Verificar se o usuário já está cadastrado
app.post('/api/login/verificar', (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ erro: 'O ID do usuário é obrigatório' });
    return;
  }

  if (usuariosLogados.has(Number(id))) {
    res.status(409).json({ erro: 'Este e-mail já possui uma conta cadastrada' });
    return;
  }

  usuariosLogados.add(Number(id));
  res.json({ mensagem: 'Sessão iniciada com sucesso!' });
});

// DELETE - Deletar usuário
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM usuarios WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
      return;
    }
    res.json({ mensagem: 'Usuário deletado com sucesso' });
  });
});

// Rota raiz - Servir tela1.html como página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'tela1.html'));
});

// Rota para servir as telas
app.get('/tela/:numero', (req, res) => {
  const numero = req.params.numero;
  res.sendFile(path.join(__dirname, '..', `tela${numero}.html`));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Tratar erro ao fechar a conexão com banco de dados
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar o banco de dados:', err);
    } else {
      console.log('Banco de dados fechado');
    }
    process.exit(0);
  });
});
