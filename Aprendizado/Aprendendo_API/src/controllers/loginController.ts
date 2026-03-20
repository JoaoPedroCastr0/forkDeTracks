import type { Request, Response } from "express";
import { loginUser } from "../services/userLogin";
import { loginSchema } from "../schemas/authSchema";

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const { user, token } = await loginUser(data);

  return res.status(200).json({
    message: "Login realizado",
    user,
    token
  });
}