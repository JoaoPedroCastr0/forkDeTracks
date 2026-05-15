import * as trashRepo from '../repository/trashRepository';

export async function listDeletedTasksService(userId: string) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('UserId inválido');
  }

  return await trashRepo.getDeletedTasksByUser(userId);
}

export async function restoreTaskService(id: string, userId: string) {
  if (!id || typeof id !== 'string') {
    throw new Error('ID inválido');
  }

  return await trashRepo.restoreTask(id, userId);
}

export async function permanentDeleteTaskService(id: string, userId: string) {
  if (!id || typeof id !== 'string') {
    throw new Error('ID inválido');
  }

  return await trashRepo.permanentDeleteTask(id, userId);
}
