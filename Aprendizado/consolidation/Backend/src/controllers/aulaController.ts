import type { NextFunction, Request, Response } from 'express';
import type { CriarAulaDTO, CriarModuloDTO } from '../schemas/aulaSchema';
import type { IdParamDTO } from '../schemas/cursoSchema';
import * as aulaService from '../services/aulaService';
import { AppError } from '../utils/AppError';

export async function obterConteudoCurso(req: Request, res: Response, next: NextFunction) {
  try {
    const params = req.params as IdParamDTO;
    const cursoId = params.id;
    const usuarioId = req.usuario?.id;
    const usuarioPapel = req.usuario?.papel;

    if (!usuarioId || !usuarioPapel) {
      throw AppError.unauthorized();
    }

    const conteudo = await aulaService.obterConteudoCursoService(cursoId, usuarioId, usuarioPapel);

    return res.status(200).json(conteudo);
  } catch (error) {
    next(error);
  }
}

export async function criarModulo(req: Request, res: Response, next: NextFunction) {
  try {
    const params = req.params as IdParamDTO;
    const cursoId = params.id;
    const professorId = req.usuario?.id;

    if (!professorId) {
      throw AppError.unauthorized();
    }

    const dados = req.body as CriarModuloDTO;
    const modulo = await aulaService.criarModuloService(cursoId, dados, professorId);

    return res.status(201).json({
      mensagem: 'Módulo criado com sucesso.',
      modulo,
    });
  } catch (error) {
    next(error);
  }
}

export async function criarAula(req: Request, res: Response, next: NextFunction) {
  try {
    const params = req.params as IdParamDTO;
    const cursoId = params.id;
    const professorId = req.usuario?.id;

    if (!professorId) {
      throw AppError.unauthorized();
    }

    const dados = req.body as CriarAulaDTO;
    const aula = await aulaService.criarAulaService(cursoId, dados, professorId);

    return res.status(201).json({
      mensagem: 'Aula criada com sucesso.',
      aula,
    });
  } catch (error) {
    next(error);
  }
}
