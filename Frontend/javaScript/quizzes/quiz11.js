const questions = [
  {
    question: "Antes de fechar o gabinete, o que é importante verificar?",
    options: [
      "Se os cabos SATA estão conectados corretamente",
      "Se o gabinete está limpo externamente",
      "Se o mouse e teclado estão conectados",
      "Se o sistema operacional foi instalado"
    ],
    correct: 0
  },
  {
    question: "Por que testar o PC antes de fechar o gabinete é uma boa prática?",
    options: [
      "Para garantir que todos os cabos de energia e dados estão funcionando",
      "Para evitar que o computador fique bonito demais",
      "Para economizar energia elétrica",
      "Para instalar o sistema operacional mais rápido"
    ],
    correct: 0
  },
  {
    question: "O que deve acontecer ao pressionar o botão de ligar após a montagem?",
    options: [
      "O sistema deve emitir bipes e desligar",
      "As ventoinhas giram e os LEDs acendem",
      "Nada deve acontecer",
      "A BIOS é instalada automaticamente"
    ],
    correct: 1
  },
  {
    question: "Caso o PC não ligue, qual deve ser o primeiro passo?",
    options: [
      "Reinstalar o sistema operacional",
      "Trocar o monitor",
      "Verificar o cabo de energia e os conectores da placa-mãe",
      "Formatar o disco rígido"
    ],
    correct: 2
  },
  {
    question: "O que indica um bip curto no alto-falante do sistema (speaker)?",
    options: [
      "Erro de memória RAM",
      "POST concluído com sucesso",
      "Placa de vídeo desconectada",
      "Falha na fonte de alimentação"
    ],
    correct: 1
  },
  {
    question: "Ao fechar o gabinete, o que deve ser evitado?",
    options: [
      "Apertar excessivamente os parafusos",
      "Limpar o interior antes do fechamento",
      "Manter os cabos organizados",
      "Usar pulseira antiestática"
    ],
    correct: 0
  },
  {
    question: "O que é POST?",
    options: [
      "Processo de inicialização que verifica o hardware",
      "Tipo de conexão USB",
      "Comando de desligamento do BIOS",
      "Driver de instalação de disco"
    ],
    correct: 0
  },
  {
    question: "Qual a principal função do BIOS durante o primeiro boot?",
    options: [
      "Gerar gráficos da GPU",
      "Verificar o hardware e iniciar o sistema",
      "Aumentar o desempenho da RAM",
      "Instalar drivers automaticamente"
    ],
    correct: 1
  },
  {
    question: "Durante o teste final, o que o técnico deve monitorar?",
    options: [
      "Temperatura da CPU, ruídos e funcionamento dos LEDs",
      "Velocidade da internet",
      "Quantidade de aplicativos abertos",
      "Resolução da tela"
    ],
    correct: 0
  },
  {
    question: "Após a conclusão dos testes, o que indica que a montagem foi bem-sucedida?",
    options: [
      "O computador inicia normalmente e todos os dispositivos são reconhecidos",
      "A ventoinha da fonte desliga",
      "A BIOS trava após o logo",
      "O LED do gabinete não acende"
    ],
    correct: 0
  }
];

// -----------------------------------------
// CONFIGURAÇÕES DO QUIZ (UNIDADE 11)
// -----------------------------------------
const unidadeAtual = 11;
const proximaUnidade = null; // 👈 não existe unidade 12

// -----------------------------------------
// SISTEMA DE PONTUAÇÃO
// -----------------------------------------
let current = 0;
let score = 0;
let attempt = 0;
const pointsPerAttempt = [1000, 700, 400, 100];

// -----------------------------------------
// ELEMENTOS DA TELA
// -----------------------------------------
const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("optionsBox");
const nextBtn = document.getElementById("nextBtn");
const scoreBoard = document.getElementById("scoreBoard");

// -----------------------------------------
// CARREGAR PERGUNTA
// -----------------------------------------
function loadQuestion() {
  const q = questions[current];
  attempt = 0;
  nextBtn.disabled = true;

  questionText.textContent = `${current + 1}. ${q.question}`;
  optionsBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = opt;
    div.onclick = () => checkAnswer(i, div);
    optionsBox.appendChild(div);
  });
}

// -----------------------------------------
// VERIFICAR RESPOSTA
// -----------------------------------------
function checkAnswer(index, div) {
  const q = questions[current];
  const options = optionsBox.querySelectorAll(".option");

  options.forEach(o => o.style.pointerEvents = "none");
  attempt++;

  if (index === q.correct) {
    div.classList.add("correct");

    const earned = pointsPerAttempt[Math.min(attempt - 1, 3)];
    score += earned;
    scoreBoard.textContent = `Pontuação: ${score}`;

    nextBtn.disabled = false;
  } else {
    div.classList.add("wrong");

    if (attempt < pointsPerAttempt.length) {
      options.forEach(o => o.style.pointerEvents = "auto");
      div.style.pointerEvents = "none";
    }
  }
}

// -----------------------------------------
// BOTÃO PRÓXIMA
// -----------------------------------------
nextBtn.onclick = () => {
  current++;

  if (current < questions.length) {
    loadQuestion();
  } else {
    finalizarQuiz();
  }
};

// -----------------------------------------
// FINALIZAR QUIZ DA UNIDADE 11
// -----------------------------------------
function finalizarQuiz() {
  const usuarioId = localStorage.getItem("id");

  // SALVAR XP
  fetch(`http://localhost:2000/usuario/${usuarioId}/adicionarXP`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ xp: score })
  });

  // SALVAR PROGRESSO FINAL
  fetch("http://localhost:2000/progresso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuarioId,
      unidade: unidadeAtual
    })
  });

  // MARCAR VISUALMENTE COMO CONCLUÍDA (curso.js)
  if (typeof marcarConcluida === "function") {
    marcarConcluida(unidadeAtual - 1);
  }

  // TELA FINAL
  questionText.textContent = `🎉 Parabéns! Você concluiu **todo o curso**!`;
  optionsBox.innerHTML = "";
  nextBtn.remove();

  // --------------------------------------
  // AQUI VOCÊ ESCOLHE O QUE QUER FAZER:
  // --------------------------------------

  // OPÇÃO 1 → voltar para a página do curso
  setTimeout(() => {
    window.location.href = "../curso.html";
  }, 3000);

  // ➤ Se quiser liberar certificado, é só pedir que eu adiciono.
}

// -----------------------------------------
// INICIAR QUIZ
// -----------------------------------------
loadQuestion();