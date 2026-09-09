/**
 * Classe padronizada para erros operacionais da aplicação.
 * Erros operacionais são previsíveis e conhecidos pelas regras de negócio
 * (ex: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity).
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly codigo?: string;

  constructor(message: string, statusCode = 400, codigo?: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.codigo = codigo;
    this.isOperational = isOperational;

    // Mantém a cadeia de protótipos adequada
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message: string, codigo = 'REQUISICAO_INVALIDA'): AppError {
    return new AppError(message, 400, codigo);
  }

  static unauthorized(message = 'Usuário não autenticado', codigo = 'NAO_AUTENTICADO'): AppError {
    return new AppError(message, 401, codigo);
  }

  static forbidden(
    message = 'Acesso negado: seu perfil não possui permissão para executar esta ação',
    codigo = 'ACESSO_NEGADO',
  ): AppError {
    return new AppError(message, 403, codigo);
  }

  static notFound(message = 'Recurso não encontrado', codigo = 'NAO_ENCONTRADO'): AppError {
    return new AppError(message, 404, codigo);
  }

  static conflict(
    message = 'Conflito com o estado atual do recurso',
    codigo = 'CONFLITO',
  ): AppError {
    return new AppError(message, 409, codigo);
  }

  static unprocessable(
    message = 'Dados inválidos ou não processáveis',
    codigo = 'DADOS_INVALIDOS',
  ): AppError {
    return new AppError(message, 422, codigo);
  }

  static internal(
    message = 'Não foi possível completar a operação no momento. Por favor, tente novamente mais tarde.',
    codigo = 'ERRO_INTERNO',
  ): AppError {
    return new AppError(message, 500, codigo, false);
  }
}
