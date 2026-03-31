import type { Request, Response } from "express";
import { loginUser } from "../services/userLogin";
import type { LoginDTO } from "../schemas/authSchema";

export async function login(
  req: Request<{}, {}, LoginDTO>,
  res: Response
) {
  const { user, token } = await loginUser(req.body);

  return res.status(200).json({
    message: "Login realizado",
    user,
    token
  });
}