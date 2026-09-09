import { auth } from '../auth/auth';
import type { CriarUsuarioDTO } from '../schemas/usuarioSchema';
import { AppError } from '../utils/AppError';

export async function criarUsuarioService(dados: CriarUsuarioDTO) {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: dados.nome,
        email: dados.email,
        password: dados.senha,
      },
    });

    return {
      id: result.user.id,
      nome: result.user.name,
      email: result.user.email,
      papel: (result.user as any).papel || 'ALUNO',
      createdAt: result.user.createdAt,
      updatedAt: result.user.updatedAt,
    };
  } catch (error: any) {
    const msg = error?.message || error?.body?.message || '';
    if (
      msg.toLowerCase().includes('already exists') ||
      error?.body?.code === 'USER_ALREADY_EXISTS'
    ) {
      throw AppError.conflict('Este e-mail já está cadastrado na plataforma');
    }
    throw error;
  }
}
