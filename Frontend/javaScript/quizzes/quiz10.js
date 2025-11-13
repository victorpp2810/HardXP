const questions = [
  {
    question: "Qual é a função principal dos cabos SATA em um computador?",
    options: [
      "Transmitir energia elétrica aos componentes",
      "Transferir dados entre a placa-mãe e dispositivos de armazenamento",
      "Controlar o funcionamento das ventoinhas",
      "Conectar a fonte de alimentação ao processador"
    ],
    correct: 1
  },
  {
    question: "Quantos pinos possui um conector de energia SATA padrão?",
    options: ["7", "15", "20", "24"],
    correct: 1
  },
  {
    question: "O que acontece se o cabo de energia do HD não estiver conectado corretamente?",
    options: [
      "O sistema liga normalmente, mas sem vídeo",
      "O HD não será reconhecido e não funcionará",
      "A CPU não inicia o boot",
      "A ventoinha da fonte não liga"
    ],
    correct: 1
  },
  {
    question: "O cabo SATA de dados conecta o HD/SSD a qual componente?",
    options: [
      "Fonte de alimentação",
      "Gabinete",
      "Placa-mãe",
      "Memória RAM"
    ],
    correct: 2
  },
  {
    question: "O que deve ser feito antes de conectar os cabos de energia?",
    options: [
      "Conferir se o gabinete está energizado",
      "Desligar e desconectar o computador da tomada",
      "Remover a placa-mãe do gabinete",
      "Instalar o sistema operacional"
    ],
    correct: 1
  },
  {
    question: "O conector de 24 pinos da fonte é responsável por alimentar:",
    options: [
      "A CPU",
      "A placa de vídeo",
      "A placa-mãe",
      "O armazenamento"
    ],
    correct: 2
  },
  {
    question: "Qual conector fornece energia adicional ao processador (CPU)?",
    options: [
      "Conector Molex",
      "Conector SATA",
      "Conector PCIe",
      "Conector EPS de 4 ou 8 pinos"
    ],
    correct: 3
  },
  {
    question: "O conector Molex ainda é usado principalmente para:",
    options: [
      "Ventoinhas, unidades ópticas e periféricos antigos",
      "Placas de vídeo modernas",
      "Memórias DDR5",
      "Processadores multicore"
    ],
    correct: 0
  },
  {
    question: "O que indica um mau encaixe dos cabos SATA?",
    options: [
      "O sistema não detecta o dispositivo de armazenamento",
      "A ventoinha não gira",
      "O LED do gabinete pisca continuamente",
      "O sistema não carrega o BIOS"
    ],
    correct: 0
  },
  {
    question: "Após conectar energia e dados, o que deve ser feito antes do fechamento do gabinete?",
    options: [
      "Testar o sistema e verificar o reconhecimento dos dispositivos",
      "Instalar o sistema operacional",
      "Fechar imediatamente o gabinete",
      "Limpar o cooler da CPU"
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
    localStorage.setItem("quiz10Score", score);
    if (typeof marcarConcluida === "function") {
      marcarConcluida(9);
    }
    questionText.textContent = `Você concluiu o Quiz da Unidade 10! Excelente trabalho.`;
    optionsBox.innerHTML = "";
    nextBtn.remove();
    setTimeout(() => {
      window.location.href = "../unidades/unidade11.html";
    }, 3000);
  }
};

loadQuestion();
