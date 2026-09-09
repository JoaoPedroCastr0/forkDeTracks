import { prisma } from '../database/prisma';
import type { AtualizarCursoDTO, CriarCursoDTO } from '../schemas/cursoSchema';

export async function criarCurso(dados: CriarCursoDTO, professorId: string) {
  const c = await prisma.curso.create({
    data: {
      titulo: dados.titulo,
      descricao: dados.descricao,
      cargaHorariaEstimada: dados.cargaHorariaEstimada,
      nivel: dados.nivel,
      status: dados.status ?? 'PUBLICADO',
      professorId,
      trilhaId: dados.trilhaId ?? null,
    },
  });

  return {
    ...c,
    modulosCount: 0,
    aulasCount: 0,
  };
}

export async function listarCursos() {
  const cursos = await prisma.curso.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      _count: {
        select: {
          modulos: true,
          aulas: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return cursos.map((c) => ({
    id: c.id,
    titulo: c.titulo,
    descricao: c.descricao,
    cargaHorariaEstimada: c.cargaHorariaEstimada,
    nivel: c.nivel,
    status: c.status,
    professorId: c.professorId,
    trilhaId: c.trilhaId,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    deletedAt: c.deletedAt,
    modulosCount: c._count.modulos,
    aulasCount: c._count.aulas,
  }));
}

export async function buscarCursoPorId(id: string) {
  const c = await prisma.curso.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      _count: {
        select: {
          modulos: true,
          aulas: true,
        },
      },
    },
  });

  if (!c) return null;

  return {
    id: c.id,
    titulo: c.titulo,
    descricao: c.descricao,
    cargaHorariaEstimada: c.cargaHorariaEstimada,
    nivel: c.nivel,
    status: c.status,
    professorId: c.professorId,
    trilhaId: c.trilhaId,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    deletedAt: c.deletedAt,
    modulosCount: c._count.modulos,
    aulasCount: c._count.aulas,
  };
}

export async function atualizarCurso(id: string, dados: AtualizarCursoDTO) {
  return await prisma.curso.update({
    where: { id },
    data: {
      ...(dados.titulo !== undefined && { titulo: dados.titulo }),
      ...(dados.descricao !== undefined && { descricao: dados.descricao }),
      ...(dados.cargaHorariaEstimada !== undefined && {
        cargaHorariaEstimada: dados.cargaHorariaEstimada,
      }),
      ...(dados.nivel !== undefined && { nivel: dados.nivel }),
      ...(dados.status !== undefined && { status: dados.status }),
      ...(dados.trilhaId !== undefined && { trilhaId: dados.trilhaId }),
    },
  });
}

export async function removerCurso(id: string) {
  return await prisma.curso.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function restaurarCurso(id: string) {
  return await prisma.curso.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
}
