import type { Request, Response } from "express";
import { registerUser } from "../services/userService";

export async function register(req: Request, res: Response) {
  await registerUser(req.body);

  return res.status(201).json({
    message: "Usuário criado",
    user: {
      nome: req.body.nome,
      email: req.body.email
    }
  });
}