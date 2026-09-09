import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

interface ValidateSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export function validate(schemas: ValidateSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        return res.status(422).json({
          error: 'Dados inválidos no corpo da requisição',
          detalhes: result.error.format(),
        });
      }
      req.body = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        return res.status(400).json({
          error: 'Parâmetros de rota inválidos',
          detalhes: result.error.format(),
        });
      }
      req.params = result.data as typeof req.params;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        return res.status(400).json({
          error: 'Parâmetros de consulta (query) inválidos',
          detalhes: result.error.format(),
        });
      }
      req.query = result.data as typeof req.query;
    }

    next();
  };
}
