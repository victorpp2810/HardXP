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
  const { nome, email, cpf} = req.body;

  db.run(
    `UPDATE Usuario SET nome = ?, email = ?, cpf = ? WHERE idUsuario = ?`,
    [nome, email, cpf, id],
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

    res.setHeader("Content-Type", "image/jpeg");
    res.end(row.fotoPerfil); 
  });
});

rotas.post("/progresso", (req, res) => {
  const { usuarioId, unidade } = req.body;

  if (!usuarioId || !unidade) {
    return res.status(400).json({ message: "Dados incompletos." });
  }

  db.run(
    `INSERT OR REPLACE INTO progresso (usuario_id, unidade, quiz_concluido)
     VALUES (?, ?, 1)`,
    [usuarioId, unidade],
    (err) => {
      if (err) {
        console.error("Erro ao salvar progresso:", err);
        return res.status(500).json({ message: "Erro ao salvar progresso." });
      }
      res.json({ success: true });
    }
  );
});



rotas.get("/progresso/:usuarioId/:unidade", (req, res) => {
  const usuarioId = Number(req.params.usuarioId);
  const unidade = Number(req.params.unidade);

  // Unidade 1 sempre liberada
  if (unidade === 1) {
    return res.json({ acesso: true });
  }

  db.get(
    `SELECT quiz_concluido FROM progresso
     WHERE usuario_id = ? AND unidade = ?`,
    [usuarioId, unidade - 1],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao verificar progresso." });
      }

      if (row && row.quiz_concluido === 1) {
        return res.json({ acesso: true });
      } else {
        return res.json({ acesso: false });
      }
    }
  );
});



// 🔹 Incrementar XP do usuário
rotas.post("/usuario/:id/adicionarXP", (req, res) => {
  const { id } = req.params;
  const { xp } = req.body;

  if (xp == null || xp < 0) {
    return res.status(400).json({ message: "XP inválido." });
  }

  db.run(
    `UPDATE Usuario 
     SET pontuacao = COALESCE(pontuacao, 0) + ?
     WHERE idUsuario = ?`,
    [xp, id],
    function (err) {
      if (err) {
        console.error("Erro ao atualizar XP:", err);
        return res.status(500).json({ message: "Erro ao atualizar XP." });
      }

      res.json({ success: true, xpGanho: xp });
    }
  );
});

// rota única e robusta para stats
rotas.get("/usuario/:id/stats", (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: "ID inválido" });

  const stats = {
    pontuacao: 0,
    quizzes: 0,
    etapas: 0,
    porcentagem: 0,
    ultimaAtividade: null,
    ranking: null
  };

  // 1) Pontuação
  db.get(`SELECT COALESCE(pontuacao,0) AS pontuacao FROM Usuario WHERE idUsuario = ?`, [id], (err, row) => {
    if (err) {
      console.error("stats: erro pontuacao:", err);
      return res.status(500).json({ message: "Erro ao buscar pontuação", detail: err.message });
    }
    stats.pontuacao = row ? Number(row.pontuacao) : 0;

    // 2) Quizzes concluídos (total)
    db.get(
      `SELECT COUNT(*) AS totalQuizzes FROM progresso WHERE usuario_id = ? AND quiz_concluido = 1`,
      [id],
      (err2, r2) => {
        if (err2) {
          console.error("stats: erro totalQuizzes:", err2);
          return res.status(500).json({ message: "Erro ao contar quizzes", detail: err2.message });
        }
        stats.quizzes = r2 ? Number(r2.totalQuizzes) : 0;

        // 3) Unidades concluídas (distintas)
        db.get(
          `SELECT COUNT(DISTINCT unidade) AS totalEtapas FROM progresso WHERE usuario_id = ? AND quiz_concluido = 1`,
          [id],
          (err3, r3) => {
            if (err3) {
              console.error("stats: erro totalEtapas:", err3);
              return res.status(500).json({ message: "Erro ao contar etapas", detail: err3.message });
            }
            stats.etapas = r3 ? Number(r3.totalEtapas) : 0;

            // 4) ultima atividade (mais recente)
            db.get(
              `SELECT unidade, id, quiz_concluido FROM progresso WHERE usuario_id = ? AND quiz_concluido = 1 ORDER BY id DESC LIMIT 1`,
              [id],
              (err4, r4) => {
                if (err4) {
                  console.error("stats: erro ultimaAtividade:", err4);
                  return res.status(500).json({ message: "Erro ao buscar última atividade", detail: err4.message });
                }
                stats.ultimaAtividade = r4 ? r4.unidade : null;

                // 5) ranking (posição baseado em pontuacao)
                db.all(
                  `SELECT idUsuario, COALESCE(pontuacao,0) AS pontuacao FROM Usuario ORDER BY pontuacao DESC`,
                  [],
                  (err5, rows) => {
                    if (err5) {
                      console.error("stats: erro ranking:", err5);
                      return res.status(500).json({ message: "Erro ao calcular ranking", detail: err5.message });
                    }

                    const pos = Array.isArray(rows) ? rows.findIndex(r => Number(r.idUsuario) === Number(id)) : -1;
                    stats.ranking = pos === -1 ? null : pos + 1;

                    // 6) porcentagem: cuidado — precisa do total de unidades da plataforma
                    //  Ajuste TOTAL_UNIDADES conforme seu conteúdo real
                    const TOTAL_UNIDADES = 10;
                    stats.porcentagem = TOTAL_UNIDADES > 0 ? Math.round((stats.etapas / TOTAL_UNIDADES) * 100) : 0;

                    // tudo OK: retornar stats
                    return res.json(stats);
                  }
                ); // db.all ranking
              }
            ); // db.get ultimaAtividade
          }
        ); // db.get totalEtapas
      }
    ); // db.get totalQuizzes
  }); // db.get pontuacao
});





export default rotas;