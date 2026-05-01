class TaskModel {
    constructor() {

        this.tasks = JSON.parse(localStorage.getItem("mindstep_tasks")) || [];
        this.users = JSON.parse(localStorage.getItem("mindstep_users")) || [];
        this.currentUser = JSON.parse(localStorage.getItem("mindstep_currentUser")) || null;
    }

    registerUser(name, email, password) {
        const existe = this.users.find(u => u.email === email);
        if (existe) return false;

        const novoUser = {
            id: Date.now(),
            name,
            email,
            password,
            role: "user",
            pontos: 0,
            nivel: 1,
            favoritos: []
        };
        this.users.push(novoUser);
        this._saveUsers();
        return true;
    }

    loginUser(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem("mindstep_currentUser", JSON.stringify(user));
            return user;
        }
        return null;
    }

    logoutUser() {
        this.currentUser = null;
        localStorage.removeItem("mindstep_currentUser");
    }

    addTask(titulo, descricao, prazo) {
        if (!this.currentUser) return false;

        const novaTarefa = {
            id: Date.now(),
            userId: this.currentUser.id,
            titulo,
            descricao,
            prazo,
            concluida: false,
            dataCriacao: new Date().toLocaleDateString("pt-PT")
        };
        this.tasks.push(novaTarefa);
        this._saveTasks();
        return novaTarefa;
    }

    getTasksByUser() {
        if (!this.currentUser) return [];
        return this.tasks.filter(t => t.userId === this.currentUser.id);
    }

    completeTask(id) {
        const tarefa = this.tasks.find(t => t.id === id);
        if (tarefa) {
            tarefa.concluida = true;
            this._saveTasks();

            this._adicionarPontos(10);
            return true;
        }
        return false;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this._saveTasks();
    }


    _adicionarPontos(quantidade) {
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex].pontos += quantidade;
            this.users[userIndex].nivel = Math.floor(this.users[userIndex].pontos / 50) + 1;
            this.currentUser = this.users[userIndex];
            localStorage.setItem("mindstep_currentUser", JSON.stringify(this.currentUser));
            this._saveUsers();
        }
    }

    getPontosUser() {
        return this.currentUser ? this.currentUser.pontos : 0;
    }

    getNivelUser() {
        return this.currentUser ? this.currentUser.nivel : 1;
    }


    _saveTasks() {
        localStorage.setItem("mindstep_tasks", JSON.stringify(this.tasks));
    }

    _saveUsers() {
        localStorage.setItem("mindstep_users", JSON.stringify(this.users));
    }
}