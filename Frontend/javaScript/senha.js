const form = document.getElementById("loginForm");
if (form) {
  form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem. Por favor, tente novamente.");
      return;
    }

    const id = localStorage.getItem("id");

    try {
      const resp = await fetch(`http://localhost:2000/${id}/senha`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha })
      });

      if (resp.ok) {
        alert("Senha trocada com sucesso!");
        window.location.href = "usuario.html";
      } else {
        alert("Erro ao trocar a senha. Por favor, tente novamente.");
        console.log("Erro ao trocar a senha:", await resp.text());
      }
    } catch (err) {
      console.error("Erro de rede:", err);
      alert("Erro de rede. Tente novamente mais tarde.");
    }
  });
}
