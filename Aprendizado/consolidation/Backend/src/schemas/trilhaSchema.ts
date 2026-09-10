import { z } from 'zod';

export const trilhaIdParamSchema = z.object({
  id: z.string({ required_error: 'O ID da trilha é obrigatório' }).min(1, 'ID inválido'),
});

export const criarTrilhaSchema = z.object({
  titulo: z
    .string({ required_error: 'O título da trilha é obrigatório' })
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .max(120, 'O título deve ter no máximo 120 caracteres'),
  descricao: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres').optional(),
  ordem: z.number().int().min(0).optional(),
  alunoId: z.string().nullable().optional(),
  cursosIds: z.array(z.string().min(1)).optional(),
});

export const atualizarTrilhaSchema = z.object({
  titulo: z
    .string()
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .max(120, 'O título deve ter no máximo 120 caracteres')
    .optional(),
  descricao: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres').optional(),
  ordem: z.number().int().min(0).optional(),
  ativa: z.boolean().optional(),
  alunoId: z.string().nullable().optional(),
  cursosIds: z.array(z.string().min(1)).optional(),
});

export type TrilhaIdParamDTO = z.infer<typeof trilhaIdParamSchema>;
export type CriarTrilhaDTO = z.infer<typeof criarTrilhaSchema>;
export type AtualizarTrilhaDTO = z.infer<typeof atualizarTrilhaSchema>;
