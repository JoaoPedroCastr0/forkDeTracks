import { Router } from "express";
import { register } from "../controllers/userController";
import { login } from "../controllers/loginController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createTask, listTasks, deleteTask, updateTask } from "../controllers/taskController";
import { validate } from "src/middlewares/validate.middleware";
import { createUserSchema, loginSchema } from "src/schemas/authSchema";
import { createTaskSchema, idParamSchema } from "src/schemas/taskSchema";

const routes = Router();

export default routes;

//  Públicas
routes.post("/register", validate({body: createUserSchema}), register);
routes.post("/login",validate({body: loginSchema}), login);

//  Protegidas
routes.post("/tasks", authMiddleware, validate({body: createTaskSchema}), createTask);
routes.get("/tasks", authMiddleware, listTasks);
routes.delete("/tasks/:id", authMiddleware, validate({params: idParamSchema}), deleteTask);
routes.put("/tasks/:id", authMiddleware, validate({params: idParamSchema, body: createTaskSchema}), updateTask);