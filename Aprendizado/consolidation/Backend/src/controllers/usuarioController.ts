import type { NextFunction, Request, Response } from 'express';
import type { CriarUsuarioDTO } from '../schemas/usuarioSchema';
import * as usuarioService from '../services/usuarioService';

export async function cadastrarUsuario(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = req.body as CriarUsuarioDTO;
    const usuario = await usuarioService.criarUsuarioService(dados);

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      usuario,
    });
  } catch (error) {
    next(error);
  }
}
