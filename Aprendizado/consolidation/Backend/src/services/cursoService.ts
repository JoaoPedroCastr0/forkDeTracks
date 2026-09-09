import type { Curso } from '../models/Curso';
import * as cursoRepo from '../repository/cursoRepository';
import type { AtualizarCursoDTO, CriarCursoDTO } from '../schemas/cursoSchema';
import { AppError } from '../utils/AppError';

export async function criarCursoService(dados: CriarCursoDTO, professorId: string): Promise<Curso> {
  if (!professorId) {
    throw AppError.badRequest('ID do professor é obrigatório');
  }

  return await cursoRepo.criarCurso(dados, professorId);
}

export async function listarCursosService(): Promise<Curso[]> {
  return await cursoRepo.listarCursos();
}

export async function buscarCursoPorIdService(id: string): Promise<Curso> {
  const curso = await cursoRepo.buscarCursoPorId(id);
  if (!curso) {
    throw AppError.notFound('Curso não encontrado.');
  }
  return curso;
}

export async function atualizarCursoService(
  id: string,
  dados: AtualizarCursoDTO,
  professorId: string,
): Promise<Curso> {
  const cursoExistente = await cursoRepo.buscarCursoPorId(id);
  if (!cursoExistente) {
    throw AppError.notFound('Curso não encontrado.');
  }

  if (cursoExistente.professorId !== professorId) {
    throw AppError.forbidden('Você não tem permissão para editar este curso.');
  }

  const cursoAtualizado = await cursoRepo.atualizarCurso(id, dados);
  if (!cursoAtualizado) {
    throw AppError.internal('Falha ao atualizar o curso.');
  }

  return cursoAtualizado;
}

export async function removerCursoService(id: string, professorId: string): Promise<Curso> {
  const cursoExistente = await cursoRepo.buscarCursoPorId(id);
  if (!cursoExistente) {
    throw AppError.notFound('Curso não encontrado.');
  }

  if (cursoExistente.professorId !== professorId) {
    throw AppError.forbidden('Você não tem permissão para remover este curso.');
  }

  return await cursoRepo.removerCurso(id);
}
