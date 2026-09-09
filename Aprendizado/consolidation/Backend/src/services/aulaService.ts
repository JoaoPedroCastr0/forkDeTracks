import * as aulaRepo from '../repository/aulaRepository';
import * as cursoRepo from '../repository/cursoRepository';
import * as matriculaRepo from '../repository/matriculaRepository';
import * as progressoRepo from '../repository/progressoRepository';
import type { CriarAulaDTO, CriarModuloDTO } from '../schemas/aulaSchema';
import { AppError } from '../utils/AppError';

export async function obterConteudoCursoService(
  cursoId: string,
  usuarioId: string,
  usuarioPapel: string,
) {
  if (!usuarioId) {
    throw AppError.unauthorized('Usuário não autenticado.');
  }

  const curso = await aulaRepo.buscarCursoComModulosEAulas(cursoId);
  if (!curso) {
    throw AppError.notFound('Curso não encontrado.');
  }

  // RN09: Regra de Acesso Restrito ao Conteúdo
  const isProfessorDono = usuarioPapel === 'PROFESSOR' && curso.professorId === usuarioId;

  if (!isProfessorDono) {
    // Aluno precisa de matrícula ativa ou concluída
    const matricula = await matriculaRepo.buscarMatricula(usuarioId, cursoId);
    if (!matricula || matricula.status === 'CANCELADA') {
      throw AppError.forbidden(
        'Você precisa estar matriculado neste curso para acessar suas aulas.',
      );
    }
  }

  // Busca o progresso do usuário no curso
  const progressos = await progressoRepo.listarProgressosDoCurso(usuarioId, cursoId);
  const aulasConcluidasSet = new Set(progressos.filter((p) => p.concluida).map((p) => p.aulaId));

  let totalAulas = 0;
  let aulasConcluidas = 0;

  const modulosFormatados = curso.modulos.map((modulo) => {
    const aulasFormatadas = modulo.aulas.map((aula) => {
      totalAulas += 1;
      const concluida = aulasConcluidasSet.has(aula.id);
      if (concluida) {
        aulasConcluidas += 1;
      }

      return {
        id: aula.id,
        titulo: aula.titulo,
        descricao: aula.descricao,
        urlConteudo: aula.urlConteudo,
        duracaoMinutos: aula.duracaoMinutos,
        ordem: aula.ordem,
        concluida,
      };
    });

    return {
      id: modulo.id,
      titulo: modulo.titulo,
      descricao: modulo.descricao,
      ordem: modulo.ordem,
      aulas: aulasFormatadas,
    };
  });

  const percentualProgresso = totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

  return {
    curso: {
      id: curso.id,
      titulo: curso.titulo,
      descricao: curso.descricao,
      nivel: curso.nivel,
      cargaHorariaEstimada: curso.cargaHorariaEstimada,
      status: curso.status,
    },
    modulos: modulosFormatados,
    progresso: {
      totalAulas,
      aulasConcluidas,
      percentualProgresso,
      cursoConcluido: totalAulas > 0 && aulasConcluidas >= totalAulas,
    },
  };
}

export async function criarModuloService(
  cursoId: string,
  dados: CriarModuloDTO,
  professorId: string,
) {
  const curso = await cursoRepo.buscarCursoPorId(cursoId);
  if (!curso) {
    throw AppError.notFound('Curso não encontrado.');
  }

  if (curso.professorId !== professorId) {
    throw AppError.forbidden('Você não tem permissão para gerenciar este curso.');
  }

  return await aulaRepo.criarModulo(cursoId, dados);
}

export async function criarAulaService(cursoId: string, dados: CriarAulaDTO, professorId: string) {
  const curso = await cursoRepo.buscarCursoPorId(cursoId);
  if (!curso) {
    throw AppError.notFound('Curso não encontrado.');
  }

  if (curso.professorId !== professorId) {
    throw AppError.forbidden('Você não tem permissão para gerenciar este curso.');
  }

  const modulo = await aulaRepo.buscarModuloPorId(dados.moduloId);
  if (!modulo || modulo.cursoId !== cursoId) {
    throw AppError.badRequest('O módulo informado não pertence a este curso.');
  }

  return await aulaRepo.criarAula(cursoId, dados);
}
