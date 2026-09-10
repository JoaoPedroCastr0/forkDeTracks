import type { NextFunction, Request, Response } from 'express';
import type {
  CriarMatriculaDTO,
  CursoIdParamDTO,
  MatriculaIdParamDTO,
} from '../schemas/matriculaSchema';
import * as matriculaService from '../services/matriculaService';
import { AppError } from '../utils/AppError';

export async function matricular(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      throw AppError.unauthorized();
    }

    const dados = req.body as CriarMatriculaDTO;
    const matricula = await matriculaService.matricularAlunoService(dados, usuarioId);

    return res.status(201).json({
      mensagem: 'Solicitação de matrícula enviada. Aguardando confirmação do Professor Alex.',
      matricula,
    });
  } catch (error) {
    next(error);
  }
}

export async function listarMatriculasPendentes(req: Request, res: Response, next: NextFunction) {
  try {
    const professorId = req.usuario?.id;
    if (!professorId) {
      throw AppError.unauthorized();
    }

    const pendentes = await matriculaService.listarMatriculasPendentesService(professorId);
    return res.status(200).json(pendentes);
  } catch (error) {
    next(error);
  }
}

export async function aprovarMatricula(req: Request, res: Response, next: NextFunction) {
  try {
    const professorId = req.usuario?.id;
    if (!professorId) {
      throw AppError.unauthorized();
    }

    const params = req.params as MatriculaIdParamDTO;
    const matricula = await matriculaService.aprovarMatriculaService(params.id, professorId);

    return res.status(200).json({
      mensagem: 'Matrícula confirmada com sucesso.',
      matricula,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejeitarMatricula(req: Request, res: Response, next: NextFunction) {
  try {
    const professorId = req.usuario?.id;
    if (!professorId) {
      throw AppError.unauthorized();
    }

    const params = req.params as MatriculaIdParamDTO;
    const matricula = await matriculaService.rejeitarMatriculaService(params.id, professorId);

    return res.status(200).json({
      mensagem: 'Matrícula recusada pelo Professor.',
      matricula,
    });
  } catch (error) {
    next(error);
  }
}

export async function listarMinhasMatriculas(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      throw AppError.unauthorized();
    }

    const matriculas = await matriculaService.listarMinhasMatriculasService(usuarioId);
    return res.status(200).json(matriculas);
  } catch (error) {
    next(error);
  }
}

export async function cancelarMatricula(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      throw AppError.unauthorized();
    }

    const params = req.params as CursoIdParamDTO;
    const matricula = await matriculaService.cancelarMatriculaService(params.cursoId, usuarioId);

    return res.status(200).json({
      mensagem: 'Matrícula cancelada com sucesso.',
      matricula,
    });
  } catch (error) {
    next(error);
  }
}
