const questions = [
  {
    question: "Qual é o papel principal da CPU dentro do computador?",
    options: [
      "Armazenar permanentemente os dados",
      "Executar instruções e processar informações",
      "Gerar energia para os outros componentes",
      "Controlar o fluxo de energia elétrica"
    ],
    correct: 1
  },
  {
    question: "O que indica o triângulo dourado na CPU?",
    options: [
      "Posição do dissipador",
      "Local de encaixe da ventoinha",
      "Pino 1 da CPU, usado para alinhamento no soquete",
      "Ponto de aplicação da pasta térmica"
    ],
    correct: 2
  },
  {
    question: "O que deve ser feito antes de encaixar a CPU no soquete?",
    options: [
      "Aplicar pasta térmica",
      "Levantar a alavanca de travamento do soquete",
      "Ligar o computador para testar a energia",
      "Limpar com álcool isopropílico o cooler"
    ],
    correct: 1
  },
  {
    question: "Qual é a quantidade correta de pasta térmica a ser aplicada na CPU?",
    options: [
      "Uma camada grossa por toda a superfície",
      "Nenhuma, se o cooler for novo",
      "Uma gota do tamanho de uma ervilha no centro",
      "Várias gotas pequenas em cada canto"
    ],
    correct: 2
  },
  {
    question: "O que acontece se a CPU for instalada com a orientação errada?",
    options: [
      "Ela não encaixa corretamente e pode danificar os pinos",
      "O desempenho será menor",
      "O sistema funcionará mais quente",
      "Nada acontece, o encaixe é universal"
    ],
    correct: 0
  },
  {
    question: "Qual o objetivo do dissipador de calor (cooler)?",
    options: [
      "Reduzir a temperatura da CPU durante o uso",
      "Aumentar a velocidade do processador",
      "Estabilizar a energia elétrica da placa-mãe",
      "Fornecer energia à ventoinha"
    ],
    correct: 0
  },
  {
    question: "Qual é a sequência ideal ao parafusar o dissipador?",
    options: [
      "Apertar todos os parafusos em linha",
      "Apertar um de cada vez até o fim",
      "Apertar em cruz (diagonalmente) para distribuir a pressão",
      "Apertar apenas dois parafusos"
    ],
    correct: 2
  },
  {
    question: "Qual é a função da pasta térmica?",
    options: [
      "Isolar eletricamente a CPU",
      "Melhorar a condução de calor entre CPU e dissipador",
      "Lubrificar o cooler",
      "Fixar a ventoinha na CPU"
    ],
    correct: 1
  },
  {
    question: "Após instalar o dissipador, o que deve ser conectado à placa-mãe?",
    options: [
      "O cabo do ventilador (CPU_FAN)",
      "O cabo de vídeo",
      "O conector de energia SATA",
      "O LED frontal"
    ],
    correct: 0
  },
  {
    question: "Por que é importante fixar bem o dissipador?",
    options: [
      "Para reduzir ruído e vibração",
      "Para garantir boa troca térmica e evitar superaquecimento",
      "Para evitar interferência com outros componentes",
      "Para evitar curto-circuito"
    ],
    correct: 1
  }
];

const unidadeAtual = 7;      // 👈 Mude aqui para a unidade atual
const proximaUnidade = 8;    // 👈 Mude aqui para a próxima unidade

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