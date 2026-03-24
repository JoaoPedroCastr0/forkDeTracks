console.log("TASK CONTROLLER CARREGADO");
import { getTasksRequest, createTaskRequest, deleteTaskRequest, updateTaskRequest } from "../services/api.js";

async function createTask() {
  const title = document.getElementById("taskInput").value;

  await createTaskRequest(title);
  listTasks();
}

async function listTasks() {
  const tasks = await getTasksRequest();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerText = task.title;

    // 🔴 BOTÃO EXCLUIR
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Excluir";

    deleteBtn.onclick = async () => {
      await deleteTaskRequest(task.id);
      listTasks();
    };

    // 🟡 BOTÃO EDITAR
    const editBtn = document.createElement("button");
    editBtn.innerText = "Editar";

    editBtn.onclick = async () => {
      const novoTitulo = prompt("Novo título:");
      if (!novoTitulo) return;

      await updateTaskRequest(task.id, novoTitulo);
      listTasks();
    };

    // 🔥 IMPORTANTE: adicionar botões no li
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    // 🔥 adicionar li na lista
    list.appendChild(li);
  });
}

window.createTask = createTask;

if (localStorage.getItem("token")) {
  listTasks();
}

tasks.forEach(task => {
  const li = document.createElement("li");
  li.innerText = task.title;

  const btn = document.createElement("button");
  btn.innerText = "Excluir";

  btn.onclick = async () => {
    await deleteTaskRequest(task.id);
    listTasks();
  };

  li.appendChild(btn);
  list.appendChild(li);
});

export async function updateTask(req, res) {
  const { id } = req.params;
  const { title } = req.body;

  await taskService.updateTask(Number(id), title);

  return res.json({ message: "Task atualizada" });
}

const editBtn = document.createElement("button");
editBtn.innerText = "Editar";

editBtn.onclick = async () => {
  console.log("CLICOU EM EDIT", task.id);

  const novoTitulo = prompt("Novo título:");
  if (!novoTitulo) return;

  await updateTaskRequest(task.id, novoTitulo);
  listTasks();
};

li.appendChild(editBtn);

tasks.forEach(task => {
  const li = document.createElement("li");
  li.innerText = task.title;

  // 🔴 BOTÃO DELETE
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Excluir";

  deleteBtn.onclick = async () => {
    console.log("CLICOU EM DELETE", task.id);

    await deleteTaskRequest(task.id);
    listTasks(); // recarrega lista
  };

  li.appendChild(deleteBtn);
  list.appendChild(li);
});

window.listTasks = listTasks;