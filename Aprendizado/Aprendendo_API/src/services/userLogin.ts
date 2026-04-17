import * as userRepository from "../repository/userRepository";
import type { LoginDTO } from "../schemas/authSchema";
import { AppError } from "../utils/AppError";
import { generateToken } from "../utils/generateToken";




export async function loginUser(data: LoginDTO) {
  const user = await userRepository.findUserByEmail(data.email);

 

  // valida usuário
  if (!user) {
    throw new AppError("Usuário não encontrado");
  }

  // verifica senha
  const isValid = await Bun.password.verify(
    data.password,
    user.password
  );

  if (!isValid) {
    throw new AppError("Senha inválida");
  }

  // valida secret ANTES
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("JWT_SECRET não definido");
  }

  // gera token
const token = generateToken({
  id: user.id,
  email: user.email
});
  return {
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email
    },
    token
  };
}