 import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  priority: z.enum(["baixa", "media", "alta"])
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;