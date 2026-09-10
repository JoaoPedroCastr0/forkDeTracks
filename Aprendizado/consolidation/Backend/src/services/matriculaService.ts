import * as cursoRepo from '../repository/cursoRepository';
import * as matriculaRepo from '../repository/matriculaRepository';
import type { CriarMatriculaDTO } from '../schemas/matriculaSchema';
import { AppError } from '../utils/AppError';

export async function matricularAlunoService(dados: CriarMatriculaDTO, usuarioId: string) {
  if (!usuarioId) {
    throw AppError.unauthorized('Usuário não autenticado.');
  }

  // 1. Busca o curso para validar elegibilidade (RN04)
  const curso = await cursoRepo.buscarCursoPorId(dados.cursoId);
  if (!curso) {
    throw AppError.notFound('Curso não encontrado.');
  }

  // RN04: Apenas cursos publicados aceitam matrícula
  if (curso.status !== 'PUBLICADO') {
    throw AppError.badRequest('Apenas cursos publicados aceitam matrículas de alunos.');
  }

  // 2. Valida se o aluno já possui matrícula neste curso (RN03)
  const matriculaExistente = await matriculaRepo.buscarMatricula(usuarioId, dados.cursoId);
  if (matriculaExistente) {
    if (matriculaExistente.status === 'ATIVA') {
      throw AppError.conflict('Você já possui uma matrícula ativa neste curso.');
    }
    if (matriculaExistente.status === 'PENDENTE') {
      throw AppError.conflict(
        'Sua solicitação de matrícula já está aguardando confirmação do Professor Alex.',
      );
    }

    // Se estava cancelada ou rejeitada, reabre a solicitação como PENDENTE
    return await matriculaRepo.atualizarStatusMatricula(matriculaExistente.id, 'PENDENTE');
  }

  // 3. Cria a nova matrícula com status PENDENTE para confirmação do Professor
  return await matriculaRepo.criarMatricula(usuarioId, dados.cursoId, 'PENDENTE');
}

export async function listarMatriculasPendentesService(professorId: string) {
  if (!professorId) {
    throw AppError.unauthorized('Usuário não autenticado.');
  }

  return await matriculaRepo.listarMatriculasPendentes();
}

export async function aprovarMatriculaService(matriculaId: string, professorId: string) {
  if (!professorId) {
    throw AppError.unauthorized('Usuário não autenticado.');
  }

  const matricula = await matriculaRepo.buscarMatriculaPorId(matriculaId);
  if (!matricula) {
    throw AppError.notFound('Matrícula não encontrada.');
  }

  if (matricula.status === 'ATIVA') {
    throw AppError.conflict('Esta matrícula já está ativa.');
  }

  return await matriculaRepo.atualizarStatusMatricula(matricula.id, 'ATIVA');
}

export async function rejeitarMatriculaService(matriculaId: string, professorId: string) {
  if (!professorId) {
    throw AppError.unauthorized('Usuário não autenticado.');
  }

  const matricula = await matriculaRepo.buscarMatriculaPorId(matriculaId);
  if (!matricula) {
    throw AppError.notFound('Matrícula não encontrada.');
  }

  if (matricula.status === 'REJEITADA') {
    throw AppError.conflict('Esta matrícula já foi rejeitada.');
  }

  return await matriculaRepo.atualizarStatusMatricula(matricula.id, 'REJEITADA');
}

export async function listarMinhasMatriculasService(usuarioId: string) {
  if (!usuarioId) {
    throw AppError.unauthorized('Usuário não autenticado.');
  }

  const matriculas = await matriculaRepo.listarMatriculasDoUsuario(usuarioId);

  // Calcula percentual de progresso de cada matrícula (RN07)
  return matriculas.map((mat) => {
    const totalAulas = mat.curso.aulas.length;
    const aulasConcluidas = mat.progressos.length;
    const percentualProgresso =
      totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

    return {
      id: mat.id,
      status: mat.status,
      dataMatricula: mat.dataMatricula,
      dataConclusao: mat.dataConclusao,
      curso: {
        id: mat.curso.id,
        titulo: mat.curso.titulo,
        descricao: mat.curso.descricao,
        cargaHorariaEstimada: mat.curso.cargaHorariaEstimada,
        nivel: mat.curso.nivel,
        totalAulas,
      },
      aulasConcluidas,
      percentualProgresso,
    };
  });
}

export async function cancelarMatriculaService(cursoId: string, usuarioId: string) {
  if (!usuarioId) {
    throw AppError.unauthorized('Usuário não autenticado.');
  }

  const matricula = await matriculaRepo.buscarMatricula(usuarioId, cursoId);
  if (!matricula || matricula.status === 'CANCELADA') {
    throw AppError.notFound('Matrícula ativa não encontrada para este curso.');
  }

  return await matriculaRepo.atualizarStatusMatricula(matricula.id, 'CANCELADA');
}
