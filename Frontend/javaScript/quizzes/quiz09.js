const questions = [
  {
    question: "Qual é a principal função do SSD em um computador?",
    options: [
      "Fornecer energia ao sistema",
      "Armazenar dados de forma rápida e permanente",
      "Gerar vídeo para o monitor",
      "Refrigeração dos componentes"
    ],
    correct: 1
  },
  {
    question: "Qual é a principal diferença entre um SSD e um HD tradicional?",
    options: [
      "O SSD usa discos giratórios e o HD usa chips de memória",
      "O SSD é mais lento, porém mais durável",
      "O SSD usa memória flash e não possui partes móveis",
      "O HD é silencioso, o SSD é barulhento"
    ],
    correct: 2
  },
  {
    question: "Qual o tamanho mais comum de um SSD usado em desktops?",
    options: [
      "2,5 polegadas",
      "3,5 polegadas",
      "1,8 polegadas",
      "5 polegadas"
    ],
    correct: 0
  },
  {
    question: "Por que alguns gabinetes exigem o uso de adaptadores para SSDs?",
    options: [
      "Para transformar a conexão SATA em IDE",
      "Porque possuem apenas baias de 3,5” e o SSD é de 2,5”",
      "Para aumentar a velocidade de leitura",
      "Para suportar mais energia"
    ],
    correct: 1
  },
  {
    question: "Antes de instalar uma unidade óptica, o que deve ser feito?",
    options: [
      "Remover o painel frontal do gabinete",
      "Conectar o cabo SATA primeiro",
      "Ligar o computador",
      "Instalar a fonte de energia"
    ],
    correct: 0
  },
  {
    question: "O que deve ser observado ao instalar uma unidade óptica (DVD)?",
    options: [
      "O posicionamento correto na baia frontal de 5,25”",
      "A posição da ventoinha traseira",
      "O tamanho do dissipador da CPU",
      "O número de conectores SATA na fonte"
    ],
    correct: 0
  },
  {
    question: "O que significa SATA?",
    options: [
      "Serial Advanced Transfer Attachment",
      "System Area Transmission Access",
      "Serial ATA – Interface de transferência de dados",
      "Speed and Transfer Algorithm"
    ],
    correct: 2
  },
  {
    question: "Para que serve o conector de energia SATA de 15 pinos?",
    options: [
      "Para transmitir dados entre o HD e a placa-mãe",
      "Para fornecer energia às unidades de armazenamento",
      "Para conectar o processador à fonte",
      "Para ligar o botão power"
    ],
    correct: 1
  },
  {
    question: "Qual é o risco de instalar mal um SSD dentro do gabinete?",
    options: [
      "Superaquecimento e vibração excessiva",
      "O SSD pode gerar interferência no monitor",
      "O sistema não reconhece a memória RAM",
      "O computador não liga"
    ],
    correct: 0
  },
  {
    question: "Depois de instalar o SSD e a unidade óptica, qual é o próximo passo?",
    options: [
      "Conectar os cabos SATA de dados e energia",
      "Ligar o computador",
      "Remover o dissipador da CPU",
      "Testar a GPU"
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
    localStorage.setItem("quiz09Score", score);
    if (typeof marcarConcluida === "function") {
      marcarConcluida(8);
    }
    questionText.textContent = `Você concluiu o Quiz da Unidade 9! Excelente trabalho.`;
    optionsBox.innerHTML = "";
    nextBtn.remove();
    setTimeout(() => {
      window.location.href = "../unidades/unidade10.html";
    }, 3000);
  }
};

loadQuestion();
