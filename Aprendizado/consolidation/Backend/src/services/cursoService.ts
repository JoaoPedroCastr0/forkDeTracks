import type { Curso } from '../models/Curso';
import * as cursoRepo from '../repository/cursoRepository';
import type { AtualizarCursoDTO, CriarCursoDTO } from '../schemas/cursoSchema';

export async function criarCursoService(dados: CriarCursoDTO, professorId: string): Promise<Curso> {
  if (!professorId) {
    throw new Error('ID do professor é obrigatório');
  }

  return await cursoRepo.criarCurso(dados, professorId);
}

export async function listarCursosService(): Promise<Curso[]> {
  return await cursoRepo.listarCursos();
}

export async function buscarCursoPorIdService(id: string): Promise<Curso> {
  const curso = await cursoRepo.buscarCursoPorId(id);
  if (!curso) {
    throw new Error(`Curso com ID [${id}] não encontrado`);
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
    throw new Error(`Curso com ID [${id}] não encontrado`);
  }

  if (cursoExistente.professorId !== professorId) {
    throw new Error('Você não tem permissão para editar este curso');
  }

  const cursoAtualizado = await cursoRepo.atualizarCurso(id, dados);
  if (!cursoAtualizado) {
    throw new Error('Falha ao atualizar o curso');
  }

  return cursoAtualizado;
}
