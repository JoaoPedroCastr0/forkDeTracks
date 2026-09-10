import { z } from 'zod';

export const criarMatriculaSchema = z.object({
  cursoId: z.string().min(1, 'O ID do curso é obrigatório'),
});

export type CriarMatriculaDTO = z.infer<typeof criarMatriculaSchema>;

export const cursoIdParamSchema = z.object({
  cursoId: z.string().min(1, 'O ID do curso é obrigatório'),
});

export type CursoIdParamDTO = z.infer<typeof cursoIdParamSchema>;

export const matriculaIdParamSchema = z.object({
  id: z.string().min(1, 'O ID da matrícula é obrigatório'),
});

export type MatriculaIdParamDTO = z.infer<typeof matriculaIdParamSchema>;
