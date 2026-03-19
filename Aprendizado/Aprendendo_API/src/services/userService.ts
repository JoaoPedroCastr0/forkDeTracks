import * as userRepo from "../repository/userRepository";
import type { CreateUserDTO } from "../schemas/userSchema";

export async function registerUser(data: CreateUserDTO) {
  const userExists = await userRepo.findUserByEmail(data.email);

  if ((userExists as any[]).length > 0) {
    throw new Error("Usuário já existe");
  }

  const hashedPassword = await Bun.password.hash(data.password);

  const result = await userRepo.createUser(
    data.nome,
    data.email,
    hashedPassword
  );

  return result;
}