import type { NextFunction, Request, Response } from 'express';
import { AppError, ServerError } from '../utils/AppError';

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  console.error(err);

  const message =
    err instanceof Error ? err.message : 'Erro interno do servidor';
  const statusCode = err instanceof ServerError ? err.statusCode : 500;

  return res.status(statusCode).json({
    error: message,
  });
}
