import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional()
});
export type CreateTaskDTO = z.infer<typeof createTaskSchema>;





export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/)
});
export type idParamDTO = z.infer<typeof idParamSchema>;





export const updateTaskSchema = createTaskSchema
  
  .refine(data => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser enviado"
  });
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;