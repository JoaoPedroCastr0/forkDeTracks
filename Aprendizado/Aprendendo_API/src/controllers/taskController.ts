import type { Request, Response } from "express";
import {
  createTaskService,
  listTasksService,
  deleteTaskService,
  updateTaskService
} from "../services/taskService";
import type { UpdateTaskDTO } from "@/schemas/taskSchema";

export async function createTask(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const task = await createTaskService(req.body, userId);

    return res.status(201).json(task);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Erro ao criar tarefa"
    });
  }
}

export async function listTasks(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const tasks = await listTasksService(userId);

    return res.json(tasks);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Erro ao listar tarefas"
    });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }

    await deleteTaskService(id as string);

    return res.json({ message: "Task removida" });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Erro ao deletar tarefa"
    });
  }
}

export async function updateTask(
  req: Request<{ id: string }, {}, UpdateTaskDTO>,
  res: Response
) {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const { title } = req.body;

    const task = await updateTaskService(id as string, title);

    return res.json(task);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Erro ao atualizar tarefa"
    });
  }
}