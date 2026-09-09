import type { NextFunction, Request, Response } from 'express';

// Interface do usuário da sessão injetado na requisição
export interface UsuarioSessao {
  id: string;
  email: string;
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

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Verificação de sessão (futuramente acoplado a auth.api.getSession)
    // Para o início das rotas, aceita header ou mock enquanto o Better Auth é configurado
    const usuarioId = req.headers['x-user-id'] as string;
    const usuarioPapel = (req.headers['x-user-role'] as 'ALUNO' | 'PROFESSOR') || 'ALUNO';

    if (!usuarioId) {
      // Se não houver identificação temporária ou sessão, bloqueia
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    req.usuario = {
      id: usuarioId,
      email: (req.headers['x-user-email'] as string) || 'usuario@exemplo.com',
      papel: usuarioPapel,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Falha na autenticação' });
  }
}
