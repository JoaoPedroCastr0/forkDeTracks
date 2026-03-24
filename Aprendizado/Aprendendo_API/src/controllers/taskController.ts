import type { Request, Response } from "express";
import { createTaskSchema } from "../schemas/taskSchema";
import {  createTaskService, listTasksService, deleteTaskService, updateTaskService} from "../services/taskService";

export async function createTask(req: Request, res: Response) {
  const data = createTaskSchema.parse(req.body);

  const userId = req.user!.id;

  await createTaskService(data, userId);

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

export async function updateTask(req: Request, res: Response) {
  const { id } = req.params;
  const { title } = req.body;

  await updateTaskService(Number(id), title);

  return res.json({ message: "Task atualizada" });
}