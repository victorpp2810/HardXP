const questions = [
  {
    question: "Qual é a principal função da memória RAM?",
    options: [
      "Armazenar permanentemente os dados do sistema",
      "Executar instruções e cálculos da CPU",
      "Armazenar dados temporários para acesso rápido",
      "Gerenciar a entrada e saída de dados"
    ],
    correct: 2
  },
  {
    question: "O que acontece com os dados armazenados na RAM quando o computador é desligado?",
    options: [
      "São salvos automaticamente no HD",
      "São apagados completamente",
      "São transferidos para a memória cache",
      "Continuam acessíveis até a próxima inicialização"
    ],
    correct: 1
  },
  {
    question: "O que significa a sigla ROM?",
    options: [
      "Read Only Memory",
      "Random Output Memory",
      "Rewritable Operating Module",
      "Read Operation Manager"
    ],
    correct: 0
  },
  {
    question: "Qual das opções representa um tipo de memória ROM regravável?",
    options: [
      "DRAM",
      "EEPROM",
      "SRAM",
      "L2 Cache"
    ],
    correct: 1
  },
  {
    question: "Qual tipo de RAM é usada como memória principal do computador?",
    options: [
      "DRAM",
      "SRAM",
      "EPROM",
      "Flash"
    ],
    correct: 0
  },
  {
    question: "A SRAM é normalmente usada em:",
    options: [
      "Memória principal",
      "Cache de CPU",
      "Armazenamento de longo prazo",
      "BIOS/UEFI"
    ],
    correct: 1
  },
  {
    question: "Qual é a diferença fundamental entre RAM e ROM?",
    options: [
      "A RAM é somente leitura, a ROM é leitura e escrita",
      "A RAM é volátil e a ROM é não volátil",
      "A RAM é usada apenas em servidores",
      "A ROM é usada para acelerar gráficos"
    ],
    correct: 1
  },
  {
    question: "O que é DDR na memória RAM?",
    options: [
      "Data Dynamic Register",
      "Double Data Rate",
      "Digital Data Recorder",
      "Dynamic Disk Reader"
    ],
    correct: 1
  },
  {
    question: "Qual tecnologia de RAM é mais moderna e rápida?",
    options: [
      "DDR2",
      "DDR3",
      "DDR4",
      "DDR"
    ],
    correct: 2
  },
  {
    question: "A BIOS do computador normalmente é armazenada em qual tipo de memória?",
    options: [
      "RAM",
      "SRAM",
      "EEPROM (ROM regravável)",
      "Cache L3"
    ],
    correct: 2
  }
];

const unidadeAtual = 3;      // 👈 Mude aqui para a unidade atual
const proximaUnidade = 4;    // 👈 Mude aqui para a próxima unidade

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

// --- BOTÃO PARA PRÓXIMA UNIDADE ---
const btnNextUnit = document.createElement("button");
btnNextUnit.textContent = "Ir para a próxima unidade";
btnNextUnit.style.marginTop = "20px";
btnNextUnit.style.padding = "10px 20px";
btnNextUnit.style.background = "#3b82f6";
btnNextUnit.style.color = "white";
btnNextUnit.style.border = "none";
btnNextUnit.style.borderRadius = "8px";
btnNextUnit.style.cursor = "pointer";
btnNextUnit.onclick = () => {
  window.location.href = `../unidades/unidade0${proximaUnidade}.html`;
};

document.querySelector(".quiz-container").appendChild(btnNextUnit);

}

// -----------------------------------------
// INICIAR QUIZ
// -----------------------------------------
loadQuestion();
