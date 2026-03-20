import * as userRepository from "../repository/userRepository";
import jwt from "jsonwebtoken";
import type { LoginDTO } from "../schemas/authSchema";
import { AppError } from "../utils/AppError";


export async function loginUser(data: LoginDTO) {
  const users = await userRepository.findUserByEmail(data.email);

  const user = users[0];

  // 🔹 valida usuário
  if (!user) {
    throw new AppError("Usuário não encontrado");
  }

  // 🔹 verifica senha
  const isValid = await Bun.password.verify(
    data.password,
    user.password
  );

  if (!isValid) {
    throw new AppError("Senha inválida");
  }

  // 🔹 valida secret ANTES
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("JWT_SECRET não definido");
  }

  // 🔹 gera token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    secret,
    {
      expiresIn: "1d"
    }
  );

  return {
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email
    },
    token
  };
}