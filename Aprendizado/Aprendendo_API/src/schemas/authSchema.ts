import { z } from "zod";

// Schema de criação de usuário
export const createUserSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});
export type CreateUserDTO = z.infer<typeof createUserSchema>;




// Schema de login
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha obrigatória"),
});
export type LoginDTO = z.infer<typeof loginSchema>;