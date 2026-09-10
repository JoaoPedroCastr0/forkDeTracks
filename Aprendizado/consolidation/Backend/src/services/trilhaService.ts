import type { UsuarioSessao } from '../middlewares/auth.middleware';
import * as cursoRepo from '../repository/cursoRepository';
import * as trilhaRepo from '../repository/trilhaRepository';
import * as usuarioRepo from '../repository/usuarioRepository';
import type { AtualizarTrilhaDTO, CriarTrilhaDTO } from '../schemas/trilhaSchema';
import { AppError } from '../utils/AppError';

export async function listarTrilhasService(
  somenteAtivas: boolean = true,
  alunoId?: string,
  apenasPublicas: boolean = false,
) {
  return await trilhaRepo.listarTrilhas(somenteAtivas, alunoId, apenasPublicas);
}

export async function buscarTrilhaPorIdService(id: string, usuarioLogado?: UsuarioSessao) {
  const trilha = await trilhaRepo.buscarTrilhaPorId(id);
  if (!trilha) {
    throw AppError.notFound('Trilha não encontrada.');
  }

  // Defesa estrita contra IDOR/BOLA: Se a trilha for personalizada para um aluno específico
  if (trilha.alunoId) {
    const ehProfessor = usuarioLogado?.papel === 'PROFESSOR';
    const ehProprietario = usuarioLogado?.papel === 'ALUNO' && usuarioLogado.id === trilha.alunoId;

    if (!ehProfessor && !ehProprietario) {
      throw AppError.forbidden(
        'Acesso negado: esta trilha é personalizada e exclusiva para outro estudante.',
      );
    }
  }

  return trilha;
}

export async function criarTrilhaService(dados: CriarTrilhaDTO) {
  if (dados.alunoId) {
    const aluno = await usuarioRepo.buscarUsuarioPorId(dados.alunoId);
    if (!aluno || aluno.papel !== 'ALUNO') {
      throw AppError.badRequest(
        'O aluno selecionado como destinatário da trilha é inválido ou não foi encontrado.',
      );
    }
  }

  if (dados.cursosIds && dados.cursosIds.length > 0) {
    for (const cursoId of dados.cursosIds) {
      const curso = await cursoRepo.buscarCursoPorId(cursoId);
      if (!curso) {
        throw AppError.badRequest(`Curso com ID ${cursoId} não foi encontrado.`);
      }
    }
  }

  return await trilhaRepo.criarTrilha(dados);
}

export async function atualizarTrilhaService(id: string, dados: AtualizarTrilhaDTO) {
  const trilhaExistente = await trilhaRepo.buscarTrilhaPorId(id);
  if (!trilhaExistente) {
    throw AppError.notFound('Trilha não encontrada.');
  }

  if (dados.alunoId !== undefined && dados.alunoId !== null) {
    const aluno = await usuarioRepo.buscarUsuarioPorId(dados.alunoId);
    if (!aluno || aluno.papel !== 'ALUNO') {
      throw AppError.badRequest(
        'O aluno selecionado como destinatário da trilha é inválido ou não foi encontrado.',
      );
    }
  }

  if (dados.cursosIds && dados.cursosIds.length > 0) {
    for (const cursoId of dados.cursosIds) {
      const curso = await cursoRepo.buscarCursoPorId(cursoId);
      if (!curso) {
        throw AppError.badRequest(`Curso com ID ${cursoId} não foi encontrado.`);
      }
    }
  }

  return await trilhaRepo.atualizarTrilha(id, dados);
}

export async function desativarTrilhaService(id: string) {
  const trilhaExistente = await trilhaRepo.buscarTrilhaPorId(id);
  if (!trilhaExistente) {
    throw AppError.notFound('Trilha não encontrada.');
  }

  return await trilhaRepo.desativarTrilha(id);
}
