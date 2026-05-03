import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { auth } from "../auth/auth";
import { fromNodeHeaders } from "better-auth/node";

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session) {
      throw new AppError("Não autorizado", 401);
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Falha na autenticação", 401));
    }
  }
}