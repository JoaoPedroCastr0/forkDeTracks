import { TaskRepository } from "../repository/taskRepository";

export class TaskService {
  private repository = new TaskRepository();

  createTask(title: string) {
    if (!title) {
      throw new Error("Title is required");
    }

    return this.repository.create(title);
  }
}