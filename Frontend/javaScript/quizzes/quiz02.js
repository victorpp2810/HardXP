const questions = [
  {
    question: "Qual é a função principal da placa-mãe?",
    options: [
      "Armazenar dados temporários do sistema",
      "Conectar e permitir a comunicação entre todos os componentes",
      "Fornecer energia elétrica ao processador",
      "Executar instruções e cálculos lógicos"
    ],
    correct: 1
  },
  {
    question: "O chipset da placa-mãe tem a função de:",
    options: [
      "Regular a voltagem da CPU",
      "Gerenciar a comunicação entre CPU, memória e dispositivos",
      "Armazenar o sistema operacional",
      "Atuar como memória cache"
    ],
    correct: 1
  },
  {
    question: "Qual dos componentes a seguir é conectado diretamente ao soquete da placa-mãe?",
    options: [
      "Disco rígido (HD)",
      "Memória RAM",
      "Processador (CPU)",
      "Fonte de alimentação"
    ],
    correct: 2
  },
  {
    question: "O que é um soquete (socket) na placa-mãe?",
    options: [
      "Um conector onde a CPU é instalada",
      "Uma entrada de energia elétrica",
      "Um tipo de slot PCIe",
      "Uma interface para discos rígidos"
    ],
    correct: 0
  },
  {
    question: "O que diferencia um chipset de alto desempenho de um comum?",
    options: [
      "Maior capacidade de armazenamento",
      "Suporte a overclock, mais linhas PCIe e memórias mais rápidas",
      "Melhor refrigeração do processador",
      "Compatibilidade apenas com CPUs AMD"
    ],
    correct: 1
  },
  {
    question: "Qual barramento conecta diretamente a CPU à memória RAM?",
    options: [
      "PCI Express",
      "SATA",
      "Front Side Bus (FSB) ou controlador de memória",
      "USB"
    ],
    correct: 2
  },
  {
    question: "O chipset é dividido em duas partes principais, conhecidas como:",
    options: [
      "Northbridge e Southbridge",
      "Mainbridge e Sidebridge",
      "Input e Output bridge",
      "Clockbridge e Databridge"
    ],
    correct: 0
  },
  {
    question: "O que o Southbridge normalmente controla?",
    options: [
      "Comunicação da CPU com a GPU",
      "Dispositivos de entrada/saída e portas SATA/USB",
      "Frequência de operação do processador",
      "Memória cache L2 e L3"
    ],
    correct: 1
  },
  {
    question: "O slot PCI Express x16 é usado para instalar:",
    options: [
      "Memória RAM",
      "Placas de vídeo (GPU)",
      "Discos SSD",
      "Fonte de energia"
    ],
    correct: 1
  },
  {
    question: "O BIOS/UEFI é responsável por:",
    options: [
      "Iniciar o sistema operacional e reconhecer os componentes",
      "Aumentar o desempenho gráfico",
      "Fornecer energia à placa-mãe",
      "Substituir a função do chipset"
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
    localStorage.setItem("quiz02Score", score);
    if (typeof marcarConcluida === "function") {
      marcarConcluida(1);
    }
    questionText.textContent = "Você concluiu o quiz da Unidade 2!";
    optionsBox.innerHTML = "";
    nextBtn.remove();
    setTimeout(() => {
      window.location.href = "../unidades/unidade03.html";
    }, 2500);
  }
};

loadQuestion();
