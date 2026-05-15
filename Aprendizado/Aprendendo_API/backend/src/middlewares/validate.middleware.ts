import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

type ValidateSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export function validate(schemas: ValidateSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }
      req.body = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }
      // Usamos type assertion para unknown primeiro, que é o padrão seguro para conversão de tipos
      req.params = result.data as typeof req.params;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }
      req.query = result.data as typeof req.query;
    }

    next();
  };
}
