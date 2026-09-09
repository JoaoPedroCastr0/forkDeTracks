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

    req.usuario = {
      id: session.user.id,
      email: session.user.email,
      nome: session.user.name,
      papel: ((session.user as any).papel as 'ALUNO' | 'PROFESSOR') || 'ALUNO',
    };

    next();
  } catch (_error) {
    return res.status(401).json({ error: 'Falha na autenticação da sessão' });
  }
}
