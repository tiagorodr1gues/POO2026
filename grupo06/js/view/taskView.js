
class TaskView {

    renderTarefas(tarefas, containerEl) {
        containerEl.innerHTML = "";

        if (tarefas.length === 0) {
            containerEl.innerHTML = `
                <div class="sem-tarefas">
                    <p>🎯 Ainda não tens objetivos. Adiciona o teu primeiro!</p>
                </div>`;
            return;
        }

        tarefas.forEach(tarefa => {
            const div = document.createElement("div");
            div.className = `tarefa-card ${tarefa.concluida ? "concluida" : ""}`;
            div.dataset.id = tarefa.id;

            div.innerHTML = `
                <div class="tarefa-info">
                    <h3>${tarefa.titulo}</h3>
                    <p>${tarefa.descricao}</p>
                    <span class="prazo">📅 Prazo: ${tarefa.prazo}</span>
                </div>
                <div class="tarefa-acoes">
                    ${!tarefa.concluida
                        ? `<button class="btn-concluir" data-id="${tarefa.id}">✅ Concluir</button>`
                        : `<span class="badge-concluida">✔ Feito!</span>`
                    }
                    <button class="btn-apagar" data-id="${tarefa.id}">🗑️</button>
                </div>
            `;
            containerEl.appendChild(div);
        });
    }
    renderEstatisticas(pontos, nivel, totalTarefas, concluidas) {
        document.getElementById("stat-pontos").textContent = pontos;
        document.getElementById("stat-nivel").textContent = nivel;
        document.getElementById("stat-total").textContent = totalTarefas;
        document.getElementById("stat-concluidas").textContent = concluidas;

        const percentagem = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0;
        const barra = document.getElementById("barra-progresso");
        if (barra) barra.style.width = percentagem + "%";
        const pct = document.getElementById("progresso-pct");
        if (pct) pct.textContent = percentagem + "%";
    }

    toggleFormulario(mostrar) {
        const form = document.getElementById("form-tarefa");
        if (form) form.style.display = mostrar ? "flex" : "none";
    }

    limparFormulario() {
        document.getElementById("input-titulo").value = "";
        document.getElementById("input-descricao").value = "";
        document.getElementById("input-prazo").value = "";
    }

    mostrarMensagem(texto, tipo = "sucesso") {
        const msg = document.getElementById("mensagem");
        if (!msg) return;
        msg.textContent = texto;
        msg.className = `mensagem ${tipo}`;
        msg.style.display = "block";
        setTimeout(() => { msg.style.display = "none"; }, 3000);
    }
}