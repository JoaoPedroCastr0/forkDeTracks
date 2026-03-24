const API = "http://localhost:4000";

export function getToken() {
  return localStorage.getItem("token");
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export async function loginRequest(email, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}

export async function getTasksRequest() {
  const res = await fetch(`${API}/tasks`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
}

export async function createTaskRequest(title) {
  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ title })
  });
}

export async function deleteTaskRequest(id) {
  await fetch(`http://localhost:4000/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
}

export async function updateTaskRequest(id, title) {
  await fetch(`http://localhost:4000/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ title })
  });
}