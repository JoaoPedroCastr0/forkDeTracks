import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
});
export type IdParamDTO = z.infer<typeof idParamSchema>;

export const criarCursoSchema = z.object({
  titulo: z.string().min(5, 'O título deve ter no mínimo 5 caracteres'),
  descricao: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres'),
  cargaHorariaEstimada: z
    .number()
    .int()
    .positive('A carga horária deve ser um número inteiro positivo'),
  nivel: z.enum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'], {
    errorMap: () => ({
      message: 'Nível deve ser INICIANTE, INTERMEDIARIO ou AVANCADO',
    }),
  }),
  status: z.enum(['RASCUNHO', 'PUBLICADO', 'ARQUIVADO']).default('PUBLICADO'),
  trilhaId: z.string().optional(),
});
export type CriarCursoDTO = z.infer<typeof criarCursoSchema>;

// Permite atualizações parciais sem exigir todos os campos obrigatoriamente
export const atualizarCursoSchema = criarCursoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser enviado para atualização',
  });
export type AtualizarCursoDTO = z.infer<typeof atualizarCursoSchema>;
