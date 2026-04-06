import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    error: "Erro interno do servidor",
  });
}