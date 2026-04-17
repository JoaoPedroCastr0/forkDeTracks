import { prisma } from "../database/prisma"


export async function createUser(
  nome: string,
  email: string,
  password: string
) {
  return await prisma.user.create({
    data: {
      nome,
      email,
      password
    }
  })
}

export async function findUserByEmail(
  email: string
) {
  return await prisma.user.findUnique({
    where: {
      email
    }
  })
}