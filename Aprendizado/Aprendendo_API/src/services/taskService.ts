import * as taskRepo from "../repository/taskRepository";
import type { CreateTaskDTO } from "../schemas/taskSchema";

export async function createTaskService(
  data: CreateTaskDTO,
  userId: number
) {
  return await taskRepo.createTask(
    data.title,
    data.description ?? null,
    userId
  );
}

export async function listTasksService(userId: number) {
  return await taskRepo.getTasksByUser(userId);

}

export async function deleteTaskService(id: number) {
  if (!id) {
    throw new Error("ID inválido");
  }

  return taskRepo.deleteTask(id);
}

export async function updateTaskService(id: number, title: string) {
  if (!id) {
    throw new Error("ID inválido");
  }

  if (!title) {
    throw new Error("Título é obrigatório");
  }

  return taskRepo.updateTask(id, title);
}