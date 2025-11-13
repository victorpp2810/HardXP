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

let current = 0;
let score = 0;
let attempt = 0;
const pointsPerAttempt = [1000, 700, 400, 100];
let answered = false;

const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("optionsBox");
const scoreBoard = document.getElementById("scoreBoard");
const nextBtn = document.getElementById("nextBtn");

function loadQuestion() {
  const q = questions[current];
  attempt = 0;
  answered = false;
  questionText.textContent = `${current + 1}. ${q.question}`;
  optionsBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = opt;
    div.onclick = () => checkAnswer(i, div);
    optionsBox.appendChild(div);
  });

  nextBtn.disabled = true;
}

function checkAnswer(index, div) {
  if (answered) return;

  const q = questions[current];
  const options = document.querySelectorAll(".option");
  attempt++;

  if (index === q.correct) {
    div.classList.add("correct");
    const earned = pointsPerAttempt[Math.min(attempt - 1, 3)];
    score += earned;
    scoreBoard.textContent = `Pontuação: ${score}`;
    answered = true;
    nextBtn.disabled = false;
  } else {
    div.classList.add("wrong");
  }

  options.forEach(o => (o.style.pointerEvents = answered ? "none" : "auto"));
}

nextBtn.addEventListener("click", () => {
  if (!answered) return;

  if (current < questions.length - 1) {
    current++;
    loadQuestion();
  } else {
    // Fim do quiz
    localStorage.setItem("quiz04Score", score);
    if (typeof marcarConcluida === "function") {
      marcarConcluida(3);
    }
    window.location.href = "./unidade05.html";
  }
});

document.addEventListener("DOMContentLoaded", loadQuestion);
