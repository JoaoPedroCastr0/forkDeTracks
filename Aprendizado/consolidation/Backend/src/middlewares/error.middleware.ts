import type { NextFunction, Request, Response } from 'express';

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error('[ERRO CAPTURADO PELO MIDDLEWARE]:', err);

  const message = err instanceof Error ? err.message : 'Erro interno do servidor';
  const statusCode = 500;

  return res.status(statusCode).json({
    error: message,
  });
}
