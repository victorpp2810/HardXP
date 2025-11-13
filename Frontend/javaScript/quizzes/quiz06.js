const questions = [
  {
    question: "Qual é a principal função da fonte de alimentação (PSU)?",
    options: [
      "Converter a energia elétrica da tomada em tensões adequadas para o computador",
      "Aumentar o desempenho do processador",
      "Resfriar os componentes internos",
      "Gerar energia através de movimento mecânico"
    ],
    correct: 0
  },
  {
    question: "O que significa PSU?",
    options: [
      "Power Supply Unit",
      "Processing Speed Utility",
      "Performance Standard Unit",
      "Peripheral Source Utility"
    ],
    correct: 0
  },
  {
    question: "Qual é a principal diferença entre uma fonte real e uma genérica?",
    options: [
      "A real entrega a potência prometida com estabilidade",
      "A genérica é sempre mais potente",
      "A real não precisa de ventilação",
      "A genérica tem certificação 80 Plus"
    ],
    correct: 0
  },
  {
    question: "O selo 80 Plus indica que a fonte:",
    options: [
      "Tem eficiência energética mínima de 80%",
      "É compatível apenas com placas de vídeo",
      "Possui 80 watts de potência",
      "Funciona apenas em 220V"
    ],
    correct: 0
  },
  {
    question: "Qual conector fornece energia principal para a placa-mãe?",
    options: [
      "ATX 24 pinos",
      "EPS 8 pinos",
      "SATA 15 pinos",
      "PCIe 6 pinos"
    ],
    correct: 0
  },
  {
    question: "Qual conector é usado para alimentar o processador (CPU)?",
    options: [
      "SATA",
      "Molex",
      "ATX 4/8 pinos",
      "PCIe 8 pinos"
    ],
    correct: 2
  },
  {
    question: "Qual conector é usado para alimentar unidades de armazenamento SATA?",
    options: [
      "ATX 24 pinos",
      "SATA 15 pinos",
      "EPS 8 pinos",
      "Molex"
    ],
    correct: 1
  },
  {
    question: "Qual desses fatores NÃO deve ser usado para escolher uma fonte de alimentação?",
    options: [
      "Eficiência energética",
      "Reputação da marca",
      "Potência adequada ao sistema",
      "Cor do gabinete"
    ],
    correct: 3
  },
  {
    question: "Uma fonte modular permite:",
    options: [
      "Remover e conectar apenas os cabos necessários",
      "Aumentar automaticamente a potência",
      "Trocar os ventiladores internos",
      "Funcionar sem energia elétrica"
    ],
    correct: 0
  },
  {
    question: "O que pode acontecer ao usar uma fonte de baixa qualidade?",
    options: [
      "Maior estabilidade do sistema",
      "Maior vida útil dos componentes",
      "Danos à placa-mãe e quedas de energia",
      "Redução do consumo elétrico"
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
    localStorage.setItem("quiz06Score", score);
    if (typeof marcarConcluida === "function") {
      marcarConcluida(5);
    }
    questionText.textContent = `Você concluiu o Quiz da Unidade 6! Excelente trabalho.`;
    optionsBox.innerHTML = "";
    nextBtn.remove();
    setTimeout(() => {
      window.location.href = "../unidades/unidade07.html";
    }, 3000);
  }
};

loadQuestion();
