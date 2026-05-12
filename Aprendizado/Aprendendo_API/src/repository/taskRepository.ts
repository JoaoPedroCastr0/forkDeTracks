import { prisma } from "../database/prisma"


export async function createTask(
  title: string,
  description: string | null,
  userId: string
) {
  return await prisma.task.create({
    data: {
      title,
      description,
      userId
    }
  })
}

export async function getTasksByUser(userId: string) {
  return await prisma.task.findMany({
    where: { 
      userId,
      deletedAt: null // Apenas tarefas não deletadas
    }
  })
}

export async function getDeletedTasksByUser(userId: string) {
  return await prisma.task.findMany({
    where: { 
      userId,
      deletedAt: { not: null } // Apenas tarefas na lixeira
    }
  })
}

export async function deleteTask(id: string) {
  return await prisma.task.update({
    where: { id },
    data: { deletedAt: new Date() } // Soft delete
  })
}

export async function restoreTask(id: string) {
  return await prisma.task.update({
    where: { id },
    data: { deletedAt: null } // Restaurar
  })
}

export async function permanentDeleteTask(id: string) {
  return await prisma.task.delete({
    where: { id }
  })
}

export async function toggleTaskCompletion(id: string, completed: boolean) {
  return await prisma.task.update({
    where: { id },
    data: { completed }
  })
}

export async function updateTask(
  id: string,
  title: string
) {
  return await prisma.task.update({
    where: { id },
    data: { title }
  })
}