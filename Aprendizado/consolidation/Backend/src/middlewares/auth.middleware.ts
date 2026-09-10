import { fromNodeHeaders } from 'better-auth/node';
import type { NextFunction, Request, Response } from 'express';
import { auth } from '../auth/auth';

// Interface do usuário da sessão injetado na requisição
export interface UsuarioSessao {
  id: string;
  email: string;
  nome: string;
  papel: 'ALUNO' | 'PROFESSOR';
}

// Extende a tipagem global do Express
declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioSessao;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const user = session.user as typeof session.user & { papel?: string };
    const papel: 'ALUNO' | 'PROFESSOR' = user.papel === 'PROFESSOR' ? 'PROFESSOR' : 'ALUNO';

    req.usuario = {
      id: user.id,
      email: user.email,
      nome: user.name,
      papel,
    };

    next();
  } catch (_error) {
    return res.status(401).json({ error: 'Falha na autenticação da sessão' });
  }
}

export async function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session?.user) {
      const user = session.user as typeof session.user & { papel?: string };
      const papel: 'ALUNO' | 'PROFESSOR' = user.papel === 'PROFESSOR' ? 'PROFESSOR' : 'ALUNO';

      req.usuario = {
        id: user.id,
        email: user.email,
        nome: user.name,
        papel,
      };
    }
  } catch (_error) {
    // Permite que requisições públicas prossigam sem req.usuario
  }
  next();
}
