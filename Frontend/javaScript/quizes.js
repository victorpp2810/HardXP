// quizzes.js — detecta unidade atual consultando /progresso/:usuarioId/:unidade
document.addEventListener("DOMContentLoaded", async () => {
  const usuarioIdRaw = localStorage.getItem("id");
  const usuarioId = usuarioIdRaw ? Number(usuarioIdRaw) : null;
  if (!usuarioId) {
    window.location.href = "login.html";
    return;
  }

  const quizzes = [
  { titulo: "Introdução ao Hardware", unidade: 1, perguntas: 10, xp: 10000,
    imagem: "https://www.remessaonline.com.br/blog/wp-content/uploads/2023/10/hardware.jpg",
    link: "./quizzes/quiz01.html" },

  { titulo: "Placa-Mãe e Chipset", unidade: 2, perguntas: 10, xp: 10000,
    imagem: "https://www.intel.com.br/content/dam/www/central-libraries/us/en/images/s2-a9-1-anatomy-of-motherboard-rwd.png.rendition.intel.web.864.486.png",
    link: "./quizzes/quiz02.html" },

  { titulo: "Memórias RAM e ROM", unidade: 3, perguntas: 10, xp: 10000,
    imagem: "https://static.wixstatic.com/media/6b39c8_68af5c66d0cf4e35a0adac8bece492c6~mv2.png/v1/fit/w_452%2Ch_259%2Cal_c/file.png",
    link: "./quizzes/quiz03.html" },

  { titulo: "Armazenamento de Dados", unidade: 4, perguntas: 10, xp: 10000,
    imagem: "https://epraja.com.br/wp-content/uploads/2023/03/ssd-1024x576.png",
    link: "./quizzes/quiz04.html" },

  { titulo: "Processador e Desempenho", unidade: 5, perguntas: 10, xp: 10000,
    imagem: "https://blog.oficinadosbits.com.br/wp-content/uploads/2023/08/3-1024x546.jpg",
    link: "./quizzes/quiz05.html" },

  { titulo: "Fonte de Alimentação", unidade: 6, perguntas: 10, xp: 10000,
    imagem: "https://m.magazineluiza.com.br/a-static/420x420/fonte-alimentacao-pc-computador-atx-500w-110v-230v-50hz-5a-maaxaudio/karflix/1253/d49145890140fd71f198313e831d8232.jpeg",
    link: "./quizzes/quiz06.html" },

  { titulo: "Instalando a CPU e Dissipador", unidade: 7, perguntas: 10, xp: 10000,
    imagem: "https://thumbs.dreamstime.com/b/instalar-um-processador-central-vazio-em-uma-motherboard-cpu-branco-est%C3%A1-instalada-no-conector-da-placa-m%C3%A3e-pc-digital-desy-227267634.jpg",
    link: "./quizzes/quiz07.html" },

  { titulo: "Instalando a Placa-Mãe", unidade: 8, perguntas: 10, xp: 10000,
    imagem: "https://i.ytimg.com/vi/sfUZrY1G22E/maxresdefault.jpg",
    link: "./quizzes/quiz08.html" },

  { titulo: "Instalando Armazenamento e Leitores", unidade: 9, perguntas: 10, xp: 10000,
    imagem: "https://media.kingston.com/kingston/hero/ktc-blog-pc-performance-upgrade-dell-hero-lg.jpg",
    link: "./quizzes/quiz09.html" },

  { titulo: "Conectando Energia e Dados", unidade: 10, perguntas: 10, xp: 10000,
    imagem: "https://img.freepik.com/fotos-premium/homens-seguram-a-mao-para-conectar-o-plugue-de-energia-e-o-cabo-para-a-conexao-de-energia-no-cabo-mae-na-caixa-atx-do-computador_265993-50.jpg",
    link: "./quizzes/quiz10.html" },

  { titulo: "Fechamento e Teste Final", unidade: 11, perguntas: 10, xp: 10000,
    imagem: "https://img.terabyteshop.com.br/produto/g/computador-t-home-crate-intel-core-i3-10100-ddr4-8gb-ssd-240gb_252936.jpg",
    link: "./quizzes/quiz11.html" }
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
      if (imgEl) imgEl.src = "./images/user.png";
    }
  } catch {
    const imgEl = document.getElementById("userPhoto");
    if (imgEl) imgEl.src = "./images/user.png";
  }
});
