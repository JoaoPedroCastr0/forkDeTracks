import type { Request, Response } from "express";

export class HealthController {
  check(req: Request, res: Response) {
    return res.status(200).json({ status: "ok" });
  }
}