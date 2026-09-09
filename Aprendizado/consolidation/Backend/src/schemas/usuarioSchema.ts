import { z } from 'zod';

export const criarUsuarioSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Formato de e-mail inválido').toLowerCase().trim(),
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
});

export type CriarUsuarioDTO = z.infer<typeof criarUsuarioSchema>;

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido').toLowerCase().trim(),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginDTO = z.infer<typeof loginSchema>;
