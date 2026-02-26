import express from "express";
import { TaskController } from "../controllers/taskController";
import { HealthController } from "../controllers/HealthController";

export const router = express.Router();

const taskController = new TaskController();
const healthController = new HealthController();

router.get("/health", (req, res) => healthController.check(req, res));
router.post("/tasks", (req, res) => taskController.create(req, res));



