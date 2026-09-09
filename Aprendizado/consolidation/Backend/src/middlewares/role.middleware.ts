import type { NextFunction, Request, Response } from 'express';
import type { UsuarioSessao } from './auth.middleware';

export type PapelUsuario = UsuarioSessao['papel'];

/**
 * Middleware RBAC (Role-Based Access Control)
 * Restringe o acesso ao endpoint apenas para usuários que possuam um dos papéis permitidos.
 * Requer que o `authMiddleware` tenha sido executado previamente para popular `req.usuario`.
 */
export function requireRole(...papeisPermitidos: PapelUsuario[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!papeisPermitidos.includes(req.usuario.papel)) {
      return res.status(403).json({
        error: 'Acesso negado: seu perfil não possui permissão para executar esta ação',
      });
    }

    next();
  };
}
