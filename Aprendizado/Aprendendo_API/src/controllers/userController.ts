import type { Request, Response } from "express";
import { registerUser } from "../services/userService";
import type { CreateUserDTO } from "../schemas/authSchema";

export async function register(
  req: Request<{}, {}, CreateUserDTO>,
  res: Response
) {
  await registerUser(req.body);

  return res.status(201).json({
    message: "Usuário criado",
    user: {
      nome: req.body.nome,
      email: req.body.email
    }
  });
}