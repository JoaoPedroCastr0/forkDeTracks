import { 
  getTasksRequest, 
  createTaskRequest, 
  deleteTaskRequest, 
  updateTaskRequest 
} from "../services/api.js";

async function createTask() {
  const title = document.getElementById("taskInput").value;

  await createTaskRequest(title);
  listTasks();
}

async function listTasks() {
  const tasks = await getTasksRequest();

  console.log("TASKS:", tasks); // ✅ agora sim

  if (!Array.isArray(tasks)) {
    console.error("Erro ao buscar tasks:", tasks);
    return;
  }

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    const title = document.createElement("span");
    title.innerText = task.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Excluir";
    deleteBtn.onclick = async () => {
      await deleteTaskRequest(task.id);
      listTasks();
    };

    const editBtn = document.createElement("button");
    editBtn.innerText = "Editar";
    editBtn.onclick = async () => {
      const novoTitulo = prompt("Novo título:", task.title);
      if (!novoTitulo) return;

      await updateTaskRequest(task.id, novoTitulo);
      listTasks();
    };

    li.appendChild(title);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

// auto carregar se tiver token
if (localStorage.getItem("token")) {
  listTasks();
}

window.createTask = createTask;
window.listTasks = listTasks;