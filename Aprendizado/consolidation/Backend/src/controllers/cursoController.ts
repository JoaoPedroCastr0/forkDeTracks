import type { NextFunction, Request, Response } from 'express';
import type { AtualizarCursoDTO, CriarCursoDTO } from '../schemas/cursoSchema';
import * as cursoService from '../services/cursoService';

export async function criarCurso(req: Request, res: Response, next: NextFunction) {
  try {
    const professorId = req.usuario?.id;
    if (!professorId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const dados = req.body as CriarCursoDTO;
    const curso = await cursoService.criarCursoService(dados, professorId);

    return res.status(201).json(curso);
  } catch (error) {
    next(error);
  }
}

export async function listarCursos(_req: Request, res: Response, next: NextFunction) {
  try {
    const cursos = await cursoService.listarCursosService();
    return res.status(200).json(cursos);
  } catch (error) {
    next(error);
  }
}

export async function obterCursoPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const curso = await cursoService.buscarCursoPorIdService(id);
    return res.status(200).json(curso);
  } catch (error) {
    next(error);
  }
}

export async function atualizarCurso(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const professorId = req.usuario?.id;
    if (!professorId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const dados = req.body as AtualizarCursoDTO;
    const curso = await cursoService.atualizarCursoService(id, dados, professorId);

    return res.status(200).json(curso);
  } catch (error) {
    next(error);
  }
}

export async function removerCurso(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const professorId = req.usuario?.id;
    if (!professorId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const curso = await cursoService.removerCursoService(id, professorId);
    return res.status(200).json({ mensagem: 'Curso removido com sucesso', curso });
  } catch (error) {
    next(error);
  }
}
