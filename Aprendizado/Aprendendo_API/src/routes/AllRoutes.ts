import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createTask, listTasks, deleteTask, updateTask } from "../controllers/taskController";
import { validate } from "@/middlewares/validate.middleware";
import { createTaskSchema, idParamSchema, updateTaskSchema} from "@/schemas/taskSchema";

const routes = Router();

export default routes;

//  Protegidas
routes.post("/tasks", authMiddleware, validate({body: createTaskSchema}), createTask);
routes.get("/tasks", authMiddleware, listTasks);
routes.delete("/tasks/:id", authMiddleware, validate({params: idParamSchema}), deleteTask);
routes.put("/tasks/:id", authMiddleware, validate({params: idParamSchema, body: updateTaskSchema}), updateTask);