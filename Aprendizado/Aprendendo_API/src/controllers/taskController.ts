import type { Request, Response } from "express";
import { createTaskSchema } from "../schemas/taskSchema";
import {  createTaskService, listTasksService } from "../services/taskService";

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