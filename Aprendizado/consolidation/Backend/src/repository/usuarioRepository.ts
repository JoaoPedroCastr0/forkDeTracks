import type { User } from '@prisma/client';
import { prisma } from '../database/prisma';

export interface CriarUsuarioDbInput {
  nome: string;
  email: string;
  senhaHash: string;
}

export async function buscarUsuarioPorEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function buscarUsuarioPorId(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function criarUsuario(dados: CriarUsuarioDbInput): Promise<User> {
  return await prisma.user.create({
    data: {
      name: dados.nome,
      email: dados.email,
      senha: dados.senhaHash,
      papel: 'ALUNO',
    },
  });
}
