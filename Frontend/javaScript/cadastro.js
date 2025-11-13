document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const username = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const cpf = document.getElementById("cpf").value;
    const password = document.getElementById("password").value;  
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("As senhas não coincidem. Por favor, tente novamente.");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:2000/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fullName: username, email, cpf, password })
        });
        
        if (resposta.ok) {
            alert("Cadastro realizado com sucesso!");
            
        } else {
            alert("Erro ao cadastrar o usuário. Por favor, tente novamente.");
            console.log("Erro ao cadastrar o usuário:", await resposta.text());
        }
        window.location.href = "login.html";
    } catch (error) {
        console.error("Erro ao cadastrar o usuário:", error);
        alert("Erro ao cadastrar o usuário. Por favor, tente novamente.");
        console.log("Erro ao cadastrar o usuário(catch):", await resposta.text());
    }

});

{/* <input type="text" id="cpf" maxlength="14" placeholder="000.000.000-00"> */}

document.getElementById('cpf').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ''); // remove tudo que não for número
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = value;
});

