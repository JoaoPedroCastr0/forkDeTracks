console.log("AUTH CONTROLLER CARREGADO");

import {
  loginRequest,
  saveToken
} from "../services/api.js";

// 🟢 REGISTER
async function register() {
  console.log("CHAMANDO REGISTER 🔥");

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:4000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Erro ao registrar");
      console.log(data);
      return;
    }

    alert("Usuário criado com sucesso!");
  } catch (err) {
    console.error("ERRO:", err);
    alert("Erro na conexão com o servidor");
  }
}

// 🔵 LOGIN
async function login() {
  console.log("CHAMANDO LOGIN 🔥");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await loginRequest(email, password);

    saveToken(data.token);

    alert("Logado com sucesso!");

    // 🔥 chama listTasks do outro controller
    if (window.listTasks) {
      window.listTasks();
    }

  } catch (err) {
    console.error("ERRO LOGIN:", err);
    alert("Erro ao logar");
  }
}

// 🔥 EXPOR PRO HTML
window.register = register;
window.login = login;