import { prisma } from '../database/prisma';

export async function buscarMatricula(usuarioId: string, cursoId: string) {
  return await prisma.matricula.findUnique({
    where: {
      usuarioId_cursoId: {
        usuarioId,
        cursoId,
      },
    },
    include: {
      curso: true,
    },
  });
}

export async function buscarMatriculaPorId(id: string) {
  return await prisma.matricula.findUnique({
    where: { id },
    include: {
      usuario: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      curso: {
        select: {
          id: true,
          titulo: true,
          nivel: true,
          professorId: true,
        },
      },
    },
  });
}

export async function criarMatricula(
  usuarioId: string,
  cursoId: string,
  status: string = 'PENDENTE',
) {
  return await prisma.matricula.create({
    data: {
      usuarioId,
      cursoId,
      status,
    },
    include: {
      curso: true,
    },
  });
}

export async function listarMatriculasPendentes() {
  return await prisma.matricula.findMany({
    where: {
      status: 'PENDENTE',
    },
    include: {
      usuario: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      curso: {
        select: {
          id: true,
          titulo: true,
          nivel: true,
          professorId: true,
        },
      },
    },
    orderBy: {
      dataMatricula: 'desc',
    },
  });
}

export async function listarMatriculasDoUsuario(usuarioId: string) {
  return await prisma.matricula.findMany({
    where: {
      usuarioId,
    },
    include: {
      curso: {
        include: {
          aulas: {
            select: {
              id: true,
            },
          },
        },
      },
      progressos: {
        where: {
          concluida: true,
        },
        select: {
          aulaId: true,
        },
      },
    },
    orderBy: {
      dataMatricula: 'desc',
    },
  });
}

export async function atualizarStatusMatricula(
  matriculaId: string,
  status: string,
  dataConclusao?: Date | null,
) {
  return await prisma.matricula.update({
    where: { id: matriculaId },
    data: {
      status,
      ...(dataConclusao !== undefined && { dataConclusao }),
    },
  });
}
