import { Router } from "express";
import { register } from "../controllers/userController";
import { login } from "../controllers/loginController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createTask, listTasks} from "../controllers/taskController";

const routes = Router();

export default routes;

//  Públicas
routes.post("/register", register);
routes.post("/login", login);

//  Protegidas
routes.post("/tasks", authMiddleware, createTask);
routes.get("/tasks", authMiddleware, listTasks);