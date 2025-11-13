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

let current = 0;
let score = 0;
let attempt = 0;
const pointsPerAttempt = [1000, 700, 400, 100];

const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("optionsBox");
const nextBtn = document.getElementById("nextBtn");
const scoreBoard = document.getElementById("scoreBoard");

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

nextBtn.onclick = () => {
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    localStorage.setItem("quiz03Score", score);
    if (typeof marcarConcluida === "function") {
      marcarConcluida(2);
    }
    questionText.textContent = "Você concluiu o quiz da Unidade 3!";
    optionsBox.innerHTML = "";
    nextBtn.remove();
    setTimeout(() => {
      window.location.href = "../unidades/unidade04.html";
    }, 2500);
  }
};

loadQuestion();
