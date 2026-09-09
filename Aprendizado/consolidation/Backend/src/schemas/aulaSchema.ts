import { z } from 'zod';

export const criarModuloSchema = z.object({
  titulo: z.string().min(3, 'O título do módulo deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
  ordem: z.number().int().nonnegative().optional(),
});

export type CriarModuloDTO = z.infer<typeof criarModuloSchema>;

export const criarAulaSchema = z.object({
  titulo: z.string().min(3, 'O título da aula deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
  urlConteudo: z.string().min(5, 'A URL ou identificador do conteúdo é obrigatório'),
  duracaoMinutos: z.number().int().nonnegative().default(0),
  ordem: z.number().int().nonnegative().optional(),
  moduloId: z.string().min(1, 'O ID do módulo é obrigatório'),
});

export type CriarAulaDTO = z.infer<typeof criarAulaSchema>;
