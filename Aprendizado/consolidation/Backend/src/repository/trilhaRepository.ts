import { prisma } from '../database/prisma';
import type { AtualizarTrilhaDTO, CriarTrilhaDTO } from '../schemas/trilhaSchema';

export async function criarTrilha(dados: CriarTrilhaDTO) {
  const trilha = await prisma.trilha.create({
    data: {
      titulo: dados.titulo,
      descricao: dados.descricao ?? null,
      ordem: dados.ordem ?? 0,
      alunoId: dados.alunoId ?? null,
      ativa: true,
      ...(dados.cursosIds && dados.cursosIds.length > 0
        ? {
            cursos: {
              connect: dados.cursosIds.map((cId) => ({ id: cId })),
            },
          }
        : {}),
    },
    include: {
      aluno: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      cursos: {
        where: { deletedAt: null },
        include: {
          _count: {
            select: {
              modulos: true,
              aulas: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return {
    id: trilha.id,
    titulo: trilha.titulo,
    descricao: trilha.descricao,
    ordem: trilha.ordem,
    ativa: trilha.ativa,
    alunoId: trilha.alunoId,
    aluno: trilha.aluno,
    createdAt: trilha.createdAt,
    updatedAt: trilha.updatedAt,
    cursos: trilha.cursos.map((c) => ({
      id: c.id,
      titulo: c.titulo,
      descricao: c.descricao,
      cargaHorariaEstimada: c.cargaHorariaEstimada,
      nivel: c.nivel,
      status: c.status,
      modulosCount: c._count.modulos,
      aulasCount: c._count.aulas,
    })),
  };
}

export async function listarTrilhas(
  somenteAtivas: boolean = true,
  alunoId?: string,
  apenasPublicas: boolean = false,
) {
  const whereClause: {
    ativa?: boolean;
    alunoId?: null;
    OR?: Array<{ alunoId: null } | { alunoId: string }>;
  } = {};

  if (somenteAtivas) {
    whereClause.ativa = true;
  }

  if (apenasPublicas) {
    whereClause.alunoId = null;
  } else if (alunoId) {
    whereClause.OR = [{ alunoId: null }, { alunoId }];
  }

  const trilhas = await prisma.trilha.findMany({
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    include: {
      aluno: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      cursos: {
        where: { deletedAt: null },
        include: {
          _count: {
            select: {
              modulos: true,
              aulas: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: [{ ordem: 'asc' }, { createdAt: 'asc' }],
  });

  return trilhas.map((t) => ({
    id: t.id,
    titulo: t.titulo,
    descricao: t.descricao,
    ordem: t.ordem,
    ativa: t.ativa,
    alunoId: t.alunoId,
    aluno: t.aluno,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    totalCursos: t.cursos.length,
    cursos: t.cursos.map((c) => ({
      id: c.id,
      titulo: c.titulo,
      descricao: c.descricao,
      cargaHorariaEstimada: c.cargaHorariaEstimada,
      nivel: c.nivel,
      status: c.status,
      modulosCount: c._count.modulos,
      aulasCount: c._count.aulas,
    })),
  }));
}

export async function buscarTrilhaPorId(id: string) {
  const t = await prisma.trilha.findUnique({
    where: { id },
    include: {
      aluno: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      cursos: {
        where: { deletedAt: null },
        include: {
          _count: {
            select: {
              modulos: true,
              aulas: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!t) return null;

  return {
    id: t.id,
    titulo: t.titulo,
    descricao: t.descricao,
    ordem: t.ordem,
    ativa: t.ativa,
    alunoId: t.alunoId,
    aluno: t.aluno,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    totalCursos: t.cursos.length,
    cursos: t.cursos.map((c) => ({
      id: c.id,
      titulo: c.titulo,
      descricao: c.descricao,
      cargaHorariaEstimada: c.cargaHorariaEstimada,
      nivel: c.nivel,
      status: c.status,
      modulosCount: c._count.modulos,
      aulasCount: c._count.aulas,
    })),
  };
}

export async function atualizarTrilha(id: string, dados: AtualizarTrilhaDTO) {
  const trilha = await prisma.trilha.update({
    where: { id },
    data: {
      ...(dados.titulo !== undefined ? { titulo: dados.titulo } : {}),
      ...(dados.descricao !== undefined ? { descricao: dados.descricao } : {}),
      ...(dados.ordem !== undefined ? { ordem: dados.ordem } : {}),
      ...(dados.ativa !== undefined ? { ativa: dados.ativa } : {}),
      ...(dados.alunoId !== undefined ? { alunoId: dados.alunoId } : {}),
      ...(dados.cursosIds !== undefined
        ? {
            cursos: {
              set: dados.cursosIds.map((cId) => ({ id: cId })),
            },
          }
        : {}),
    },
    include: {
      aluno: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      cursos: {
        where: { deletedAt: null },
        include: {
          _count: {
            select: {
              modulos: true,
              aulas: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return {
    id: trilha.id,
    titulo: trilha.titulo,
    descricao: trilha.descricao,
    ordem: trilha.ordem,
    ativa: trilha.ativa,
    alunoId: trilha.alunoId,
    aluno: trilha.aluno,
    createdAt: trilha.createdAt,
    updatedAt: trilha.updatedAt,
    totalCursos: trilha.cursos.length,
    cursos: trilha.cursos.map((c) => ({
      id: c.id,
      titulo: c.titulo,
      descricao: c.descricao,
      cargaHorariaEstimada: c.cargaHorariaEstimada,
      nivel: c.nivel,
      status: c.status,
      modulosCount: c._count.modulos,
      aulasCount: c._count.aulas,
    })),
  };
}

export async function desativarTrilha(id: string) {
  return await prisma.trilha.update({
    where: { id },
    data: { ativa: false },
  });
}
