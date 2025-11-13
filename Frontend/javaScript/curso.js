// document.addEventListener("DOMContentLoaded", () => {
//   // Dados do curso (pode ser substituído por fetch futuramente)
//   const curso = {
//     titulo: "Hardware Básico",
//     descricao: "Aprenda os fundamentos do hardware: componentes, funções e montagem de computadores.",
//     progresso: 35,
//     unidades: [
//       {
//         titulo: "Introdução ao Hardware",
//         descricao: "O que é hardware e qual sua importância.",
//         xp: 100,
//         status: "concluido",
//         link: "./unidades/unidade01.html"
//       },
//       {
//         titulo: "Placa-Mãe e Chipset",
//         descricao: "Conheça o coração do computador e seus principais conectores.",
//         xp: 100,
//         status: "concluido",
//         link: "./unidades/unidade02.html"
//       },
//       {
//         titulo: "Memórias RAM e ROM",
//         descricao: "Entenda as diferenças e aplicações entre RAM, ROM e caches.",
//         xp: 100,
//         status: "concluido",
//         link: "./unidades/unidade03.html"
//       },
//       {
//         titulo: "Armazenamento de Dados",
//         descricao: "HDs, SSDs e a evolução dos dispositivos de armazenamento.",
//         xp: 100,
//         status: "concluido",
//         link: "./unidades/unidade04.html"
//       },
//       {
//         titulo: "Processador e Desempenho",
//         descricao: "O cérebro do computador: arquitetura, clock e núcleos.",
//         xp: 100,
//         status: "concluido",
//         link: "./unidades/unidade05.html"
//       },
//       {
//         titulo: "Fonte de Alimentação",
//         descricao: "A PSU — o coração elétrico que distribui energia com segurança.",
//         xp: 100,
//         status: "concluido",
//         link: "./unidades/unidade06.html"
//       },
//       {
//         titulo: "Instalando a CPU e Dissipador",
//         descricao: "Como instalar o processador, aplicar pasta térmica e fixar o cooler.",
//         xp: 100,
//         status: "concluido",
//         link: "./unidades/unidade07.html"
//       },
//       {
//         titulo: "Instalando a Placa-Mãe",
//         descricao: "Alinhamento, espaçadores e fixação correta dentro do gabinete.",
//         xp: 100,
//         status: "concluido",
//         link: "./unidades/unidade08.html"
//       },
//       {
//         titulo: "Instalando Armazenamento e Leitores",
//         descricao: "Montagem de SSDs, HDDs e unidades ópticas.",
//         xp: 100,
//         status: "concluido",
//         link: "./unidades/unidade09.html"
//       },
//       {
//         titulo: "Conectando Energia e Dados",
//         descricao: "Instalação dos cabos de energia, dados SATA e painel frontal.",
//         xp: 100,
//         status: "atual",
//         link: "./unidades/unidade10.html"
//       },
//       {
//         titulo: "Fechamento e Teste Final",
//         descricao: "Conecte cabos externos, feche o gabinete e prepare o primeiro boot.",
//         xp: 100,
//         status: "liberado",
//         link: "./unidades/unidade11.html"
//       }
//     ]
//   };

//   // Atualiza título e cabeçalho do curso
//   document.title = `Curso - ${curso.titulo} | HardXP`;

//   const heroSection = document.querySelector(".courses-hero, .course-hero");
//   if (heroSection) {
//     heroSection.innerHTML = `
//       <div class="container">
//         <div class="course-header" style="text-align:center; margin-top:2rem;">
//           <h1 class="hero-title">${curso.titulo}</h1>
//           <p class="hero-description">${curso.descricao}</p>
//           <div class="course-progress" style="max-width:500px; margin:1.5rem auto;">
//             <div class="progress-bar">
//               <div class="progress" style="width: ${curso.progresso}%;"></div>
//             </div>
//             <p class="progress-text">${curso.progresso}% concluído</p>
//           </div>
//         </div>
//       </div>
//     `;
//   }

