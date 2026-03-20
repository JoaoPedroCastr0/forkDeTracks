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