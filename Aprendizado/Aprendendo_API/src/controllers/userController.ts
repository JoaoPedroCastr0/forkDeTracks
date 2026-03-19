import type { Request, Response } from "express";
import { registerUser } from "../services/userService";
import { createUserSchema } from "../schemas/userSchema";

export async function register(req: Request, res: Response) {
  try {
    const data = createUserSchema.parse(req.body);

    await registerUser(data);

    return res.status(201).json({
      message: "Usuário criado",
      user: {
        nome: data.nome,
        email: data.email
      }
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}