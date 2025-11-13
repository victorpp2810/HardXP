document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;  

    try {
        const resposta = await fetch("http://localhost:2000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, senha})
        });
        console.log(resposta);
        if (resposta.ok) {
            const resultado = await resposta.json();
            console.log(resultado);
            // alert("Login realizado com sucesso!");
            
            const usuario = resultado.usuario
            localStorage.setItem("id", usuario.idUsuario);
            localStorage.setItem("nome", usuario.nome);
            
            window.location.href = "menuPrincipal.html";
        } else {
            alert("Erro ao logar o usuário. Por favor, tente novamente.");
            // console.log("Erro ao logar o usuário:", await resposta.text());
        }
    } catch (error) {
        console.error("Erro ao cadastrar o usuário:", error);
        alert("Erro ao logar o usuário. Por favor, tente novamente.");
        // console.log("Erro ao cadastrar o usuário(catch):", await resposta.text());
    }

});