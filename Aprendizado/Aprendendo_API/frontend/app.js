const API = "http://localhost:4000"; // muda se necessário

// 🔐 SALVAR TOKEN
function saveToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

// 👤 REGISTER
async function register() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, password })
  });

  alert("Usuário criado");
}

// 🔑 LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  saveToken(data.token); // 🔥 aqui salva o JWT

  alert("Logado!");
  listTasks();
}

// ✅ CRIAR TASK
async function createTask() {
  const title = document.getElementById("taskInput").value;

  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify({ title })
  });

  listTasks();
}

// 📋 LISTAR TASKS
async function listTasks() {
  const res = await fetch(`${API}/tasks`, {
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  });

  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerText = task.title;
    list.appendChild(li);
  });
}

// 🔄 AUTO CARREGAR SE JÁ ESTIVER LOGADO
if (getToken()) {
  listTasks();
}