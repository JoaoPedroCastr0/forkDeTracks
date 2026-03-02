import { TaskRepository } from "../repository/taskRepository";

export class TaskService {
  private repository = new TaskRepository();

  Verificacao(title: string) {
    if (typeof title !== "string" || title.trim() === "") {
  throw new Error("Não aceita vazio, somente strings");
}

    return this.repository.create(title);
  }
}