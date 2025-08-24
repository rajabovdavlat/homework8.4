"use strict";
function init() {
    const input = document.querySelector("#new-todo");
    const addBtn = document.querySelector("#add-todo");
    const list = document.querySelector("#todo-list");
    const itemsLeft = document.querySelector("#items-left");
    const themeToggle = document.querySelector("#theme-toggle");
    // ==== State ====
    let currentFilter = "all";
    let todos = loadTodos();
    // ==== LocalStorage ====
    function loadTodos() {
        try {
            const raw = localStorage.getItem("todos");
            return raw ? JSON.parse(raw) : [];
        }
        catch (_a) {
            return [];
        }
    }
    function saveTodos() {
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    // ==== Utils ====
    const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    // ==== Render ====
    function render() {
        list.innerHTML = "";
        let filtered = todos;
        if (currentFilter === "active")
            filtered = todos.filter((t) => !t.completed);
        if (currentFilter === "completed")
            filtered = todos.filter((t) => t.completed);
        for (const todo of filtered) {
            const li = document.createElement("li");
            const left = document.createElement("div");
            left.className = "todo-left";
            const chk = document.createElement("button");
            chk.type = "button";
            chk.className = "todo-checkbox" + (todo.completed ? " checked" : "");
            chk.setAttribute("aria-label", "Toggle todo");
            chk.onclick = () => {
                todos = todos.map((t) => (t.id === todo.id ? Object.assign(Object.assign({}, t), { completed: !t.completed }) : t));
                saveTodos();
                render();
            };
            const text = document.createElement("span");
            text.className = "todo-text";
            text.textContent = todo.text;
            if (todo.completed)
                text.classList.add("completed");
            left.appendChild(chk);
            left.appendChild(text);
            const del = document.createElement("button");
            del.className = "delete-btn";
            del.type = "button";
            del.textContent = "✖";
            del.setAttribute("aria-label", "Delete todo");
            del.onclick = () => {
                todos = todos.filter((t) => t.id !== todo.id);
                saveTodos();
                render();
            };
            li.appendChild(left);
            li.appendChild(del);
            list.appendChild(li);
        }
        itemsLeft.textContent = `${todos.filter((t) => !t.completed).length} items left`;
    }
    // ==== Add ====
    function addTodo() {
        const text = input.value.trim();
        if (!text)
            return;
        const newTodo = { id: uid(), text, completed: false };
        todos = [newTodo, ...todos];
        saveTodos();
        input.value = "";
        render();
    }
    input.addEventListener("keypress", (e) => { if (e.key === "Enter")
        addTodo(); });
    addBtn.addEventListener("click", addTodo);
    // ==== Theme ====
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    });
    // ==== Filters ====
    document.querySelector("#all").onclick = () => { currentFilter = "all"; render(); };
    document.querySelector("#active").onclick = () => { currentFilter = "active"; render(); };
    document.querySelector("#completed").onclick = () => { currentFilter = "completed"; render(); };
    // ==== Clear completed ====
    document.querySelector("#clear-completed").onclick = () => {
        todos = todos.filter((t) => !t.completed);
        saveTodos();
        render();
    };
    // ==== First render ====
    render();
}
// Запускаем ТОЛЬКО когда DOM готов
window.addEventListener("DOMContentLoaded", init);
//# sourceMappingURL=mian.js.map