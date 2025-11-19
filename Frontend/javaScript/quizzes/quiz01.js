// quiz01.js — versão defensiva + debug logs
(() => {
  // ---------- CONFIG ----------
  const questions = [
    { question: "O que é considerado hardware em um computador?", options: ["Os programas e aplicativos instalados","A parte física e tangível do sistema","Os dados armazenados no disco rígido","Os comandos executados pelo processador"], correct: 1 },
    { question: "Qual é o principal papel da CPU?", options: ["Controlar a rede de internet","Interpretar e executar instruções","Gerar imagens para o monitor","Armazenar dados de forma permanente"], correct: 1 },
    { question: "A função da memória RAM é:", options: ["Armazenar dados temporários durante a execução dos programas","Armazenar o sistema operacional de forma permanente","Converter energia elétrica em dados digitais","Controlar a velocidade do processador"], correct: 0 },
    { question: "Qual dos componentes abaixo é responsável por armazenar dados permanentemente?", options: ["SSD ou HD","Memória RAM","Fonte de alimentação","Cooler da CPU"], correct: 0 },
    { question: "Qual é a função principal da placa-mãe?", options: ["Distribuir energia elétrica entre os componentes","Conectar e permitir a comunicação entre todos os componentes","Controlar o fluxo de ar dentro do gabinete","Aumentar o desempenho do processador"], correct: 1 },
    { question: "O que significa a sigla CPU?", options: ["Central Processing Unit","Control Program Utility","Computer Power Unit","Core Peripheral Unit"], correct: 0 },
    { question: "Os dispositivos de entrada são responsáveis por:", options: ["Enviar informações para o computador","Receber informações do computador","Controlar o fluxo de energia","Aumentar o desempenho gráfico"], correct: 0 },
    { question: "Um exemplo de dispositivo de saída é:", options: ["Teclado","Mouse","Monitor","Pendrive"], correct: 2 },
    { question: "O que diferencia o SSD do HD tradicional?", options: ["O SSD é mais rápido e não tem partes mecânicas","O SSD é mais pesado e consome mais energia","O HD é feito para armazenar temporariamente dados","Não há diferença entre eles"], correct: 0 },
    { question: "Por que o gabinete é importante na montagem do computador?", options: ["Serve apenas como decoração estética","Protege e organiza os componentes internos","Aumenta o desempenho do processador","Amplifica o sinal da fonte de energia"], correct: 1 }
  ];
  const unidadeAtual = 1;
  const proximaUnidade = 2;
  const pointsPerAttempt = [1000, 700, 400, 100];

  // ---------- ESTADO ----------
  let current = 0;
  let score = 0;
  let attempt = 0;

  // ---------- DOM ----------
  const questionText = document.getElementById("questionText");
  const optionsBox = document.getElementById("optionsBox");
  const scoreBoard = document.getElementById("scoreBoard");
  // nextBtn pode ser recriado, então buscamos sempre por id

  // ---------- DEFENSIVAS GLOBAIS ----------
  // evita qualquer submit de forms
  document.querySelectorAll("form").forEach(f => {
    f.addEventListener("submit", e => {
      console.warn("[quiz01] prevented form submit");
      e.preventDefault();
      return false;
    });
  });
  // força todos botões a não serem submit se não tiverem type
  document.querySelectorAll("button").forEach(b => {
    if (!b.hasAttribute("type")) b.setAttribute("type", "button");
  });

  // logs para debug
  const L = (...a) => console.log("[quiz01]", ...a);
  const E = (...a) => console.error("[quiz01]", ...a);

  // registra antes do unload (se houver reload, aparece no console)
  window.addEventListener("beforeunload", (e) => {
    L("beforeunload fired — probably navigation / reload.");
  });
  window.addEventListener("unload", () => {
    L("unload fired.");
  });

  // ---------- FUNÇÕES PRINCIPAIS ----------
  function ensureNextButton() {
    let b = document.getElementById("nextBtn");
    if (!b) {
      const container = document.querySelector(".quiz-container") || document.body;
      b = document.createElement("button");
      b.id = "nextBtn";
      b.type = "button";
      b.textContent = "Próxima";
      b.disabled = true;
      container.appendChild(b);
      L("nextBtn criado dinamicamente");
    } else {
      // garante type
      if (!b.getAttribute("type")) b.setAttribute("type", "button");
    }
    return b;
  }

  function renderQuestion() {
    const q = questions[current];
    attempt = 0;
    if (!questionText || !optionsBox) {
      E("Elementos essenciais não encontrados (#questionText ou #optionsBox).");
      return;
    }
    questionText.textContent = `${current + 1}. ${q.question}`;
    optionsBox.innerHTML = "";
    // garante botão
    const nextBtn = ensureNextButton();
    nextBtn.disabled = true;

    q.options.forEach((opt, i) => {
      const div = document.createElement("div");
      div.className = "option";
      div.textContent = opt;
      div.tabIndex = 0;
      // evento: handler único por elemento
      div.addEventListener("click", () => handleAnswer(i, div));
      div.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleAnswer(i, div); }});
      optionsBox.appendChild(div);
    });

    // atualiza placar visual
    if (scoreBoard) scoreBoard.textContent = `Pontuação: ${score}`;
    L(`Rendered question ${current+1}`);
  }

  function handleAnswer(index, div) {
    const q = questions[current];
    const optEls = Array.from(optionsBox.querySelectorAll(".option"));
    attempt = Math.max(1, attempt + 1);

    if (index === q.correct) {
      // correto
      div.classList.add("correct");
      const earned = pointsPerAttempt[Math.min(attempt - 1, pointsPerAttempt.length - 1)];
      score += earned;
      if (scoreBoard) scoreBoard.textContent = `Pontuação: ${score}`;
      // trava tudo
      optEls.forEach(o => o.style.pointerEvents = "none");
      // habilita botão
      const nextBtn = ensureNextButton();
      nextBtn.disabled = false;
      L(`Acertou Q${current+1} — ganhou ${earned} — score=${score}`);
    } else {
      // errado — trava apenas essa opção
      div.classList.add("wrong");
      div.style.pointerEvents = "none";
      // mantém demais ativas
      optEls.forEach(o => {
        if (!o.classList.contains("wrong") && !o.classList.contains("correct")) {
          o.style.pointerEvents = "auto";
        } else {
          o.style.pointerEvents = "none";
        }
      });
      L(`Errou Q${current+1} — tentativa ${attempt}`);
    }
  }

  // Delegação para o botão NEXT — robusto contra recriações
  document.addEventListener("click", (e) => {
    const btn = e.target.closest && e.target.closest("#nextBtn");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    if (btn.disabled) {
      L("nextBtn clique ignorado (disabled)");
      return;
    }

    // avança
    current++;
    if (current < questions.length) {
      renderQuestion();
    } else {
      finalizarQuizFlow();
    }
  });

  // ---------- FINALIZAÇÃO (await, logs) ----------
  async function finalizarQuizFlow() {
    L("finalizarQuizFlow iniciado — enviando dados...");
    const usuarioId = localStorage.getItem("id");
    if (!usuarioId) {
      E("Usuário não identificado (localStorage id). Não envio dados.");
      alert("Erro: faça login novamente.");
      return;
    }

    try {
      // enviar XP (score)
      const xpResp = await fetch(`http://localhost:2000/usuario/${usuarioId}/adicionarXP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: score })
      });
      L("/usuario/:id/adicionarXP status:", xpResp.status);
      try { L("XP response body:", await xpResp.clone().json().catch(()=>null)); } catch(e){}

    } catch (err) {
      E("Erro fetch adicionarXP:", err);
    }

    try {
      const progResp = await fetch("http://localhost:2000/progresso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, unidade: unidadeAtual })
      });
      L("/progresso status:", progResp.status);
      try { L("Progresso response body:", await progResp.clone().json().catch(()=>null)); } catch(e){}
    } catch (err) {
      E("Erro fetch progresso:", err);
    }

    // atualiza local
    try {
      const pl = JSON.parse(localStorage.getItem("progressoHardware")) || { concluido: [] };
      if (!pl.concluido.includes(unidadeAtual - 1)) {
        pl.concluido.push(unidadeAtual - 1);
        localStorage.setItem("progressoHardware", JSON.stringify(pl));
        L("Progresso local atualizado.");
      }
    } catch (err) { E("Erro atualizar progresso local:", err); }

    // UI final
    if (questionText) questionText.textContent = `Você concluiu o quiz da Unidade ${unidadeAtual}!`;
    if (optionsBox) optionsBox.innerHTML = "";
    document.getElementById("nextBtn")?.remove();

    // redirect seguro
    setTimeout(() => {
      L("Redirecionando para próxima unidade...");
      window.location.replace(`../unidades/unidade0${proximaUnidade}.html`);
    }, 900);
  }

  // ---------- START ----------
  try {
    renderQuestion();
    L("Quiz iniciado");
  } catch (e) {
    E("Erro ao iniciar quiz:", e);
  }

  // export debug
  window.__quiz01_debug = {
    renderQuestion,
    handleAnswer,
    finalizarQuizFlow,
    getState: () => ({ current, score, attempt })
  };
})();
