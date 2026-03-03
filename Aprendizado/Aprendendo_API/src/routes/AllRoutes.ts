import express from "express";
import { HealthController } from "../controllers/healthController";
import { TaskController } from "../controllers/taskController";


export const router = express.Router();

const healthController = new HealthController();
router.get("/health", (req, res) => healthController.check(req, res));


const taskController = new TaskController();
router.post("/tasks", (req, res) => taskController.create(req, res));





