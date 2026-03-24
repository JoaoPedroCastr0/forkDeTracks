import { loginRequest, saveToken, getTasksRequest,createTaskRequest} from "./services/api.js";
import "./controllers/authController.js";
import "./controllers/taskController.js";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = await loginRequest(email, password);

  saveToken(data.token);

  alert("Logado!");
  listTasks();
}

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
    list.appendChild(li);
  });
}

window.login = login;
window.createTask = createTask;