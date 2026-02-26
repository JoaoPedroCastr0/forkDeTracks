import type { Task } from "../models/task";

let tasks: Task[] = [];
let currentId = 1;

export class TaskRepository {
  create(title: string): Task {
    const task: Task = {
      id: currentId++,
      title,
    };

    tasks.push(task);
    return task;
  }
}