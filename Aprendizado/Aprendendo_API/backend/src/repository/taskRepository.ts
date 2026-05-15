import { prisma } from '../database/prisma';

export async function createTask(
  title: string,
  description: string | null,
  userId: string,
) {
  return await prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });
}

export async function getTasksByUser(userId: string) {
  return await prisma.task.findMany({
    where: {
      userId,
      deletedAt: null, // Apenas tarefas não deletadas
    },
  });
}

export async function deleteTask(id: string, userId: string) {
  return await prisma.task.update({
    where: { id, userId },
    data: { deletedAt: new Date() }, // Soft delete
  });
}

export async function toggleTaskCompletion(
  id: string,
  completed: boolean,
  userId: string,
) {
  return await prisma.task.update({
    where: { id, userId },
    data: { completed },
  });
}

export async function updateTask(
  id: string,
  title: string,
  description: string | null,
  userId: string,
) {
  return await prisma.task.update({
    where: { id, userId },
    data: { title, description },
  });
}
