import type { Task } from "../models/task";
import type { CreateTaskDTO } from "../DTOs/createTaskDTO.schema";




export class TaskRepository {

  private tasks: Task[] = [];
  private currentId = 1;

create({ title, description, priority }: CreateTaskDTO): Task {
  const task: Task = {
    id: this.currentId++,
    title,
    description,
    priority
  };

  this.tasks.push(task);
  return task;
 }
}