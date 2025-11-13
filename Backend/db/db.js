import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./db/Hardxp.db", (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Conectado ao banco do HardXP.");
});


db.run("PRAGMA foreign_keys = ON");

db.serialize(() => {
    // Tabela Usuario
    //arrumar para a foto de perfil ficar pré definida, o usuário muda depois
    db.run(`
    CREATE TABLE IF NOT EXISTS Usuario (
        idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT,
        senha TEXT,
        cpf TEXT,
        pontuacao REAL,
        fotoPerfil BLOB 
    )
    `);


    // Tabela Curso
    db.run(`
        CREATE TABLE IF NOT EXISTS Curso (
            idCurso INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT
        )
    `);

    // Tabela Quiz
    db.run(`
        CREATE TABLE IF NOT EXISTS Quiz (
            idQuiz INTEGER PRIMARY KEY AUTOINCREMENT,
            pergunta TEXT,
            resposta TEXT
        )
    `);

    // Tabela Conteudo
    db.run(`
        CREATE TABLE IF NOT EXISTS Conteudo (
            idConteudo INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            texto TEXT,
            Curso_idCurso INTEGER NOT NULL,
            FOREIGN KEY (Curso_idCurso) REFERENCES Curso(idCurso)
        )
    `);

    // Tabela Usuario_has_Curso
    db.run(`
        CREATE TABLE IF NOT EXISTS Usuario_has_Curso (
            Usuario_idUsuario INTEGER NOT NULL,
            Curso_idCurso INTEGER NOT NULL,
            PRIMARY KEY (Usuario_idUsuario, Curso_idCurso),
            FOREIGN KEY (Usuario_idUsuario) REFERENCES Usuario(idUsuario),
            FOREIGN KEY (Curso_idCurso) REFERENCES Curso(idCurso)
        )
    `);

    // Tabela funcionarios
    db.run(`
        CREATE TABLE IF NOT EXISTS funcionarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            data_admissao DATE NOT NULL,
            email TEXT
        )
    `);

    // Tabela tarefas
    db.run(`
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            data_inicio DATE,
            data_fim DATE,
            prioridade INTEGER NOT NULL DEFAULT 3,
            descricao TEXT
        )
    `);
});

export default db;