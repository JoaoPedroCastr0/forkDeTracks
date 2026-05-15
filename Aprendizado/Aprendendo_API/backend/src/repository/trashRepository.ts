import { prisma } from '../database/prisma';

export async function getDeletedTasksByUser(userId: string) {
  return await prisma.task.findMany({
    where: {
      userId,
      deletedAt: { not: null }, // Apenas tarefas na lixeira
    },
  });
}

export async function restoreTask(id: string, userId: string) {
  return await prisma.task.update({
    where: { id, userId },
    data: { deletedAt: null }, // Restaurar
  });
}

export async function permanentDeleteTask(id: string, userId: string) {
  return await prisma.task.delete({
    where: { id, userId },
  });
}
