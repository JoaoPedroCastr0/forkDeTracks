import { TaskRepository } from "../repository/taskRepository";
import type { CreateTaskDTO } from "../DTOs/createTaskDTO.schema";

export class TaskService {
  constructor(private repository: TaskRepository) {}

  create(data: CreateTaskDTO) {
    return this.repository.create(data);
  }
}