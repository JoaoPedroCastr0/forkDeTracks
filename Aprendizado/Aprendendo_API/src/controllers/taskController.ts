import type { Request, Response } from "express";
import { TaskService } from "../services/taskService";

const service = new TaskService();

export class TaskController {
  create(req: Request, res: Response) {
    console.log("HEADERS:", req.headers);
    console.log("CONTENT-TYPE:", req.headers["content-type"]);
    console.log("BODY:", req.body);

    try {
      const { title } = req.body;

      const task = service.Verificacao(title);

      return res.status(201).json(task);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

