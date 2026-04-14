import { prisma } from "../database/prisma"


export async function createTask(
  title: string,
  description: string | null,
  userId: number
): Promise<Task> {
  return await prisma.task.create({
    data: {
      title,
      description,
      userId
    }
  })
}

export async function getTasksByUser(userId: number): Promise<Task[]> {
  return await prisma.task.findMany({
    where: { userId }
  })
}

export async function deleteTask(id: number): Promise<Task> {
  return await prisma.task.delete({
    where: { id }
  })
}

export async function updateTask(
  id: number,
  title: string
): Promise<Task> {
  return await prisma.task.update({
    where: { id },
    data: { title }
  })
}