//   // Container das unidades
//   const grid = document.querySelector(".courses-grid");
//   if (!grid) return;
//   grid.innerHTML = "";

//   // Geração dinâmica dos cards das unidades
//   curso.unidades.forEach((u, index) => {
//     const card = document.createElement("div");
//     card.classList.add("course-card");

//     const icone =
//       u.status === "concluido" ? "✅" :
//       u.status === "atual" ? "🔥" :
//       "🔒";

//     const btnClasse =
//       u.status === "concluido" ? "completed" :
//       u.status === "atual" ? "continue" :
//       "locked";

//     const btnTexto =
//       u.status === "concluido" ? "Concluído" :
//       u.status === "atual" ? "Acessar Unidade" :
//       "Bloqueado";

//     card.innerHTML = `
//       <div class="course-content">
//         <span class="course-category">Unidade ${index + 1}</span>
//         <h3 class="course-title">${icone} ${u.titulo}</h3>
//         <p class="course-description">${u.descricao}</p>
//         <div class="course-stats">
//           <span>🎯 ${u.xp} XP</span>
//         </div>
//         <button class="course-btn ${btnClasse}"
//           ${u.status === "liberado" || u.status === "atual" ? `onclick="window.location.href='${u.link}'"` : "disabled"}>
//           ${btnTexto}
//         </button>
//       </div>
//     `;

//     grid.appendChild(card);
//   });

//   // Efeito visual simples de hover
//   const cards = document.querySelectorAll(".course-card");
//   cards.forEach(card => {
//     card.addEventListener("mouseenter", () => card.classList.add("hover"));
//     card.addEventListener("mouseleave", () => card.classList.remove("hover"));
//   });
// });


