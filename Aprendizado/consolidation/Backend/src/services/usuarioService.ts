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

    const user = result.user as typeof result.user & { papel?: string };

    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      papel: user.papel === 'PROFESSOR' ? 'PROFESSOR' : 'ALUNO',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error: unknown) {
    let msg = '';
    let code = '';

    if (error instanceof Error) {
      msg = error.message;
    }

    if (typeof error === 'object' && error !== null) {
      const errRecord = error as Record<string, unknown>;
      if (typeof errRecord.message === 'string') {
        msg = errRecord.message;
      }
      if (typeof errRecord.code === 'string') {
        code = errRecord.code;
      }
      if (typeof errRecord.body === 'object' && errRecord.body !== null) {
        const bodyRecord = errRecord.body as Record<string, unknown>;
        if (typeof bodyRecord.message === 'string') {
          msg = bodyRecord.message;
        }
        if (typeof bodyRecord.code === 'string') {
          code = bodyRecord.code;
        }
      }
    }

    if (msg.toLowerCase().includes('already exists') || code === 'USER_ALREADY_EXISTS') {
      throw AppError.conflict('Este e-mail já está cadastrado na plataforma');
    }
    throw error;
  }
}

export async function listarAlunosService() {
  const { listarAlunos } = await import('../repository/usuarioRepository');
  return await listarAlunos();
}
