async function carregarRanking() {
  const tbody = document.querySelector("#rankingTable tbody");
  tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Carregando...</td></tr>`;

  try {
    const res = await fetch("http://localhost:2000/ranking");

    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }

    const data = await res.json();
    tbody.innerHTML = "";

    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Nenhum dado disponível</td></tr>`;
      return;
    }

    data.forEach((user, i) => {
      let medalha = "";
      if (i === 0) medalha = "🥇";
      else if (i === 1) medalha = "🥈";
      else if (i === 2) medalha = "🥉";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${medalha || i + 1}</td>
        <td>${user.nome}</td>
        <td>${user.pontuacao ?? 0}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar ranking:", err);
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:red;">Erro ao carregar dados</td></tr>`;
  }
}

carregarRanking();
