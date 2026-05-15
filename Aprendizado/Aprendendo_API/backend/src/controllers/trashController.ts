import type { Request, Response } from 'express';
import {
  listDeletedTasksService,
  permanentDeleteTaskService,
  restoreTaskService,
} from '../services/trashService';

export async function listDeletedTasks(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const tasks = await listDeletedTasksService(userId);

    return res.json(tasks);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Erro ao listar lixeira',
    });
  }
}

export async function restoreTask(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await restoreTaskService(id as string, userId);

    return res.json({ message: 'Task restaurada' });
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : 'Erro ao restaurar tarefa',
    });
  }
}

export async function permanentDeleteTask(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await permanentDeleteTaskService(id as string, userId);

    return res.json({ message: 'Task removida permanentemente' });
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : 'Erro ao excluir permanentemente',
    });
  }
}
