// quizzes.js — detecta unidade atual consultando /progresso/:usuarioId/:unidade
document.addEventListener("DOMContentLoaded", async () => {
  const usuarioIdRaw = localStorage.getItem("id");
  const usuarioId = usuarioIdRaw ? Number(usuarioIdRaw) : null;
  if (!usuarioId) {
    window.location.href = "login.html";
    return;
  }

  const quizzes = [
    { titulo: "Componentes Básicos do PC", unidade: 1, perguntas: 10, xp: 10000, imagem: "../Frontend/images/quizzes/hardware-basico.jpg", link: "./quizzes/quiz01.html" },
    { titulo: "Placa-Mãe e Conectores", unidade: 2, perguntas: 12, xp: 10000, imagem: "../Frontend/images/quizzes/placa-mae.jpg", link: "./quizzes/quiz02.html" },
    { titulo: "Memórias e Armazenamento", unidade: 3, perguntas: 10, xp: 10000, imagem: "../Frontend/images/quizzes/memoria.jpg", link: "./quizzes/quiz03.html" },
    { titulo: "Fontes e Energia", unidade: 4, perguntas: 8, xp: 10000, imagem: "../Frontend/images/quizzes/fonte.jpg", link: "./quizzes/quiz04.html" },
    { titulo: "Processadores e Threads", unidade: 5, perguntas: 15, xp: 10000, imagem: "../Frontend/images/quizzes/processadores.jpg", link: "./quizzes/quiz05.html" },
    { titulo: "Montagem do PC", unidade: 6, perguntas: 10, xp: 10000, imagem: "../Frontend/images/quizzes/montagem.jpg", link: "./quizzes/quiz06.html" },
    { titulo: "BIOS e Configuração Inicial", unidade: 7, perguntas: 10, xp: 10000, imagem: "../Frontend/images/quizzes/bios.jpg", link: "./quizzes/quiz07.html" },
    { titulo: "Manutenção e Diagnóstico", unidade: 8, perguntas: 12, xp: 10000, imagem: "../Frontend/images/quizzes/manutencao.jpg", link: "./quizzes/quiz08.html" },
    { titulo: "Segurança de Hardware", unidade: 9, perguntas: 15, xp: 10000, imagem: "../Frontend/images/quizzes/seguranca.jpg", link: "./quizzes/quiz09.html" },
    { titulo: "Periféricos e Interfaces", unidade: 10, perguntas: 8, xp: 10000, imagem: "../Frontend/images/quizzes/perifericos.jpg", link: "./quizzes/quiz10.html" },
    { titulo: "Refrigeração e Desempenho", unidade: 11, perguntas: 10, xp: 10000, imagem: "../Frontend/images/quizzes/refrigeracao.jpg", link: "./quizzes/quiz11.html" }
  ];

  const container = document.getElementById("quizzesGrid");
  if (!container) {
    console.error("Elemento #quizzesGrid não encontrado.");
    return;
  }
  container.innerHTML = "";

  // Faz GET /progresso/:usuarioId/:unidade e retorna boolean (acesso)
  async function acessoParaUnidade(unidade) {
    try {
      const res = await fetch(`http://localhost:2000/progresso/${usuarioId}/${unidade}`);
      if (!res.ok) {
        console.warn(`GET /progresso ${unidade} retornou status ${res.status}`);
        return false;
      }
      const j = await res.json();
      return Boolean(j.acesso);
    } catch (err) {
      console.error("Erro fetch progresso:", err);
      return false;
    }
  }

  // Determina a UNIDADE ATUAL do usuário (a menor unidade acessível que não está marcada como concluída)
  // Estratégia:
  // Para k = 1..N:
  //   acessoK = acessoParaUnidade(k)         (se false -> k está bloqueada, não deve ser atual)
  //   acessoKplus = acessoParaUnidade(k+1)   (se true -> k já foi concluída, então continue)
  //   se acessoK === true && acessoKplus === false => k é a unidade atual
  // Se todas as k tiverem acessoKplus true, retorna última unidade disponível (N) — isso cobre caso todas concluídas.
  async function detectarUnidadeAtual(maxUnidades) {
    for (let k = 1; k <= maxUnidades; k++) {
      const acessoK = await acessoParaUnidade(k);
      // se unidade k nem ao menos é acessível, ela não pode ser atual (usuário ainda não liberou k)
      if (!acessoK) {
        // Isso geralmente só acontece se usuário estiver antes da unidade 1 (não deveria) — continue para segurança
        continue;
      }
      // verifica se próxima unidade já está acessível (então k está concluída)
      const acessoKplus = await acessoParaUnidade(k + 1);
      if (!acessoKplus) {
        // k é acessível e k+1 não -> k é a unidade atual a realizar
        return k;
      }
      // caso contrário, a próxima já liberada => k já concluída, continuar loop
    }
    // fallback: se tudo liberado, retorna última unidade (max)
    return maxUnidades;
  }

  const unidadeAtual = await detectarUnidadeAtual(quizzes.length);
  console.log("Unidade atual detectada:", unidadeAtual);

  // Monta os cards — libera somente o quiz cuja unidade === unidadeAtual
  quizzes.forEach(q => {
    const liberado = q.unidade === unidadeAtual;

    const card = document.createElement("div");
    card.className = "course-card";

    card.innerHTML = `
      <div class="course-image"><img src="${q.imagem}" alt="${q.titulo}" onerror="this.src='./img/quizzes/placeholder.png'"></div>
      <div class="course-content">
        <span class="course-category">${q.categoria || "Geral"}</span>
        <h3 class="course-title">${q.titulo}</h3>
        <p class="course-description">${q.perguntas} perguntas — vale <b>${q.xp} XP</b></p>
        <button class="course-btn ${liberado ? "" : "locked"}" ${liberado ? `onclick="window.location.href='${q.link}'"` : "disabled"}>
          ${liberado ? "Iniciar Quiz ▶" : "Bloqueado 🔒"}
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  // Carrega header do usuário (nome, cpf, pontuação)
  try {
    const resUser = await fetch(`http://localhost:2000/${usuarioId}/usuario`);
    if (resUser.ok) {
      const user = await resUser.json();
      const nameEl = document.getElementById("userName");
      const cpfEl = document.getElementById("userLevel");
      const xpEl = document.getElementById("userXP");
      if (nameEl) nameEl.textContent = user.nome || "Usuário";
      if (cpfEl) cpfEl.textContent = `CPF: ${user.cpf || "indefinido"}`;
      if (xpEl) xpEl.textContent = `${user.pontuacao ?? 0} XP`;
    } else {
      console.warn("Não foi possível carregar dados do usuário (status " + resUser.status + ")");
    }
  } catch (err) {
    console.error("Erro ao carregar usuário:", err);
  }

  // foto do usuário (fallback)
  try {
    const resFoto = await fetch(`http://localhost:2000/usuario/${usuarioId}/foto`);
    if (resFoto.ok) {
      const blob = await resFoto.blob();
      const imgEl = document.getElementById("userPhoto");
      if (imgEl) imgEl.src = URL.createObjectURL(blob);
    } else {
      const imgEl = document.getElementById("userPhoto");
      if (imgEl) imgEl.src = "./img/avatar/default.png";
    }
  } catch {
    const imgEl = document.getElementById("userPhoto");
    if (imgEl) imgEl.src = "./img/avatar/default.png";
  }
});
