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
        pontuacao INTEGER DEFAULT 0,
        fotoPerfil BLOB 
    )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS progresso (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            unidade INTEGER,
            quiz_concluido BOOLEAN DEFAULT 0,
            FOREIGN KEY (usuario_id) REFERENCES Usuario(idUsuario)
        )

    `);
});

export default db;