(() => {
  const baseUrl = window.BASE_API_URL || "http://localhost:2000";
  const userId = localStorage.getItem("id");

  let currentTab = 'personal';
  let editMode = {};

  const dbg = (...args) => console.log("[usuario.js]", ...args);

  async function carregarUsuario() {
    dbg("Iniciando carregarUsuario() - userId:", userId);
    if (!userId) {
      alert("Usuário não autenticado.");
      window.location.href = "login.html";
      return;
    }

    const url = `${baseUrl}/${userId}/usuario`;
    dbg("Fetch ->", url);

    try {
      const res = await fetch(url, { credentials: 'include' });
      dbg("Response status:", res.status);
      if (!res.ok) throw new Error(`Falha (${res.status}) ao buscar usuário.`);

      const user = await res.json();
      dbg("Dados do usuário recebidos:", user);

      setTextIfExists('fullNameDisplay', user.nome || '—');
      setTextIfExists('emailDisplay', user.email || '—');
      setTextIfExists('cpfDisplay', user.cpf || '—');
      setValueIfExists('fullNameEdit', user.nome || '');
      setValueIfExists('emailEdit', user.email || '');
      setValueIfExists('cpfEdit', user.cpf || '');

      document.getElementById('userName').textContent = user.nome || 'Usuário';
      setTextIfExists('userEmail', user.email || '');

      // Avatar
    const avatar = document.getElementById("avatarImg");
    try {
    const fotoRes = await fetch(`${baseUrl}/usuario/${userId}/foto`);
    if (fotoRes.ok) {
        const blob = await fotoRes.blob();
        avatar.src = URL.createObjectURL(blob);
    } else {
        avatar.src = "./images/user.png"; // padrão
    }
    } catch {
    avatar.src = "./images/user.png";
    }


      dbg("carregarUsuario() finalizado com sucesso.");
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
      alert("Erro ao carregar dados do usuário.");
    }
  }
  
async function carregarStats(id) {
  const res = await fetch(`${baseUrl}/usuario/${id}/stats`);
  const stats = await res.json();

  window.userStats = stats;

  document.querySelector("#statEtapas").innerText = stats.etapas;
  document.querySelector("#statPontuacao").innerText = stats.pontuacao;
  document.querySelector("#statRanking").innerText = stats.ranking || "-";
  document.querySelector("#statPorcentagem").innerText = stats.porcentagem + "%";

  document.querySelector("#statUltima").innerText =
    stats.ultimaAtividade
      ? `Unidade ${stats.ultimaAtividade}`
      : "Nenhuma atividade ainda";

  updateBadges(stats.pontuacao);
}




  function setTextIfExists(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function setValueIfExists(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    const pane = document.getElementById(tabName);
    if (pane) pane.classList.add('active');
    const btn = [...document.querySelectorAll('.tab-btn')]
      .find(b => (b.getAttribute('onclick') || '').includes(tabName));
    if (btn) btn.classList.add('active');
    currentTab = tabName;
  }

  function toggleEdit(section) {
    editMode[section] = !editMode[section];
    const container = document.getElementById(section);
    if (!container) return;

    const displays = container.querySelectorAll('.info-value > span');
    const inputs = container.querySelectorAll('.info-value input');
    const actions = document.getElementById(`${section}Actions`);
    const editBtn = container.querySelector('.edit-btn');

    if (editMode[section]) {
      displays.forEach(s => s.style.display = 'none');
      inputs.forEach(i => i.style.display = 'block');
      if (actions) actions.style.display = 'flex';
      if (editBtn) editBtn.innerHTML = '<i class="fas fa-times"></i> Cancelar';
    } else {
      displays.forEach(s => s.style.display = 'block');
      inputs.forEach(i => i.style.display = 'none');
      if (actions) actions.style.display = 'none';
      if (editBtn) editBtn.innerHTML = '<i class="fas fa-edit"></i> Editar';
    }
  }

  function cancelEdit(section) {
    const container = document.getElementById(section);
    if (!container) return;
    const spans = container.querySelectorAll('.info-value > span');
    const inputs = container.querySelectorAll('.info-value input');
    spans.forEach((span, idx) => {
      if (inputs[idx]) inputs[idx].value = span.textContent.trim() === '—' ? '' : span.textContent.trim();
    });
    if (editMode[section]) toggleEdit(section);
  }

function validateUserData(nome, email, cpf) {
  if (!nome.trim()) return "O nome não pode estar vazio.";
  if (!email.includes("@") || !email.includes(".")) return "Email inválido.";
  if (!cpf.trim()) return "CPF obrigatório.";
  return null;
}

function updateLocalFields(user) {
  setTextIfExists("fullNameDisplay", user.nome);
  setTextIfExists("emailDisplay", user.email);
  setTextIfExists("cpfDisplay", user.cpf);

  // Atualizar header
  const firstName = user.nome.split(" ")[0];
  document.getElementById("userName").textContent = firstName;
  setTextIfExists("userEmail", user.email);
}

async function saveChanges(section) {
  dbg("saveChanges() iniciada — seção:", section);

  if (!userId) {
    alert("Usuário não identificado.");
    return;
  }

  const container = document.getElementById(section);
  if (!container) {
    alert("Erro interno: seção não encontrada.");
    return;
  }

  // Pega os dados dos inputs
  const nome = document.getElementById("fullNameEdit")?.value || '';
  const email = document.getElementById("emailEdit")?.value || '';
  const cpf = document.getElementById("cpfEdit")?.value || '';

  // Validação
  const error = validateUserData(nome, email, cpf);
  if (error) {
    alert(error);
    return;
  }

  const payload = { nome, email, cpf };

  dbg("Enviando PUT com payload:", payload);

  try {
    const res = await fetch(`${baseUrl}/${userId}/usuario`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    dbg("Resposta do PUT:", res.status);

    if (!res.ok) {
      const txt = await res.text();
      console.error("Erro recebido do servidor:", txt);
      throw new Error("Falha ao atualizar os dados.");
    }

    // Atualiza a interface
    updateLocalFields(payload);

    alert("Dados atualizados com sucesso!");

    // 🔥 INSÍGNIAS — atualiza automaticamente
    if (window.userStats && userStats.pontuacao != null) {
      const badge = calculateBadge(userStats.pontuacao);
      updateBadgeUI(badge);
    }

    toggleEdit(section);
    dbg("saveChanges() finalizada com sucesso.");

  } catch (err) {
    console.error("Erro em saveChanges():", err);
    alert("Erro ao salvar alterações.");
  }
}


function calculateBadge(score) {
    if (score >= 100000) return "🧙‍♂️✨ Lendário";
    if (score >= 60000) return "🦾 Especialista";
    if (score >= 30000) return "🔥 Avançado";
    if (score >= 10000) return "⭐ Intermediário";
    return "🌱 Iniciante";
}

function getNextBadgeInfo(score) {
    if (score >= 100000) return { next: null, missing: 0 };
    if (score >= 60000) return { next: "🧙‍♂️✨ Lendário", missing: 100000 - score };
    if (score >= 30000) return { next: "🦾 Especialista", missing: 60000 - score };
    if (score >= 10000) return { next: "🔥 Avançado", missing: 30000 - score };
    return { next: "⭐ Intermediário", missing: 10000 - score };
}

function updateBadges(score) {
    const badge = calculateBadge(score);
    document.getElementById("currentBadge").textContent = badge;

    const { next, missing } = getNextBadgeInfo(score);

    const progressBar = document.getElementById("badgeProgressBar");
    const progressText = document.getElementById("badgeProgressText");

    if (!next) {
        progressBar.style.width = "100%";
        progressText.textContent = "Você alcançou a maior insígnia!";
        return;
    }

    let max;
    if (missing <= 10000) max = 10000;
    else if (missing <= 30000) max = 30000;
    else max = 60000;

    const progress = ((max - missing) / max) * 100;

    progressBar.style.width = progress + "%";
    progressText.textContent = `Faltam ${missing} pontos para a próxima insígnia (${next})`;
}



  function setupAvatarUpload() {
    const fotoInput = document.getElementById("fotoInput");
    const avatarImg = document.getElementById("avatarImg");

    window.changeAvatar = () => fotoInput.click();

    fotoInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("foto", file);

      try {
        const res = await fetch(`${baseUrl}/usuario/${userId}/foto`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Erro ao enviar foto.");

        const data = await res.json();
        avatarImg.src = URL.createObjectURL(file);
        alert("Foto de perfil atualizada!");
      } catch (err) {
        console.error("Erro no upload:", err);
        alert("Erro ao atualizar a foto.");
      }
    });
  }

  function attachMasks() {
    const cpfEl = document.getElementById('cpfEdit');
    if (cpfEl) cpfEl.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = v;
    });
  }

  async function deleteAccount() {
  const userId = localStorage.getItem("id");
  if (!userId) return alert("Usuário não identificado.");

  const confirmDelete = confirm(
    "Tem certeza que deseja excluir sua conta? Esta ação é irreversível."
  );
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:2000/${userId}/delete`, {
      method: "DELETE",
      credentials: "include", // se você estiver usando sessão/cookies
    });

    if (!res.ok) throw new Error("Erro ao excluir conta.");

    const data = await res.json();
    alert(data.message || "Conta deletada com sucesso!");
    localStorage.clear();
    window.location.href = "login.html";
  } catch (err) {
    console.error("Erro ao deletar conta:", err);
    alert("Não foi possível excluir a conta.");
  }
}

// Tornando acessível globalmente
window.deleteAccount = deleteAccount;
  // ---------- Funções públicas ----------
  window.showTab = showTab;
  window.toggleEdit = toggleEdit;
  window.cancelEdit = cancelEdit;
  window.saveChanges = saveChanges;
  window.deleteAccount = deleteAccount;
  window.goBack = () => window.history.back();

  // ---------- Inicialização ----------
  document.addEventListener("DOMContentLoaded", () => {
    attachMasks();
    showTab(currentTab);
    carregarUsuario();
    carregarStats(userId);   // <-- ISSO AQUI PRECISA EXISTIR
    setupAvatarUpload();
    dbg("usuario.js inicializado.");
});
})();
