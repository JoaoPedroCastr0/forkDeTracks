import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createTask,
  listTasks,
  deleteTask,
  updateTask,
  listDeletedTasks,
  restoreTask,
  permanentDeleteTask,
  toggleTaskCompletion
} from "../controllers/taskController";
import { validate } from "@/middlewares/validate.middleware";
import { createTaskSchema, idParamSchema, updateTaskSchema, toggleTaskSchema} from "@/schemas/taskSchema";

const routes = Router();

export default routes;

//  Protegidas
routes.post("/tasks", authMiddleware, validate({body: createTaskSchema}), createTask);
routes.get("/tasks", authMiddleware, listTasks);
routes.get("/tasks/trash", authMiddleware, listDeletedTasks);
routes.patch("/tasks/:id/restore", authMiddleware, validate({params: idParamSchema}), restoreTask);
routes.patch("/tasks/:id/toggle", authMiddleware, validate({params: idParamSchema, body: toggleTaskSchema}), toggleTaskCompletion);
routes.delete("/tasks/:id", authMiddleware, validate({params: idParamSchema}), deleteTask);
routes.delete("/tasks/:id/permanent", authMiddleware, validate({params: idParamSchema}), permanentDeleteTask);
routes.put("/tasks/:id", authMiddleware, validate({params: idParamSchema, body: updateTaskSchema}), updateTask);