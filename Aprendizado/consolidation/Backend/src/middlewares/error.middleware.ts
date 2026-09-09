import type { NextFunction, Request, Response } from 'express';
import { tratarErro } from '../utils/tratarErro';

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const { statusCode, corpo } = tratarErro(err);
  return res.status(statusCode).json(corpo);
}
