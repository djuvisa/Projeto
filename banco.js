const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados
const dbPath = path.join(__dirname, '../database/boaPergunta.db');

// Criar ou conectar ao banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite3.');
        inicializarBanco();
    }
});

// scripts que podem ser alterados 

// Função para inicializar o banco de dados
function inicializarBanco() {
    db.serialize(() => {
        // Tabela de Usuários
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
                data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar tabela usuarios:', err.message);
            } else {
                console.log('Tabela usuarios criada/verificada com sucesso.');
            }
        });

        // Tabela de Disciplinas
        db.run(`
            CREATE TABLE IF NOT EXISTS disciplinas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL UNIQUE,
                descricao TEXT,
                data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar tabela disciplinas:', err.message);
            } else {
                console.log('Tabela disciplinas criada/verificada com sucesso.');
            }
        });

        // Tabela de Inscrições em Disciplinas
        db.run(`
            CREATE TABLE IF NOT EXISTS inscricoes_disciplinas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                disciplina_id INTEGER NOT NULL,
                data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
                FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
                UNIQUE(usuario_id, disciplina_id)
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar tabela inscricoes_disciplinas:', err.message);
            } else {
                console.log('Tabela inscricoes_disciplinas criada/verificada com sucesso.');
            }
        });

        // Tabela de Agenda/Eventos
        db.run(`
            CREATE TABLE IF NOT EXISTS agenda (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                titulo TEXT NOT NULL,
                descricao TEXT,
                data_hora DATETIME NOT NULL,
                disciplina_id INTEGER,
                criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
                atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
                FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar tabela agenda:', err.message);
            } else {
                console.log('Tabela agenda criada/verificada com sucesso.');
            }
        });

        // Inserir disciplinas padrão
        inserirDisciplinasDefault();
    });
}

// Função para inserir disciplinas padrão
function inserirDisciplinasDefault() {
    const disciplinas = [
        { nome: 'Design de Interface', descricao: 'Na matéria de Design de Interface, você aprende a projetar a ponte visual e interativa entre o usuário e um produto digital. O objetivo é tornar essa navegação intuitiva, esteticamente agradável e acessível.' },
        { nome: 'Programação Web', descricao: 'A programação web ensina a criar, estruturar e gerenciar sites e sistemas que funcionam diretamente nos navegadores de internet.' },
        { nome: 'Banco de Dados', descricao: 'A disciplina de Banco de Dados ensina os fundamentos essenciais para armazenar, organizar, manipular e recuperar informações em sistemas computacionais.' }
    ];

    disciplinas.forEach(disciplina => {
        db.run(
            `INSERT OR IGNORE INTO disciplinas (nome, descricao) VALUES (?, ?)`,
            [disciplina.nome, disciplina.descricao],
            (err) => {
                if (err) {
                    console.error(`Erro ao inserir disciplina ${disciplina.nome}:`, err.message);
                } else {
                    console.log(`Disciplina "${disciplina.nome}" inserida/verificada com sucesso.`);
                }
            }
        );
    });
}

// Exportar a conexão do banco de dados
module.exports = db;
