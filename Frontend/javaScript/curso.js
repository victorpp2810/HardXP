document.addEventListener("DOMContentLoaded", async () => {
  const curso = {
    titulo: "Hardware Básico",
    descricao: "Aprenda os fundamentos do hardware: componentes, funções e montagem de computadores.",
    unidades: [
      { titulo: "Introdução ao Hardware", link: "./unidades/unidade01.html", imagem:"https://www.remessaonline.com.br/blog/wp-content/uploads/2023/10/hardware.jpg"},
      { titulo: "Placa-Mãe e Chipset", link: "./unidades/unidade02.html", imagem:"https://www.intel.com.br/content/dam/www/central-libraries/us/en/images/s2-a9-1-anatomy-of-motherboard-rwd.png.rendition.intel.web.864.486.png"},
      { titulo: "Memórias RAM e ROM", link: "./unidades/unidade03.html", imagem:"https://static.wixstatic.com/media/6b39c8_68af5c66d0cf4e35a0adac8bece492c6~mv2.png/v1/fit/w_452%2Ch_259%2Cal_c/file.png"},
      { titulo: "Armazenamento de Dados", link: "./unidades/unidade04.html", imagem:"https://epraja.com.br/wp-content/uploads/2023/03/ssd-1024x576.png"},
      { titulo: "Processador e Desempenho", link: "./unidades/unidade05.html", imagem:"https://blog.oficinadosbits.com.br/wp-content/uploads/2023/08/3-1024x546.jpg"},
      { titulo: "Fonte de Alimentação", link: "./unidades/unidade06.html", imagem:"https://m.magazineluiza.com.br/a-static/420x420/fonte-alimentacao-pc-computador-atx-500w-110v-230v-50hz-5a-maaxaudio/karflix/1253/d49145890140fd71f198313e831d8232.jpeg"},
      { titulo: "Instalando a CPU e Dissipador", link: "./unidades/unidade07.html", imagem:"https://thumbs.dreamstime.com/b/instalar-um-processador-central-vazio-em-uma-motherboard-cpu-branco-est%C3%A1-instalada-no-conector-da-placa-m%C3%A3e-pc-digital-desy-227267634.jpg"},
      { titulo: "Instalando a Placa-Mãe", link: "./unidades/unidade08.html", imagem:"https://i.ytimg.com/vi/sfUZrY1G22E/maxresdefault.jpg"},
      { titulo: "Instalando Armazenamento e Leitores", link: "./unidades/unidade09.html", imagem:"https://media.kingston.com/kingston/hero/ktc-blog-pc-performance-upgrade-dell-hero-lg.jpg"},
      { titulo: "Conectando Energia e Dados", link: "./unidades/unidade10.html", imagem:"https://img.freepik.com/fotos-premium/homens-seguram-a-mao-para-conectar-o-plugue-de-energia-e-o-cabo-para-a-conexao-de-energia-no-cabo-mae-na-caixa-atx-do-computador_265993-50.jpg"},
      { titulo: "Fechamento e Teste Final", link: "./unidades/unidade11.html", imagem:"https://img.terabyteshop.com.br/produto/g/computador-t-home-crate-intel-core-i3-10100-ddr4-8gb-ssd-240gb_252936.jpg"}
    ]
  };

  // imagem padrão local (use um path válido no seu projeto)
  const IMAGEM_PADRAO = "./img/cursos/placeholder.png";

  // progresso salvo
  let progressoSalvo = JSON.parse(localStorage.getItem("progressoHardware")) || { concluido: [] };

  function atualizarProgresso() {
    const total = curso.unidades.length;
    const concluidas = progressoSalvo.concluido.length;
    const porcentagem = Math.round((concluidas / total) * 100);
    localStorage.setItem("progressoHardware", JSON.stringify(progressoSalvo));
    return porcentagem;
  }

  const progresso = atualizarProgresso();

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

  // Monta grid
  const grid = document.querySelector(".courses-grid");
  if (!grid) return;
  grid.innerHTML = "";

  // pega usuario id (pode ser null)
  const usuarioId = localStorage.getItem("id");

  // itera unidades
  for (let index = 0; index < curso.unidades.length; index++) {
    const u = curso.unidades[index];

    // verifica acesso com try/catch para não quebrar o loop se o servidor falhar
    let acesso = true; // padrão: acessível
    if (usuarioId) {
      try {
        const res = await fetch(`http://localhost:2000/progresso/${usuarioId}/${index + 1}`);
        if (res.ok) {
          const json = await res.json();
          acesso = Boolean(json.acesso);
        } else {
          // se resposta não ok, mantemos acesso true ou você pode setar false
          console.warn(`Progresso: resposta ${res.status} para unidade ${index + 1}`);
        }
      } catch (err) {
        console.error(`Erro ao verificar progresso da unidade ${index + 1}:`, err);
        // mantém acesso true para não bloquear UX em dev/local
      }
    }

    const bloqueado = !acesso;
    const concluida = progressoSalvo.concluido.includes(index);

    const icone = concluida ? "✅" : bloqueado ? "🔒" : "📘";
    const btnTexto = bloqueado ? "Bloqueado" : concluida ? "Concluído" : "Acessar Unidade";
    const btnClasse = bloqueado ? "locked" : concluida ? "completed" : "continue";

    // card
    const card = document.createElement("div");
    card.classList.add("course-card");

    card.innerHTML = `
      <div class="course-content">
        <div class="image-wrapper">
          <img src="${u.imagem || IMAGEM_PADRAO}" loading="lazy" class="course-image" alt="Imagem - ${u.titulo}">
        </div>
        <span class="course-category">Unidade ${index + 1}</span>
        <h3 class="course-title">${icone} ${u.titulo}</h3>
        <p class="course-description">${u.descricao || ""}</p>
        <div class="course-stats"></div>
        <button class="course-btn ${btnClasse}" ${bloqueado ? "disabled" : ""}>${btnTexto}</button>
      </div>
    `;

    // fallback de imagem caso a externa dê erro (CORS, 404, etc)
    const imgEl = card.querySelector("img.course-image");
    imgEl.addEventListener("error", () => {
      imgEl.src = IMAGEM_PADRAO;
      imgEl.classList.add("img-fallback");
    });

    // hover - adiciona quando o card é criado
    card.addEventListener("mouseenter", () => card.classList.add("hover"));
    card.addEventListener("mouseleave", () => card.classList.remove("hover"));

    // clique somente se desbloqueado
    const btn = card.querySelector("button");
    if (!bloqueado) {
      btn.addEventListener("click", () => {
        // marca concluída? (opcional) — aqui só navega
        window.location.href = u.link;
      });
    }

    grid.appendChild(card);
  }

  // CARREGA DADOS DO USUÁRIO E FOTO (se existir id)
  const id = localStorage.getItem("id");
  if (!id) {
    console.warn("Nenhum ID encontrado no localStorage. Redirecionando...");
    // se preferir comentar a linha abaixo em dev, remova-a
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`http://localhost:2000/${id}/usuario`);
    if (!res.ok) throw new Error("Erro ao buscar dados do usuário.");

    const user = await res.json();
    const userNameEl = document.getElementById("userName");
    const userLevelEl = document.getElementById("userLevel");
    const userXpEl = document.getElementById("userXP");

    if (userNameEl) userNameEl.textContent = user.nome || "Usuário";
    if (userLevelEl) userLevelEl.textContent = `CPF: ${user.cpf || "indefinido"}`;
    if (userXpEl) userXpEl.textContent = `${user.pontuacao || "0000"} XP`;

    console.log("[usuarioHeader.js] Dados do usuário carregados:", user);
  } catch (err) {
    console.error("[usuarioHeader.js] Erro ao carregar usuário:", err);
    const userNameEl = document.getElementById("userName");
    if (userNameEl) userNameEl.textContent = "Erro ao carregar";
  }

  try {
    const resFoto = await fetch(`http://localhost:2000/usuario/${id}/foto`);
    if (!resFoto.ok) throw new Error("Erro ao buscar foto");

    const blob = await resFoto.blob();
    const imageUrl = URL.createObjectURL(blob);
    const photoEl = document.getElementById("userPhoto");
    if (photoEl) photoEl.src = imageUrl;
  } catch (err) {
    console.error("Erro ao carregar imagem:", err);
    // você pode colocar um avatar padrão aqui se quiser:
    const photoEl = document.getElementById("userPhoto");
    if (photoEl) photoEl.src = "./images/user.png";
  }

  // profile button
  const profileBtn = document.getElementsByClassName("user-profile")[0];
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "./usuario.html";
    });
  }
});

// função global para marcar concluída (mantive sua API)
window.marcarConcluida = function(indice) {
  let progressoSalvo = JSON.parse(localStorage.getItem("progressoHardware")) || { concluido: [] };
  if (!progressoSalvo.concluido.includes(indice)) {
    progressoSalvo.concluido.push(indice);
    localStorage.setItem("progressoHardware", JSON.stringify(progressoSalvo));
    console.log(`✅ Unidade ${indice + 1} concluída e salva!`);
    // Atualiza barra de progresso na UI (se quiser forçar recálculo)
    const perc = Math.round((progressoSalvo.concluido.length / document.querySelectorAll(".course-card").length) * 100);
    const progEl = document.querySelector(".course-progress .progress");
    const progTxt = document.querySelector(".course-progress .progress-text");
    if (progEl) progEl.style.width = `${perc}%`;
    if (progTxt) progTxt.textContent = `${perc}% concluído`;
  }
};
