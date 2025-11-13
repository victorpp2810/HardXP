const questions = [
  {
    question: "Qual é a principal função do processador (CPU)?",
    options: [
      "Gerar energia elétrica",
      "Interpretar e executar instruções",
      "Armazenar dados permanentemente",
      "Controlar apenas a memória RAM"
    ],
    correct: 1
  },
  {
    question: "O que significa a sigla CPU?",
    options: [
      "Central Processing Unit",
      "Control Peripheral Utility",
      "Central Performance User",
      "Computer Processing Usage"
    ],
    correct: 0
  },
  {
    question: "Qual dos itens abaixo está mais relacionado à velocidade de um processador?",
    options: [
      "Clock (GHz)",
      "Tamanho do HD",
      "Capacidade da fonte",
      "Resolução do monitor"
    ],
    correct: 0
  },
  {
    question: "O que é um núcleo (core) de um processador?",
    options: [
      "Um chip de vídeo dedicado",
      "Uma unidade de processamento independente dentro da CPU",
      "Uma área de armazenamento de cache",
      "Uma parte do dissipador térmico"
    ],
    correct: 1
  },
  {
    question: "O que significa o termo 'overclock'?",
    options: [
      "Aumentar a frequência de operação do processador além do padrão",
      "Reduzir o consumo de energia da CPU",
      "Trocar a CPU por uma mais rápida",
      "Desligar núcleos inativos"
    ],
    correct: 0
  },
  {
    question: "Qual unidade mede a velocidade do clock de um processador?",
    options: ["Watts", "Volts", "Hertz (Hz)", "Bytes"],
    correct: 2
  },
  {
    question: "O cache L1, L2 e L3 serve para:",
    options: [
      "Resfriar o processador",
      "Guardar instruções e dados usados com frequência",
      "Controlar o fluxo de energia na placa-mãe",
      "Executar gráficos integrados"
    ],
    correct: 1
  },
  {
    question: "Processadores multicore têm a vantagem de:",
    options: [
      "Executar várias tarefas simultaneamente",
      "Consumir mais energia sempre",
      "Aumentar o tamanho da RAM",
      "Eliminar a necessidade de uma GPU"
    ],
    correct: 0
  },
  {
    question: "O que é um soquete de processador?",
    options: [
      "Um tipo de pasta térmica",
      "Um encaixe físico onde a CPU é instalada na placa-mãe",
      "Um tipo de memória cache",
      "Um modelo de barramento de dados"
    ],
    correct: 1
  },
  {
    question: "Qual das opções abaixo NÃO influencia diretamente no desempenho da CPU?",
    options: [
      "Número de núcleos",
      "Frequência de clock",
      "Quantidade de cache",
      "Cor do gabinete"
    ],
    correct: 3
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
      // permite nova tentativa
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
    localStorage.setItem("quiz05Score", score);
    if (typeof marcarConcluida === "function") {
      marcarConcluida(4);
    }
    questionText.textContent = `Excelente! Você concluiu o Quiz da Unidade 5.`;
    optionsBox.innerHTML = "";
    nextBtn.remove();
    setTimeout(() => {
      window.location.href = "../unidades/unidade06.html";
    }, 3000);
  }
};

loadQuestion();
