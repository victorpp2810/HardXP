const questions = [
  {
    question: "Qual é a função principal dos espaçadores (standoffs) no gabinete?",
    options: [
      "Aumentar o desempenho da placa-mãe",
      "Evitar curto-circuito e dar sustentação à placa-mãe",
      "Melhorar a ventilação interna",
      "Conectar os cabos de energia"
    ],
    correct: 1
  },
  {
    question: "Por que é importante alinhar os furos da placa-mãe com os espaçadores?",
    options: [
      "Para que os cabos de energia alcancem",
      "Para evitar pressão e permitir fixação correta",
      "Para conectar os LEDs do painel frontal",
      "Para posicionar o cooler"
    ],
    correct: 1
  },
  {
    question: "O que deve ser instalado antes de fixar a placa-mãe no gabinete?",
    options: [
      "A placa de E/S (I/O Shield)",
      "O cooler do processador",
      "Os módulos de memória RAM",
      "O cabo de energia SATA"
    ],
    correct: 0
  },
  {
    question: "Qual é a principal função da placa de E/S (I/O Shield)?",
    options: [
      "Evitar vibração do gabinete",
      "Ajudar no encaixe e proteger as portas traseiras da placa-mãe",
      "Reduzir ruídos de energia",
      "Servir como dissipador"
    ],
    correct: 1
  },
  {
    question: "Ao posicionar a placa-mãe no gabinete, o que deve ser verificado?",
    options: [
      "Se o processador está instalado",
      "Se os conectores USB estão ativos",
      "Se os furos e as portas traseiras estão alinhados corretamente",
      "Se o gabinete está ligado na tomada"
    ],
    correct: 2
  },
  {
    question: "Qual ferramenta é usada para parafusar a placa-mãe no gabinete?",
    options: [
      "Chave de fenda ou Phillips",
      "Martelo",
      "Alicate de bico",
      "Chave Torx somente"
    ],
    correct: 0
  },
  {
    question: "O que pode acontecer se os parafusos da placa-mãe forem apertados demais?",
    options: [
      "A placa pode empenar ou trincar",
      "O desempenho melhora",
      "O aterramento é perdido",
      "Nada, é apenas precaução estética"
    ],
    correct: 0
  },
  {
    question: "Por que é importante instalar corretamente os conectores de E/S?",
    options: [
      "Para evitar interferência de som",
      "Para garantir que as portas USB e HDMI funcionem sem obstruções",
      "Para aumentar a velocidade de rede",
      "Para melhorar a ventilação"
    ],
    correct: 1
  },
  {
    question: "Alguns coolers exigem a instalação de um suporte traseiro (backplate). O que isso implica?",
    options: [
      "A placa-mãe precisa ser removida para instalação",
      "O gabinete deve ser substituído",
      "É necessário furar o gabinete",
      "Nada muda, ele é apenas decorativo"
    ],
    correct: 0
  },
  {
    question: "Após fixar a placa-mãe, o que deve ser conferido antes de seguir com a montagem?",
    options: [
      "Se todos os parafusos estão firmes e as portas traseiras alinhadas",
      "Se o HD foi conectado",
      "Se o botão power foi pressionado",
      "Se a ventoinha do gabinete está desligada"
    ],
    correct: 0
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
    localStorage.setItem("quiz08Score", score);
    if (typeof marcarConcluida === "function") {
      marcarConcluida(7);
    }
    questionText.textContent = `Você concluiu o Quiz da Unidade 8! Excelente trabalho.`;
    optionsBox.innerHTML = "";
    nextBtn.remove();
    setTimeout(() => {
      window.location.href = "../unidades/unidade09.html";
    }, 3000);
  }
};

loadQuestion();
