import type { Request, Response } from 'express';
import type { UpdateTaskDTO } from '@/schemas/taskSchema';
import {
  createTaskService,
  deleteTaskService,
  listTasksService,
  toggleTaskCompletionService,
  updateTaskService,
} from '../services/taskService';

export async function createTask(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const task = await createTaskService(req.body, userId);

    return res.status(201).json(task);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Erro ao criar tarefa',
    });
  }
}

export async function listTasks(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const tasks = await listTasksService(userId);

    return res.json(tasks);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Erro ao listar tarefas',
    });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await deleteTaskService(id as string, userId);

    return res.json({ message: 'Task movida para a lixeira' });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Erro ao deletar tarefa',
    });
  }
}

export async function toggleTaskCompletion(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { completed } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const task = await toggleTaskCompletionService(
      id as string,
      completed,
      userId,
    );

    return res.json(task);
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : 'Erro ao alterar status da tarefa',
    });
  }
}

export async function updateTask(
  req: Request<{ id: string }, Record<string, never>, UpdateTaskDTO>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { title, description } = req.body;

    const task = await updateTaskService(
      id as string,
      title,
      description,
      userId,
    );

    return res.json(task);
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : 'Erro ao atualizar tarefa',
    });
  }
}
