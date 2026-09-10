import type { NextFunction, Request, Response } from 'express';
import type { AtualizarTrilhaDTO, CriarTrilhaDTO } from '../schemas/trilhaSchema';
import * as trilhaService from '../services/trilhaService';

export async function criarTrilha(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = req.body as CriarTrilhaDTO;
    const trilha = await trilhaService.criarTrilhaService(dados);
    return res.status(201).json(trilha);
  } catch (error) {
    next(error);
  }
}

export async function listarTrilhas(req: Request, res: Response, next: NextFunction) {
  try {
    const todas = req.query.todas === 'true';
    let alunoId: string | undefined;
    let apenasPublicas = false;

    if (req.usuario?.papel === 'ALUNO') {
      alunoId = req.usuario.id;
    } else if (req.usuario?.papel === 'PROFESSOR') {
      alunoId = undefined;
    } else {
      apenasPublicas = true;
    }

    const trilhas = await trilhaService.listarTrilhasService(!todas, alunoId, apenasPublicas);
    return res.status(200).json(trilhas);
  } catch (error) {
    next(error);
  }
}

export async function obterTrilhaPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const trilha = await trilhaService.buscarTrilhaPorIdService(id, req.usuario);
    return res.status(200).json(trilha);
  } catch (error) {
    next(error);
  }
}

export async function atualizarTrilha(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const dados = req.body as AtualizarTrilhaDTO;
    const trilha = await trilhaService.atualizarTrilhaService(id, dados);
    return res.status(200).json(trilha);
  } catch (error) {
    next(error);
  }
}

export async function desativarTrilha(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await trilhaService.desativarTrilhaService(id);
    return res.status(200).json({ mensagem: 'Trilha desativada com sucesso.' });
  } catch (error) {
    next(error);
  }
}
