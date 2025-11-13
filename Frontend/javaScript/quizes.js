document.addEventListener("DOMContentLoaded", () => {
    const quizzes = [
        {
        titulo: "Componentes Básicos do PC",
        categoria: "Hardware",
        perguntas: 10,
        xp: 100,
        imagem: "../Frontend/images/quizzes/hardware-basico.jpg",
        link: "./quizzes/quiz01.html",
        status: "liberado"
        },
        {
        titulo: "Placa-Mãe e Conectores",
        categoria: "Placa-mãe",
        perguntas: 12,
        xp: 150,
        imagem: "../Frontend/images/quizzes/placa-mae.jpg",
        link: "./quizzes/quiz02.html",
        status: "bloqueado"
        },
        {
        titulo: "Memórias e Armazenamento",
        categoria: "Memória",
        perguntas: 10,
        xp: 150,
        imagem: "../Frontend/images/quizzes/memoria.jpg",
        link: "./quizzes/quiz03.html",
        status: "bloqueado"
        },
        {
        titulo: "Fontes e Energia",
        categoria: "Energia",
        perguntas: 8,
        xp: 100,
        imagem: "../Frontend/images/quizzes/fonte.jpg",
        link: "./quizzes/quiz04.html",
        status: "bloqueado"
        },
        {
        titulo: "Processadores e Threads",
        categoria: "Arquitetura",
        perguntas: 15,
        xp: 200,
        imagem: "../Frontend/images/quizzes/processadores.jpg",
        link: "./quizzes/quiz05.html",
        status: "bloqueado"
        },
        {
        titulo: "Montagem do PC",
        categoria: "Montagem",
        perguntas: 10,
        xp: 150,
        imagem: "../Frontend/images/quizzes/montagem.jpg",
        link: "./quizzes/quiz06.html",
        status: "bloqueado"
        },
        {
        titulo: "BIOS e Configuração Inicial",
        categoria: "Software de Baixo Nível",
        perguntas: 10,
        xp: 150,
        imagem: "../Frontend/images/quizzes/bios.jpg",
        link: "./quizzes/quiz07.html",
        status: "bloqueado"
        },
        {
        titulo: "Manutenção e Diagnóstico",
        categoria: "Manutenção",
        perguntas: 12,
        xp: 150,
        imagem: "../Frontend/images/quizzes/manutencao.jpg",
        link: "./quizzes/quiz08.html",
        status: "bloqueado"
        },
        {
        titulo: "Segurança de Hardware",
        categoria: "Segurança",
        perguntas: 15,
        xp: 200,
        imagem: "../Frontend/images/quizzes/seguranca.jpg",
        link: "./quizzes/quiz09.html",
        status: "bloqueado"
        },
        {
        titulo: "Periféricos e Interfaces",
        categoria: "Periféricos",
        perguntas: 8,
        xp: 100,
        imagem: "../Frontend/images/quizzes/perifericos.jpg",
        link: "./quizzes/quiz10.html",
        status: "bloqueado"
        },
        {
        titulo: "Refrigeração e Desempenho",
        categoria: "Otimização",
        perguntas: 10,
        xp: 200,
        imagem: "../Frontend/images/quizzes/refrigeracao.jpg",
        link: "./quizzes/quiz11.html",
        status: "bloqueado"
        }
    ];

    const container = document.getElementById("quizzesGrid");

    quizzes.forEach(q => {
        const card = document.createElement("div");
        card.classList.add("course-card");

        card.innerHTML = `
        <div class="course-image">
            <img src="${q.imagem}" alt="${q.titulo}">
        </div>
        <div class="course-content">
            <span class="course-category">${q.categoria}</span>
            <h3 class="course-title">${q.titulo}</h3>
            <p class="course-description">
            ${q.perguntas} perguntas — vale ${q.xp} XP
            </p>
            <button 
            class="course-btn ${q.status === "bloqueado" ? "locked" : ""}" 
            ${q.status === "bloqueado" ? "disabled" : `onclick="window.location.href='${q.link}'"`}>
            ${q.status === "bloqueado" ? "Bloqueado 🔒" : "Iniciar Quiz ▶"}
            </button>
        </div>
        `;

        container.appendChild(card);
    });
});


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