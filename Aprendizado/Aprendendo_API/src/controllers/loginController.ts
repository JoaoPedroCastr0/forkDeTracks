import type { Request, Response } from "express";
import { loginUser } from "../services/userLogin";
import { loginSchema } from "../schemas/userSchema";

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    const { user, token } = await loginUser(data);

    return res.status(200).json({
      message: "Login realizado",
      user,
      token
    });
  } catch (error: any) {
    return res.status(400).json({
      error: "Credenciais inválidas"
    });
  }
}