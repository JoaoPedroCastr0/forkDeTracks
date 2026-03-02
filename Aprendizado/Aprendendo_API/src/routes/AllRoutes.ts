import express from "express";
import { TaskController } from "../controllers/taskController";
import { HealthController } from "../controllers/healthController";

export const router = express.Router();

const healthController = new HealthController();
router.get("/health", (req, res) => healthController.check(req, res));


const taskController = new TaskController();
router.post("/tasks", (req, res) => taskController.create(req, res));