document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURAÇÃO INICIAL DO CURSO ---
  const curso = {
    titulo: "Hardware Básico",
    descricao: "Aprenda os fundamentos do hardware: componentes, funções e montagem de computadores.",
    unidades: [
      { titulo: "Introdução ao Hardware", link: "./unidades/unidade01.html", xp: 100 },
      { titulo: "Placa-Mãe e Chipset", link: "./unidades/unidade02.html", xp: 100 },
      { titulo: "Memórias RAM e ROM", link: "./unidades/unidade03.html", xp: 100 },
      { titulo: "Armazenamento de Dados", link: "./unidades/unidade04.html", xp: 100 },
      { titulo: "Processador e Desempenho", link: "./unidades/unidade05.html", xp: 100 },
      { titulo: "Fonte de Alimentação", link: "./unidades/unidade06.html", xp: 100 },
      { titulo: "Instalando a CPU e Dissipador", link: "./unidades/unidade07.html", xp: 100 },
      { titulo: "Instalando a Placa-Mãe", link: "./unidades/unidade08.html", xp: 100 },
      { titulo: "Instalando Armazenamento e Leitores", link: "./unidades/unidade09.html", xp: 100 },
      { titulo: "Conectando Energia e Dados", link: "./unidades/unidade10.html", xp: 100 },
      { titulo: "Fechamento e Teste Final", link: "./unidades/unidade11.html", xp: 100 }
    ]
  };

  // --- BUSCAR PROGRESSO SALVO (LOCALSTORAGE) ---
  let progressoSalvo = JSON.parse(localStorage.getItem("progressoHardware")) || {
    concluido: [], // unidades concluídas (índices)
  };

  // --- FUNÇÃO PARA ATUALIZAR E SALVAR PROGRESSO ---
  function atualizarProgresso() {
    const total = curso.unidades.length;
    const concluidas = progressoSalvo.concluido.length;
    const porcentagem = Math.round((concluidas / total) * 100);
    localStorage.setItem("progressoHardware", JSON.stringify(progressoSalvo));
    return porcentagem;
  }

  // --- CALCULAR PROGRESSO ATUAL ---
  const progresso = atualizarProgresso();

  // --- ATUALIZAR CABEÇALHO DO CURSO ---
  document.title = `Curso - ${curso.titulo} | HardXP`;
  const heroSection = document.querySelector(".courses-hero, .course-hero");
  if (heroSection) {
    heroSection.innerHTML = `
      <div class="container">
        <div class="course-header" style="text-align:center; margin-top:2rem;">
          <h1 class="hero-title">${curso.titulo}</h1>
          <p class="hero-description">${curso.descricao}</p>
          <div class="course-progress" style="max-width:500px; margin:1.5rem auto;">
            <div class="progress-bar">
              <div class="progress" style="width: ${progresso}%;"></div>
            </div>
            <p class="progress-text">${progresso}% concluído</p>
          </div>
        </div>
      </div>
    `;
  }

  // --- CRIAR CARDS DE UNIDADES ---
  const grid = document.querySelector(".courses-grid");
  if (!grid) return;
  grid.innerHTML = "";

  curso.unidades.forEach((u, index) => {
    const concluida = progressoSalvo.concluido.includes(index);
    const icone = concluida ? "✅" : "📘";
    const btnTexto = concluida ? "Concluído" : "Acessar Unidade";
    const btnClasse = concluida ? "completed" : "continue";

    const card = document.createElement("div");
    card.classList.add("course-card");
    card.innerHTML = `
      <div class="course-content">
        <span class="course-category">Unidade ${index + 1}</span>
        <h3 class="course-title">${icone} ${u.titulo}</h3>
        <p class="course-description">${u.descricao || ""}</p>
        <div class="course-stats">
          <span>🎯 ${u.xp} XP</span>
        </div>
        <button class="course-btn ${btnClasse}" onclick="window.location.href='${u.link}'">
          ${btnTexto}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  // --- EFEITO HOVER ---
  document.querySelectorAll(".course-card").forEach(card => {
    card.addEventListener("mouseenter", () => card.classList.add("hover"));
    card.addEventListener("mouseleave", () => card.classList.remove("hover"));
  });
});


// --- Função global usada pelas unidades para marcar conclusão ---
window.marcarConcluida = function(indice) {
  let progressoSalvo = JSON.parse(localStorage.getItem("progressoHardware")) || { concluido: [] };

  if (!progressoSalvo.concluido.includes(indice)) {
    progressoSalvo.concluido.push(indice);
    localStorage.setItem("progressoHardware", JSON.stringify(progressoSalvo));
    console.log(`✅ Unidade ${indice + 1} concluída e salva!`);
  }
};


document.addEventListener("DOMContentLoaded", async () => {
  const id = localStorage.getItem("id");
  if (!id) {
    console.warn("Nenhum ID encontrado no localStorage. Redirecionando...");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`http://localhost:2000/${id}/usuario`);
    if (!res.ok) throw new Error("Erro ao buscar dados do usuário.");

    const user = await res.json();

    // Atualiza o header
    document.getElementById("userName").textContent = user.nome || "Usuário";
    document.getElementById("userLevel").textContent = `CPF: ${user.cpf || "indefinido"}`;
    document.getElementById("userXP").textContent = `${user.xp || "0000"} XP`;

    console.log("[usuarioHeader.js] Dados do usuário carregados:", user);
  } catch (err) {
    console.error("[usuarioHeader.js] Erro ao carregar usuário:", err);
    document.getElementById("userName").textContent = "Erro ao carregar";
  }

  try {
    const res = await fetch(`http://localhost:2000/usuario/${id}/foto`);
    if (!res.ok) throw new Error("Erro ao buscar foto");

    const blob = await res.blob();
    const imageUrl = URL.createObjectURL(blob);

    document.getElementById("userPhoto").src = imageUrl;
  } catch (err) {
    console.error("Erro ao carregar imagem:", err);
  }
});

document.getElementsByClassName("user-profile")[0].addEventListener("click", () => {
  window.location.href = "./usuario.html";
})