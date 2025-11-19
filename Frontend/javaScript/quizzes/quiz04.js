// Quiz – Unidade 4: Armazenamento de Dados
// Sistema: só avança após acertar; não é possível voltar.

const questions = [
  {
    question: "Qual é a principal função de um dispositivo de armazenamento?",
    options: [
      "Controlar o fluxo de energia entre os componentes",
      "Guardar dados e programas para uso posterior",
      "Exibir informações na tela",
      "Executar instruções da CPU"
    ],
    correct: 1
  },
  {
    question: "Qual é a principal diferença entre HD e SSD?",
    options: [
      "O HD é mais rápido e não possui partes móveis",
      "O SSD usa chips de memória e não discos magnéticos",
      "O SSD é mais barulhento e frágil",
      "O HD utiliza memória flash"
    ],
    correct: 1
  },
  {
    question: "O que significa a sigla SSD?",
    options: [
      "Solid State Drive",
      "System Storage Device",
      "Smart Storage Disk",
      "Serial Storage Data"
    ],
    correct: 0
  },
  {
    question: "Qual tipo de conexão é usada por SSDs SATA?",
    options: [
      "IDE",
      "PCI Express",
      "SATA (Serial ATA)",
      "NVMe"
    ],
    correct: 2
  },
  {
    question: "O que pode acontecer se um HD sofrer um impacto físico?",
    options: [
      "Nada, ele é resistente a choques",
      "Pode ocorrer falha mecânica e perda de dados",
      "Aumenta sua velocidade temporariamente",
      "Ele se ajusta automaticamente"
    ],
    correct: 1
  }
];

const unidadeAtual = 4;      // 👈 Mude aqui para a unidade atual
const proximaUnidade = 5;    // 👈 Mude aqui para a próxima unidade

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
// BOTÃO PRÓXIMA PERGUNTA
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
// FINALIZAR QUIZ
// -----------------------------------------
function finalizarQuiz() {
  const usuarioId = localStorage.getItem("id");

  // SALVAR XP DO QUIZ
  fetch(`http://localhost:2000/usuario/${usuarioId}/adicionarXP`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ xp: score })
  })
    .then(r => r.json())
    .then(d => console.log("XP atualizado:", d))
    .catch(err => console.error("Erro ao enviar XP:", err));

  // SALVAR PROGRESSO DA UNIDADE
  fetch("http://localhost:2000/progresso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuarioId,
      unidade: unidadeAtual
    })
  })
    .then(() => console.log(`Progresso da unidade ${unidadeAtual} salvo`))
    .catch(err => console.error("Erro ao salvar progresso:", err));

  // MARCAR COMO CONCLUÍDA VISUALMENTE (curso.js)
  if (typeof marcarConcluida === "function") {
    marcarConcluida(unidadeAtual - 1);
  }

  // FIM DO QUIZ
  questionText.textContent = `Você concluiu o quiz da Unidade ${unidadeAtual}!`;
  optionsBox.innerHTML = "";
  nextBtn.remove();

  // REDIRECIONAR PARA A PRÓXIMA UNIDADE
  setTimeout(() => {
    window.location.href = `../unidades/unidade0${proximaUnidade}.html`;
  }, 2500);
}

// -----------------------------------------
// INICIAR QUIZ
// -----------------------------------------
loadQuestion();