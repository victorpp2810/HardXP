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

const unidadeAtual = 5;      // 👈 Mude aqui para a unidade atual
const proximaUnidade = 6;    // 👈 Mude aqui para a próxima unidade

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