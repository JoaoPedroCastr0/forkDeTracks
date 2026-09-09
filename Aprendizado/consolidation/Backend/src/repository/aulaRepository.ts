import { prisma } from '../database/prisma';
import type { CriarAulaDTO, CriarModuloDTO } from '../schemas/aulaSchema';

export async function buscarCursoComModulosEAulas(cursoId: string) {
  return await prisma.curso.findFirst({
    where: {
      id: cursoId,
      deletedAt: null,
    },
    include: {
      modulos: {
        orderBy: {
          ordem: 'asc',
        },
        include: {
          aulas: {
            orderBy: {
              ordem: 'asc',
            },
          },
        },
      },
    },
  });
}

export async function buscarModuloPorId(moduloId: string) {
  return await prisma.modulo.findUnique({
    where: { id: moduloId },
  });
}

export async function criarModulo(cursoId: string, dados: CriarModuloDTO) {
  return await prisma.modulo.create({
    data: {
      titulo: dados.titulo,
      descricao: dados.descricao ?? null,
      ordem: dados.ordem ?? 0,
      cursoId,
    },
  });
}

export async function criarAula(cursoId: string, dados: CriarAulaDTO) {
  return await prisma.aula.create({
    data: {
      titulo: dados.titulo,
      descricao: dados.descricao ?? null,
      urlConteudo: dados.urlConteudo,
      duracaoMinutos: dados.duracaoMinutos ?? 0,
      ordem: dados.ordem ?? 0,
      moduloId: dados.moduloId,
      cursoId,
    },
  });
}

export async function buscarAulaPorId(aulaId: string) {
  return await prisma.aula.findUnique({
    where: { id: aulaId },
    include: {
      curso: true,
      modulo: true,
    },
  });
}
