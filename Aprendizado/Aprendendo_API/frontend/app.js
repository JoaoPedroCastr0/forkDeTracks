import { getToken, getTasksRequest, createTaskRequest, deleteTaskRequest, updateTaskRequest, logout as logoutService } from "./services/api.js";
import { login } from "./controllers/authController.js";
import "./controllers/taskController.js";
import "./controllers/authController.js"

localStorage.removeItem("token")

async function createTask() {
  const title = document.getElementById("taskInput").value;

  await createTaskRequest(title);
  listTasks();
}

async function listTasks() {
  try {
    const tasks = await getTasksRequest();

    console.log("TASKS:", tasks);

    if (!Array.isArray(tasks)) {
      console.error("Erro ao buscar tasks:", tasks);
      return;
    }

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");

      // 📝 título
      const title = document.createElement("span");
      title.innerText = task.title;

      // 🔴 botão deletar
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Excluir";

      deleteBtn.onclick = async () => {
        console.log("CLICK DELETE:", task.id);

        try {
          await deleteTaskRequest(task.id);
          listTasks();
        } catch (err) {
          console.error("Erro ao deletar:", err);
        }
      };

      // 🟡 botão editar
      const editBtn = document.createElement("button");
      editBtn.innerText = "Editar";

      editBtn.onclick = async () => {
        console.log("CLICK EDIT:", task.id);

        const novoTitulo = prompt("Novo título:", task.title);
        if (!novoTitulo) return;

        try {
          await updateTaskRequest(task.id, novoTitulo);
          listTasks();
        } catch (err) {
          console.error("Erro ao editar:", err);
        }
      };

      // montar item
      li.appendChild(title);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      list.appendChild(li);
    });

  } catch (error) {
    console.error("Erro geral ao carregar tasks:", error);
  }
}

function logout() {
  logoutService();
  alert("Você saiu da sessão");

  updateUI();
  document.getElementById("taskList").innerHTML = "";
  location.reload();
}

export function updateUI() {
  const isLogged = !!getToken();

  const auth = document.getElementById("authSection");
  const app = document.getElementById("appSection");

  if (isLogged) {
    auth.style.display = "none";
    app.style.display = "block";
  } else {
    auth.style.display = "block";
    app.style.display = "none";
  }
}

window.logout = logout;
window.login = login;
window.createTask = createTask;
window.listTasks = listTasks;