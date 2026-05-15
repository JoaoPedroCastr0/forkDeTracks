import { Router } from 'express';
import {
  createTask,
  deleteTask,
  listTasks,
  toggleTaskCompletion,
  updateTask,
} from '../controllers/taskController';
import {
  listDeletedTasks,
  permanentDeleteTask,
  restoreTask,
} from '../controllers/trashController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createTaskSchema,
  idParamSchema,
  toggleTaskSchema,
  updateTaskSchema,
} from '../schemas/taskSchema';

const routes = Router();

export default routes;

// Task Routes
routes.post(
  '/tasks',
  authMiddleware,
  validate({ body: createTaskSchema }),
  createTask,
);
routes.get('/tasks', authMiddleware, listTasks);
routes.put(
  '/tasks/:id',
  authMiddleware,
  validate({ params: idParamSchema, body: updateTaskSchema }),
  updateTask,
);
routes.patch(
  '/tasks/:id/toggle',
  authMiddleware,
  validate({ params: idParamSchema, body: toggleTaskSchema }),
  toggleTaskCompletion,
);
routes.delete(
  '/tasks/:id',
  authMiddleware,
  validate({ params: idParamSchema }),
  deleteTask,
);

// Trash Routes
routes.get('/tasks/trash', authMiddleware, listDeletedTasks);
routes.patch(
  '/tasks/:id/restore',
  authMiddleware,
  validate({ params: idParamSchema }),
  restoreTask,
);
routes.delete(
  '/tasks/:id/permanent',
  authMiddleware,
  validate({ params: idParamSchema }),
  permanentDeleteTask,
);
