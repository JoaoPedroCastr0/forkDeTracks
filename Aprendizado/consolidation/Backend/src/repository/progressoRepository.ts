import { prisma } from '../database/prisma';

export async function buscarAulaComCurso(aulaId: string) {
  return await prisma.aula.findUnique({
    where: { id: aulaId },
    include: {
      curso: true,
      modulo: true,
    },
  });
}

export async function buscarProgresso(usuarioId: string, aulaId: string) {
  return await prisma.progresso.findUnique({
    where: {
      usuarioId_aulaId: {
        usuarioId,
        aulaId,
      },
    },
  });
}

export async function marcarAulaConcluida(
  usuarioId: string,
  cursoId: string,
  aulaId: string,
  matriculaId: string,
) {
  return await prisma.progresso.upsert({
    where: {
      usuarioId_aulaId: {
        usuarioId,
        aulaId,
      },
    },
    update: {
      concluida: true,
      dataConclusao: new Date(),
    },
    create: {
      usuarioId,
      cursoId,
      aulaId,
      matriculaId,
      concluida: true,
      dataConclusao: new Date(),
    },
  });
}

export async function desmarcarAulaConcluida(usuarioId: string, aulaId: string) {
  const progresso = await prisma.progresso.findUnique({
    where: {
      usuarioId_aulaId: {
        usuarioId,
        aulaId,
      },
    },
  });

  if (!progresso) return null;

  return await prisma.progresso.update({
    where: {
      usuarioId_aulaId: {
        usuarioId,
        aulaId,
      },
    },
    data: {
      concluida: false,
      dataConclusao: null,
    },
  });
}

export async function contarAulasDoCurso(cursoId: string) {
  return await prisma.aula.count({
    where: { cursoId },
  });
}

export async function contarAulasConcluidasDoCurso(usuarioId: string, cursoId: string) {
  return await prisma.progresso.count({
    where: {
      usuarioId,
      cursoId,
      concluida: true,
    },
  });
}

export async function listarProgressosDoCurso(usuarioId: string, cursoId: string) {
  return await prisma.progresso.findMany({
    where: {
      usuarioId,
      cursoId,
    },
  });
}
