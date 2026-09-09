const MENSAGEM_PADRAO_TENTE_MAIS_TARDE =
  'Não foi possível completar a operação no momento. Por favor, tente novamente mais tarde.';

/**
 * Higieniza rigorosamente qualquer texto de erro para assegurar que NENHUM número de erro HTTP
 * (ex: 400, 401, 403, 404, 500, etc.), jargão técnico em inglês ou código de exceção
 * seja exibido na tela para o usuário final.
 */
export function sanitizarTextoErro(
  texto: string,
  fallback = MENSAGEM_PADRAO_TENTE_MAIS_TARDE,
): string {
  if (!texto || typeof texto !== 'string') {
    return fallback;
  }

  const textoLimpo = texto.trim();

  // Se o texto contiver códigos de status HTTP (400, 401, 403, 404, 422, 500, 502, 503, etc.)
  const contemCodigoHttp = /\b[45]\d{2}\b/.test(textoLimpo);

  // Termos técnicos que nunca devem ir para a tela
  const termosTecnicos = [
    'bad request',
    'unauthorized',
    'forbidden',
    'not found',
    'internal server error',
    'status code',
    'failed to fetch',
    'network error',
    'econnrefused',
    'syntaxerror',
    'typeerror',
    'referenceerror',
    'prisma',
    'database',
    'unknown token',
    'unexpected token',
  ];

  const contemTermoTecnico = termosTecnicos.some((termo) =>
    textoLimpo.toLowerCase().includes(termo),
  );

  // Se contiver número de erro ou jargão técnico, convertemos em mensagem amigável sem número
  if (contemCodigoHttp || contemTermoTecnico) {
    const lower = textoLimpo.toLowerCase();
    if (lower.includes('403') || lower.includes('forbidden') || lower.includes('permissão') || lower.includes('perfil')) {
      return 'Acesso negado: seu perfil não possui permissão para executar esta ação.';
    }
    if (lower.includes('401') || lower.includes('unauthorized') || lower.includes('sessão')) {
      return 'Sua sessão expirou ou você não está autenticado. Por favor, faça login novamente.';
    }
    if (lower.includes('404') || lower.includes('not found')) {
      return 'O recurso solicitado não foi encontrado.';
    }

    return fallback;
  }

  return textoLimpo;
}

/**
 * Trata erros de respostas HTTP ou de exceções capturadas no frontend.
 * Garante que diagnósticos internos do servidor ou números de status NUNCA cheguem à tela do usuário.
 */
export async function extrairMensagemErro(
  respostaOuErro: Response | unknown,
  fallback = MENSAGEM_PADRAO_TENTE_MAIS_TARDE,
): Promise<string> {
  // Se for uma resposta do fetch (Response)
  if (typeof Response !== 'undefined' && respostaOuErro instanceof Response) {
    if (respostaOuErro.status >= 500) {
      return fallback;
    }

    try {
      const data = await respostaOuErro.json();
      if (data && typeof data === 'object') {
        const mensagemServidor = data.error || data.erro || data.message;
        if (typeof mensagemServidor === 'string' && mensagemServidor.trim().length > 0) {
          return sanitizarTextoErro(mensagemServidor, fallback);
        }
      }
    } catch {
      // Falha ao parsear JSON
    }

    if (respostaOuErro.status === 403) {
      return 'Acesso negado: seu perfil não possui permissão para executar esta ação.';
    }
    if (respostaOuErro.status === 401) {
      return 'Sua sessão expirou ou você não está autenticado. Por favor, faça login novamente.';
    }
    if (respostaOuErro.status === 404) {
      return 'O recurso solicitado não foi encontrado.';
    }

    return fallback;
  }

  // Se for uma Exception / Error do JavaScript
  if (respostaOuErro instanceof Error) {
    return sanitizarTextoErro(respostaOuErro.message, fallback);
  }

  if (typeof respostaOuErro === 'string' && respostaOuErro.trim().length > 0) {
    return sanitizarTextoErro(respostaOuErro, fallback);
  }

  return fallback;
}
