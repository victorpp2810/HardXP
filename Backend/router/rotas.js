import { Router } from "express";
import db from "../db/db.js";

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const rotas = Router();

import fs from "fs";
import path from "path";


rotas.get("/ping", (req , res) => {
    res.json({message: "pong"});
})

rotas.post("/cadastro", function(req, res) {
    const {fullName, email, cpf, password} = req.body;
    if (!fullName || !email || !cpf || !password) {
        return res.status(400).json({message: "Todos os campos devem ser preenchidos."});
    }

    db.run(`INSERT INTO Usuario (nome, email, cpf, senha) VALUES (?, ?, ?, ?)`, [fullName, email, cpf, password], 
        function(err) {

            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT'){
                    if (err.message.includes('cpf')){
                        return res.status(409).json({message: "CPF ja cadastrado."});
                    }
                }
                console.error(err);
                return res.status(500).json({message: "Erro ao cadastrar o usuário."});
            }
            res.status(201).json({message: "Usuário cadastrado com sucesso."});
        }
    );
});

rotas.post("/login", function(req, res) {
    const {email, senha} = req.body;
    if (!email || !senha) {
        return res.status(400).json({message: "Todos os campos devem ser preenchidos."});
    }

    db.get(`SELECT * FROM Usuario WHERE email = ? AND senha = ?`, [email, senha],
        function(err, row) {
            if (err) {
                console.error(err);
                return res.status(500).json({message: "Erro ao fazer login."});
            }
            if (!row) {
                return res.status(401).json({message: "Email ou senha incorretos."});
            } 
            res.status(200).json({message: "Login realizado com sucesso.", 
            usuario: row});

        }
    );
});


rotas.put("/:id/senha", function(req, res) {
    const id = Number(req.params.id);

    const {senha} = req.body;
    if (!senha) {
        return res.status(400).json({message: "Todos os campos devem ser preenchidos."});
    }
    db.run(`UPDATE Usuario SET senha = ? WHERE idUsuario = ?`, [senha, id],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({message: "Erro ao atualizar a senha."});
            }
            res.status(200).json({message: "Senha atualizada com sucesso."});
        }
    );


});

rotas.delete("/:id/delete", function(req, res) {
    const id = Number(req.params.id);
    db.run(`DELETE FROM Usuario WHERE idUsuario = ?`, [id],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({message: "Erro ao excluir o usuário."});
            }
            res.status(200).json({message: "Usuário excluido com sucesso."});
        }
    );
});



rotas.get("/ranking", (req, res) => {
  const query = `
    SELECT nome, pontuacao 
    FROM Usuario 
    ORDER BY pontuacao DESC 
    LIMIT 50
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao carregar o ranking." });
    }

    if (!rows || rows.length === 0) {
      return res.status(200).json([]); // retorna vazio caso ainda não haja pontuações
    }

    res.status(200).json(rows);
  });
});



rotas.get("/:id/usuario", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM Usuario WHERE idUsuario = ?", [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao buscar dados do usuário." });
    }
    if (!row) return res.status(404).json({ message: "Usuário não encontrado." });
    res.json(row);
  });
});

rotas.put("/:id/usuario", (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf, telefone } = req.body;

  db.run(
    `UPDATE Usuario SET nome = ?, email = ?, cpf = ?, telefone = ? WHERE id = ?`,
    [nome, email, cpf, telefone, id],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao atualizar usuário." });
      }
      res.json({ message: "Usuário atualizado com sucesso!" });
    }
  );
});


// 🔹 Upload de foto (com memoryStorage)
rotas.post("/usuario/:id/foto", upload.single("foto"), async (req, res) => {
  try {
    const id = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "Nenhuma imagem enviada." });
    }

    const fotoBuffer = req.file.buffer;

    await db.run("UPDATE Usuario SET fotoPerfil = ? WHERE idUsuario = ?", [fotoBuffer, id]);

    res.json({ success: true, message: "Foto salva no banco com sucesso!" });
  } catch (err) {
    console.error("Erro ao salvar foto:", err);
    res.status(500).json({ message: "Erro ao salvar foto" });
  }
});


rotas.get("/usuario/:id/foto", (req, res) => {
  const id = req.params.id;

  db.get("SELECT fotoPerfil FROM Usuario WHERE idUsuario = ?", [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao buscar foto." });
    }
    if (!row || !row.fotoPerfil) {
      return res.status(404).json({ message: "Foto não encontrada." });
    }

    // retorna o binário da imagem
    res.setHeader("Content-Type", "image/jpeg");
    res.end(row.fotoPerfil); 
  });
});



export default rotas;