import * as userRepo from "../repository/userRepository";
import type { CreateUserDTO } from "../schemas/authSchema";
import { AppError } from "../utils/AppError";

export async function registerUser(data: CreateUserDTO) {
  const userExists = await userRepo.findUserByEmail(data.email);

  if ((userExists as any[]).length > 0) {
    throw new AppError("Usuário já existe");
  }

  const hashedPassword = await Bun.password.hash(data.password);

  const result = await userRepo.createUser(
    data.nome,
    data.email,
    hashedPassword
  );

  return result;
}