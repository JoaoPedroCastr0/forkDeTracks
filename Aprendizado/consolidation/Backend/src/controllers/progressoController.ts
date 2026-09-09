import type { NextFunction, Request, Response } from 'express';
import type { CursoIdParamDTO } from '../schemas/matriculaSchema';
import type { AulaIdParamDTO } from '../schemas/progressoSchema';
import * as progressoService from '../services/progressoService';
import { AppError } from '../utils/AppError';

export async function concluirAula(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      throw AppError.unauthorized();
    }

    const params = req.params as AulaIdParamDTO;
    const resultado = await progressoService.concluirAulaService(usuarioId, params.aulaId);

    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}

export async function desmarcarAula(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      throw AppError.unauthorized();
    }

    const params = req.params as AulaIdParamDTO;
    const resultado = await progressoService.desmarcarAulaService(usuarioId, params.aulaId);

    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}

export async function obterProgresso(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      throw AppError.unauthorized();
    }

    const params = req.params as CursoIdParamDTO;
    const resultado = await progressoService.obterProgressoCursoService(usuarioId, params.cursoId);

    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}
