import type { Request, Response } from "express";
import { TaskService } from "../services/taskService";
import { createTaskSchema } from "../DTOs/createTaskDTO.schema";
import { TaskRepository } from "src/repository/taskRepository";

const repository = new TaskRepository();
const service = new TaskService(repository);

export class TaskController {
  create(req: Request, res: Response) {

    console.log("HEADERS:", req.headers);
    console.log("CONTENT-TYPE:", req.headers["content-type"]);
    console.log("BODY:", req.body);

    try {
      // 👇 VALIDAÇÃO ACONTECE AQUI
      const parsedData = createTaskSchema.parse(req.body);

      const task = service.create(parsedData);

      return res.status(201).json(task);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}