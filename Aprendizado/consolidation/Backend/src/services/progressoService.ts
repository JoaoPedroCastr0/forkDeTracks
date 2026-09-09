import * as matriculaRepo from '../repository/matriculaRepository';
import * as progressoRepo from '../repository/progressoRepository';
import { AppError } from '../utils/AppError';

export async function concluirAulaService(usuarioId: string, aulaId: string) {
  if (!usuarioId) {
    throw AppError.unauthorized('Usuário não autenticado.');
  }

  // 1. Busca a aula e o curso pai
  const aula = await progressoRepo.buscarAulaComCurso(aulaId);
  if (!aula) {
    throw AppError.notFound('Aula não encontrada.');
  }

  // 2. Valida se o aluno está matriculado no curso pai (RN06)
  const matricula = await matriculaRepo.buscarMatricula(usuarioId, aula.cursoId);
  if (!matricula || matricula.status === 'CANCELADA') {
    throw AppError.forbidden(
      'Você precisa estar matriculado no curso para registrar progresso nas aulas.',
    );
  }

  // 3. Marca a aula como concluída de forma idempotente (RN05)
  const progresso = await progressoRepo.marcarAulaConcluida(
    usuarioId,
    aula.cursoId,
    aulaId,
    matricula.id,
  );

  // 4. Recalcula o progresso do curso (RN07)
  const totalAulas = await progressoRepo.contarAulasDoCurso(aula.cursoId);
  const aulasConcluidas = await progressoRepo.contarAulasConcluidasDoCurso(usuarioId, aula.cursoId);

  const concluido = totalAulas > 0 && aulasConcluidas >= totalAulas;

  if (concluido && matricula.status !== 'CONCLUIDA') {
    await matriculaRepo.atualizarStatusMatricula(matricula.id, 'CONCLUIDA', new Date());
  }

  const percentual = totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

  return {
    mensagem: 'Aula marcada como concluída com sucesso.',
    progresso,
    estatisticas: {
      totalAulas,
      aulasConcluidas,
      percentual,
      cursoConcluido: concluido,
    },
  };
}

export async function desmarcarAulaService(usuarioId: string, aulaId: string) {
  if (!usuarioId) {
    throw AppError.unauthorized('Usuário não autenticado.');
  }

  const aula = await progressoRepo.buscarAulaComCurso(aulaId);
  if (!aula) {
    throw AppError.notFound('Aula não encontrada.');
  }

  const matricula = await matriculaRepo.buscarMatricula(usuarioId, aula.cursoId);
  if (!matricula) {
    throw AppError.forbidden('Você não possui matrícula ativa neste curso.');
  }

  const progressoAtualizado = await progressoRepo.desmarcarAulaConcluida(usuarioId, aulaId);

  // Se o curso estava marcado como concluído, reverte para ATIVA
  if (matricula.status === 'CONCLUIDA') {
    await matriculaRepo.atualizarStatusMatricula(matricula.id, 'ATIVA', null);
  }

  const totalAulas = await progressoRepo.contarAulasDoCurso(aula.cursoId);
  const aulasConcluidas = await progressoRepo.contarAulasConcluidasDoCurso(usuarioId, aula.cursoId);
  const percentual = totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

  return {
    mensagem: 'Conclusão da aula desmarcada com sucesso.',
    progresso: progressoAtualizado,
    estatisticas: {
      totalAulas,
      aulasConcluidas,
      percentual,
      cursoConcluido: false,
    },
  };
}

export async function obterProgressoCursoService(usuarioId: string, cursoId: string) {
  if (!usuarioId) {
    throw AppError.unauthorized('Usuário não autenticado.');
  }

  const matricula = await matriculaRepo.buscarMatricula(usuarioId, cursoId);
  if (!matricula) {
    throw AppError.notFound('Matrícula não encontrada para este curso.');
  }

  const totalAulas = await progressoRepo.contarAulasDoCurso(cursoId);
  const aulasConcluidas = await progressoRepo.contarAulasConcluidasDoCurso(usuarioId, cursoId);
  const progressos = await progressoRepo.listarProgressosDoCurso(usuarioId, cursoId);

  const percentual = totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

  return {
    cursoId,
    statusMatricula: matricula.status,
    dataMatricula: matricula.dataMatricula,
    dataConclusao: matricula.dataConclusao,
    totalAulas,
    aulasConcluidas,
    percentual,
    aulasFinalizadasIds: progressos.filter((p) => p.concluida).map((p) => p.aulaId),
  };
}
