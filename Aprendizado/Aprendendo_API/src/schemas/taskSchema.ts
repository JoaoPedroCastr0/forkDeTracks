import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional()
});
export type CreateTaskDTO = z.infer<typeof createTaskSchema>;



export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID deve ser numérico"),
});
export type idParamDTO = z.infer<typeof idParamSchema>;