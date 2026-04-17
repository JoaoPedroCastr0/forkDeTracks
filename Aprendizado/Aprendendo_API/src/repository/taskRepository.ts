import { prisma } from "../database/prisma"


export async function createTask(
  title: string,
  description: string | null,
  userId: number
) {
  return await prisma.task.create({
    data: {
      title,
      description,
      userId
    }
  })
}

export async function getTasksByUser(userId: number) {
  return await prisma.task.findMany({
    where: { userId }
  })
}

export async function deleteTask(id: number) {
  return await prisma.task.delete({
    where: { id }
  })
}

export async function updateTask(
  id: number,
  title: string
) {
  return await prisma.task.update({
    where: { id },
    data: { title }
  })
}