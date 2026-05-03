import * as taskRepo from "../repository/taskRepository";
import type { CreateTaskDTO } from "../schemas/taskSchema";

export async function createTaskService(
  data: CreateTaskDTO,
  userId: string
) {
  if (!data.title || data.title.trim() === "") {
    throw new Error("Título é obrigatório");
  }

  return await taskRepo.createTask(
    data.title,
    data.description ?? null,
    userId
  );
}

export async function listTasksService(userId: string) {
  if (!userId || typeof userId !== "string") {
    throw new Error("UserId inválido");
  }

  return await taskRepo.getTasksByUser(userId);
}

export async function deleteTaskService(id: string) {
  if (!id || typeof id !== "string") {
    throw new Error("ID inválido");
  }

  return await taskRepo.deleteTask(id);
}

export async function updateTaskService(id: string, title: string) {
  if (!id || typeof id !== "string") {
    throw new Error("ID inválido");
  }

  if (!title || title.trim() === "") {
    throw new Error("Título é obrigatório");
  }

  return await taskRepo.updateTask(id, title);
}