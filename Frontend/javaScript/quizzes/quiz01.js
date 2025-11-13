const questions = [
  {
    question: "O que é considerado hardware em um computador?",
    options: [
      "Os programas e aplicativos instalados",
      "A parte física e tangível do sistema",
      "Os dados armazenados no disco rígido",
      "Os comandos executados pelo processador"
    ],
    correct: 1
  },
  {
    question: "Qual é o principal papel da CPU?",
    options: [
      "Controlar a rede de internet",
      "Interpretar e executar instruções",
      "Gerar imagens para o monitor",
      "Armazenar dados de forma permanente"
    ],
    correct: 1
  },
  {
    question: "A função da memória RAM é:",
    options: [
      "Armazenar dados temporários durante a execução dos programas",
      "Armazenar o sistema operacional de forma permanente",
      "Converter energia elétrica em dados digitais",
      "Controlar a velocidade do processador"
    ],
    correct: 0
  },
  {
    question: "Qual dos componentes abaixo é responsável por armazenar dados permanentemente?",
    options: [
      "SSD ou HD",
      "Memória RAM",
      "Fonte de alimentação",
      "Cooler da CPU"
    ],
    correct: 0
  },
  {
    question: "Qual é a função principal da placa-mãe?",
    options: [
      "Distribuir energia elétrica entre os componentes",
      "Conectar e permitir a comunicação entre todos os componentes",
      "Controlar o fluxo de ar dentro do gabinete",
      "Aumentar o desempenho do processador"
    ],
    correct: 1
  },
  {
    question: "O que significa a sigla CPU?",
    options: [
      "Central Processing Unit",
      "Control Program Utility",
      "Computer Power Unit",
      "Core Peripheral Unit"
    ],
    correct: 0
  },
  {
    question: "Os dispositivos de entrada são responsáveis por:",
    options: [
      "Enviar informações para o computador",
      "Receber informações do computador",
      "Controlar o fluxo de energia",
      "Aumentar o desempenho gráfico"
    ],
    correct: 0
  },
  {
    question: "Um exemplo de dispositivo de saída é:",
    options: [
      "Teclado",
      "Mouse",
      "Monitor",
      "Pendrive"
    ],
    correct: 2
  },
  {
    question: "O que diferencia o SSD do HD tradicional?",
    options: [
      "O SSD é mais rápido e não tem partes mecânicas",
      "O SSD é mais pesado e consome mais energia",
      "O HD é feito para armazenar temporariamente dados",
      "Não há diferença entre eles"
    ],
    correct: 0
  },
  {
    question: "Por que o gabinete é importante na montagem do computador?",
    options: [
      "Serve apenas como decoração estética",
      "Protege e organiza os componentes internos",
      "Aumenta o desempenho do processador",
      "Amplifica o sinal da fonte de energia"
    ],
    correct: 1
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
    localStorage.setItem("quiz01Score", score);
    if (typeof marcarConcluida === "function") {
      marcarConcluida(0);
    }
    questionText.textContent = `Você concluiu o quiz da Unidade 1!`;
    optionsBox.innerHTML = "";
    nextBtn.remove();
    setTimeout(() => {
      window.location.href = "../unidades/unidade02.html";
    }, 2500);
  }
};

loadQuestion();
