import type { Request, Response } from "express";
import {
  createTaskService,
  listTasksService,
  deleteTaskService,
  updateTaskService
} from "../services/taskService";
import type { UpdateTaskDTO } from "src/schemas/taskSchema";

export async function createTask(req: Request, res: Response) {
  const userId = req.user!.id;

  await createTaskService(req.body, userId);

  return res.status(201).json({
    message: "Tarefa criada com sucesso"
  });
}

export async function listTasks(req: Request, res: Response) {
  const userId = req.user!.id;

  const tasks = await listTasksService(userId);

  return res.json(tasks);
}

export async function deleteTask(req: Request, res: Response) {
  const { id } = req.params;

  await deleteTaskService(Number(id));

  return res.json({ message: "Task removida" });
}

export async function updateTask(
  req: Request<{ id: string }, {}, UpdateTaskDTO>,
  res: Response
) {
  const id = Number(req.params.id);

  const { title } = req.body;

  await updateTaskService(id, title);

  return res.json({ message: "Task atualizada" });
}