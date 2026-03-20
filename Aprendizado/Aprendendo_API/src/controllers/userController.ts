import type { Request, Response } from "express";
import { registerUser } from "../services/userService";
import { createUserSchema } from "../schemas/authSchema";

export async function register(req: Request, res: Response) {
  const data = createUserSchema.parse(req.body);

  await registerUser(data);

  return res.status(201).json({
    message: "Usuário criado",
    user: {
      nome: data.nome,
      email: data.email
    }
  });
}