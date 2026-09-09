import { z } from 'zod';

export const aulaIdParamSchema = z.object({
  aulaId: z.string().min(1, 'O ID da aula é obrigatório'),
});

export type AulaIdParamDTO = z.infer<typeof aulaIdParamSchema>;
