import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from './AppError';

export interface RespostaErroPadrao {
  error: string;
  detalhes?: unknown;
}

export interface ResultadoTratamentoErro {
  statusCode: number;
  corpo: RespostaErroPadrao;
}

export const MENSAGEM_ERRO_PADRAO_500 =
  'Não foi possível completar a operação no momento. Por favor, tente novamente mais tarde.';

/**
 * Analisa e padroniza qualquer erro ocorrido no ciclo de vida de uma requisição.
 * Garante que números de erro técnico, códigos brutos, queries SQL ou stack traces
 * NUNCA sejam vazados para o cliente (OWASP A05:2021).
 */
export function tratarErro(err: unknown): ResultadoTratamentoErro {
  // 1. Erro operacional intencional da aplicação
  if (err instanceof AppError) {
    if (err.isOperational) {
      return {
        statusCode: err.statusCode,
        corpo: {
          error: err.message,
        },
      };
    }

    // Se for marcado como não operacional
    console.error('[ERRO NÃO OPERACIONAL CAPTURADO]:', err);
    return {
      statusCode: 500,
      corpo: {
        error: MENSAGEM_ERRO_PADRAO_500,
      },
    };
  }

  // 2. Erros de validação Zod (se escaparem do middleware de validação)
  if (err instanceof ZodError) {
    return {
      statusCode: 422,
      corpo: {
        error: 'Dados inválidos na requisição',
        detalhes: err.format(),
      },
    };
  }

  // 3. Erros conhecidos do Prisma ORM (banco de dados)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERRO PRISMA ${err.code}]:`, err.message);

    switch (err.code) {
      case 'P2002': {
        return {
          statusCode: 409,
          corpo: {
            error: 'Já existe um registro com os mesmos dados informados.',
          },
        };
      }
      case 'P2025':
        return {
          statusCode: 404,
          corpo: {
            error: 'O registro solicitado não foi encontrado.',
          },
        };
      case 'P2003':
        return {
          statusCode: 400,
          corpo: {
            error: 'Referência a registro relacionado inexistente ou inválida.',
          },
        };
      default:
        return {
          statusCode: 500,
          corpo: {
            error: MENSAGEM_ERRO_PADRAO_500,
          },
        };
    }
  }

  // 4. Erros de inicialização ou pânico do Prisma
  if (
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    console.error('[ERRO DE INFRAESTRUTURA DO BANCO]:', err);
    return {
      statusCode: 500,
      corpo: {
        error: MENSAGEM_ERRO_PADRAO_500,
      },
    };
  }

  // 5. Erros genéricos ou não previstos do runtime
  console.error('[ERRO NÃO TRATADO NO SERVIDOR]:', err);

  return {
    statusCode: 500,
    corpo: {
      error: MENSAGEM_ERRO_PADRAO_500,
    },
  };
}
