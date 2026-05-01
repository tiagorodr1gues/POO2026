class CommonView {
    renderHeader(user) {
        const navUser = document.getElementById("nav-user");
        const navLogin = document.getElementById("nav-login");

        if (user) {
            if (navUser) {
                navUser.style.display = "flex";
                document.getElementById("nome-user").textContent = user.name;
            }
            if (navLogin) navLogin.style.display = "none";
        } else {
            if (navUser) navUser.style.display = "none";
            if (navLogin) navLogin.style.display = "flex";
        }
    }

    mostrarPainelAuth(mostrar) {
        const painel = document.getElementById("painel-auth");
        if (painel) painel.style.display = mostrar ? "flex" : "none";
    }

    mostrarPainelApp(mostrar) {
        const painel = document.getElementById("painel-app");
        if (painel) painel.style.display = mostrar ? "block" : "none";
    }

    mostrarPaginaInicial(mostrar) {
        const painel = document.getElementById("painel-home");
        if (painel) painel.style.display = mostrar ? "block" : "none";
    }

    mostrarNotificacao(mensagem) {
        const notif = document.createElement("div");
        notif.className = "notificacao-flutuante";
        notif.innerHTML = `<span>🔔 ${mensagem}</span>`;
        document.body.appendChild(notif);

        setTimeout(() => notif.classList.add("visivel"), 100);

        setTimeout(() => {
            notif.classList.remove("visivel");
            setTimeout(() => notif.remove(), 500);
        }, 5000);
    }

    alternarAbas(aba) {
        const loginForm = document.getElementById("form-login");
        const registoForm = document.getElementById("form-registo");
        const abas = document.querySelectorAll(".aba-btn");

        abas.forEach(a => a.classList.remove("ativa"));
        document.querySelector(`[data-aba="${aba}"]`).classList.add("ativa");

        if (aba === "login") {
            loginForm.style.display = "flex";
            registoForm.style.display = "none";
        } else {
            loginForm.style.display = "none";
            registoForm.style.display = "flex";
        }
    }

    mostrarErroAuth(msg) {
        const erroEl = document.getElementById("erro-auth");
        if (erroEl) {
            erroEl.textContent = msg;
            erroEl.style.display = "block";
            setTimeout(() => erroEl.style.display = "none", 4000);
        }
    }
}