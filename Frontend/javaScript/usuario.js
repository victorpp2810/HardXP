// javaScript/usuario.js - versão consolidada
(() => {
  const baseUrl = window.BASE_API_URL || "http://localhost:2000";
  const userId = localStorage.getItem("id");

  let currentTab = 'personal';
  let editMode = {};

  const dbg = (...args) => console.log("[usuario.js]", ...args);

  // ---------- Carregar usuário ----------
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

      // Atualiza dados do DOM
      setTextIfExists('fullNameDisplay', user.nome || '—');
      setTextIfExists('emailDisplay', user.email || '—');
      setTextIfExists('cpfDisplay', user.cpf || '—');
      setValueIfExists('fullNameEdit', user.nome || '');
      setValueIfExists('emailEdit', user.email || '');
      setValueIfExists('cpfEdit', user.cpf || '');

      // Header
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

  // ---------- Helpers ----------
  function setTextIfExists(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function setValueIfExists(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  // ---------- Tabs ----------
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

  // ---------- Edição ----------
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

  // ---------- Salvar alterações ----------
  async function saveChanges(section) {
    if (!userId) return alert("Usuário não identificado.");
    const container = document.getElementById(section);
    if (!container) return alert("Seção não encontrada.");

    const nome = container.querySelector('#fullNameEdit')?.value || '';
    const email = container.querySelector('#emailEdit')?.value || '';
    const cpf = container.querySelector('#cpfEdit')?.value || '';

    if (!nome) return alert("Nome obrigatório.");
    if (!email || !email.includes('@')) return alert("Email inválido.");
    if (!cpf) return alert("CPF obrigatório.");

    const payload = { nome, email, cpf };

    try {
      const res = await fetch(`${baseUrl}/${userId}/usuario`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!res.ok) throw new Error("Falha ao salvar dados.");

      setTextIfExists('fullNameDisplay', nome);
      setTextIfExists('emailDisplay', email);
      setTextIfExists('cpfDisplay', cpf);

      const headerName = document.getElementById('userName');
      if (headerName) headerName.textContent = nome.split(' ').slice(0,2).join(' ');
      setTextIfExists('userEmail', email);

      alert("Dados atualizados com sucesso!");
      if (editMode[section]) toggleEdit(section);
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      alert("Erro ao salvar alterações.");
    }
  }

  // ---------- Upload de foto ----------
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

  // ---------- Máscaras ----------
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
  document.addEventListener('DOMContentLoaded', () => {
    attachMasks();
    showTab(currentTab);
    carregarUsuario();
    setupAvatarUpload();
    dbg("usuario.js inicializado.");
  });
})();
