async function finalizarUnidade(numeroDaUnidade, proximaUnidade) {
  try {
    const usuarioId = localStorage.getItem("id");
    if (!usuarioId) {
      console.error("Usuário não logado.");
      return;
    }

    // Salvar progresso no banco
    const res = await fetch("http://localhost:2000/progresso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId,
        unidade: numeroDaUnidade
      })
    });

    const json = await res.json();
    console.log("Progresso salvo no backend:", json);

    // Salvar XP relativo ao QUIZ (10000 pontos)
    await fetch(`http://localhost:2000/usuario/${usuarioId}/adicionarXP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xp: 10000 })
    });

    console.log(`XP +10000 enviado para o usuário ${usuarioId}`);

    // Atualizar progresso local
    if (typeof marcarConcluida === "function") {
      marcarConcluida(numeroDaUnidade - 1);
    }

    // Redirecionar apenas depois de tudo OK
    console.log("Redirecionando para a próxima unidade...");

    setTimeout(() => {
      window.location.href = `../unidades/unidade0${proximaUnidade}.html`;
    }, 1500);

  } catch (err) {
    console.error("Erro ao finalizar a unidade:", err);
  }
}
