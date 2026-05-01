
const model = new TaskModel();
const taskView = new TaskView();
const commonView = new CommonView();

function injetarDadosIniciais() {

    if (model.users.length === 0) {
        const dadosMock = {
            users: [
                {
                    id: 1,
                    name: "Admin",
                    email: "admin@mindstep.pt",
                    password: "admin123",
                    role: "admin",
                    pontos: 100,
                    nivel: 3,
                    favoritos: []
                },
                {
                    id: 2,
                    name: "João Silva",
                    email: "joao@mindstep.pt",
                    password: "joao123",
                    role: "user",
                    pontos: 20,
                    nivel: 1,
                    favoritos: []
                }
            ],
            tasks: [
                {
                    id: 100,
                    userId: 2,
                    titulo: "Estudar para o teste de matemática",
                    descricao: "Rever os capítulos 3 e 4 do manual",
                    prazo: "2025-06-10",
                    concluida: false,
                    dataCriacao: "01/05/2025"
                },
                {
                    id: 101,
                    userId: 2,
                    titulo: "Entregar trabalho de história",
                    descricao: "Trabalho em grupo sobre a Revolução Industrial",
                    prazo: "2025-05-20",
                    concluida: true,
                    dataCriacao: "28/04/2025"
                }
            ]
        };

        localStorage.setItem("mindstep_users", JSON.stringify(dadosMock.users));
        localStorage.setItem("mindstep_tasks", JSON.stringify(dadosMock.tasks));

        model.users = dadosMock.users;
        model.tasks = dadosMock.tasks;

        console.log("[MindStep] Dados iniciais injetados com sucesso.");
    }
}

function mostrarHome() {
    commonView.mostrarPaginaInicial(true);
    commonView.mostrarPainelAuth(false);
    commonView.mostrarPainelApp(false);
}

function mostrarAuth() {
    commonView.mostrarPaginaInicial(false);
    commonView.mostrarPainelAuth(true);
    commonView.mostrarPainelApp(false);
}

function mostrarApp() {
    commonView.mostrarPaginaInicial(false);
    commonView.mostrarPainelAuth(false);
    commonView.mostrarPainelApp(true);
    atualizarVista();
}

function atualizarVista() {
    const tarefas = model.getTasksByUser();
    const concluidas = tarefas.filter(t => t.concluida).length;
    const container = document.getElementById("lista-tarefas");

    taskView.renderTarefas(tarefas, container);
    taskView.renderEstatisticas(
        model.getPontosUser(),
        model.getNivelUser(),
        tarefas.length,
        concluidas
    );
    commonView.renderHeader(model.currentUser);
}

document.getElementById("btn-login-nav")?.addEventListener("click", mostrarAuth);

document.getElementById("btn-sair")?.addEventListener("click", () => {
    model.logoutUser();
    commonView.renderHeader(null);
    mostrarHome();
});

document.querySelectorAll(".aba-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        commonView.alternarAbas(btn.dataset.aba);
    });
});

document.getElementById("btn-entrar")?.addEventListener("click", () => {
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-pass").value.trim();

    const user = model.loginUser(email, pass);
    if (user) {
        mostrarApp();
        setTimeout(() => {
            commonView.mostrarNotificacao(`Bem-vindo de volta, ${user.name}! 🌟`);
        }, 500);
    } else {
        commonView.mostrarErroAuth("Email ou password incorretos.");
    }
});

document.getElementById("btn-registar")?.addEventListener("click", () => {
    const nome = document.getElementById("reg-nome").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-pass").value.trim();

    if (!nome || !email || !pass) {
        commonView.mostrarErroAuth("Preenche todos os campos.");
        return;
    }

    const ok = model.registerUser(nome, email, pass);
    if (ok) {
        model.loginUser(email, pass);
        mostrarApp();
        setTimeout(() => {
            commonView.mostrarNotificacao(`Conta criada com sucesso! Bem-vindo, ${nome}! 🎉`);
        }, 500);
    } else {
        commonView.mostrarErroAuth("Esse email já está registado.");
    }
});

document.getElementById("btn-nova-tarefa")?.addEventListener("click", () => {
    taskView.toggleFormulario(true);
});

document.getElementById("btn-cancelar")?.addEventListener("click", () => {
    taskView.toggleFormulario(false);
    taskView.limparFormulario();
});

document.getElementById("btn-guardar")?.addEventListener("click", () => {
    const titulo = document.getElementById("input-titulo").value.trim();
    const descricao = document.getElementById("input-descricao").value.trim();
    const prazo = document.getElementById("input-prazo").value;

    if (!titulo || !prazo) {
        taskView.mostrarMensagem("O título e o prazo são obrigatórios.", "erro");
        return;
    }

    model.addTask(titulo, descricao, prazo);
    taskView.toggleFormulario(false);
    taskView.limparFormulario();
    taskView.mostrarMensagem("Objetivo adicionado! +5 pontos quando o concluíres 🎯", "sucesso");
    atualizarVista();
});

document.getElementById("lista-tarefas")?.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id);

    if (e.target.classList.contains("btn-concluir")) {
        model.completeTask(id);
        atualizarVista();
        taskView.mostrarMensagem("Objetivo concluído! +10 pontos 🏆", "sucesso");

        const frases = [
            "Fantástico! Estás a ir muito bem! 💪",
            "Mais um objetivo concluído! Continua assim! 🚀",
            "Incrível! O teu esforço está a dar frutos! ⭐"
        ];
        const frase = frases[Math.floor(Math.random() * frases.length)];
        setTimeout(() => commonView.mostrarNotificacao(frase), 600);
    }

    if (e.target.classList.contains("btn-apagar")) {
        model.deleteTask(id);
        atualizarVista();
    }
});

function verificarNotificacoesPendentes() {
    if (!model.currentUser) return;

    const tarefas = model.getTasksByUser();
    const pendentes = tarefas.filter(t => !t.concluida);

    if (pendentes.length > 0) {
        const tarefa = pendentes[Math.floor(Math.random() * pendentes.length)];
        commonView.mostrarNotificacao(
            `Lembrete: ainda tens "${tarefa.titulo}" por concluir! 📋`
        );
    }
}

setInterval(verificarNotificacoesPendentes, 30000);
injetarDadosIniciais();

if (model.currentUser) {
    mostrarApp();
} else {
    mostrarHome();
}

console.log("[MindStep] Aplicação iniciada com sucesso.");