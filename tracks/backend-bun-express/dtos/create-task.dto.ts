import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "title is required")
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;