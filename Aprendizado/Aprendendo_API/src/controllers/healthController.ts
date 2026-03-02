import type { Request, Response } from "express";
import { HealthService } from "../services/healthService";
import { HealthRepository } from "../repository/healthRepository";
import { healthSchema } from "../DTOs/health.schema";

const repository = new HealthRepository();
const service = new HealthService(repository);

export class HealthController {
  check(req: Request, res: Response) {
    try {
      // Validando query params com Zod
      const parsedQuery = healthSchema.parse(req.query);

      const healthStatus = service.getStatus(parsedQuery); // passa os params se quiser

      return res.status(200).json(healthStatus);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}