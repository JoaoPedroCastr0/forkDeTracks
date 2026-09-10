import type { AulaConteudo } from '@/types';

export interface PedagogicalOption {
  id: string;
  label: string;
  codeSnippet?: string;
  isCorrect: boolean;
  misconceptionExplanation?: string;
  successExplanation?: string;
}

export interface PedagogicalChallenge {
  id: string;
  title: string;
  scenario: string;
  codeSnippet?: string;
  codeLanguage?: string;
  question: string;
  options: PedagogicalOption[];
  socraticHint: string;
  competencyGained: string;
}

export interface TerminalExperiment {
  title: string;
  command: string;
  objective: string;
  expectedOutcome: string;
}

export interface LessonPedagogicalData {
  learningObjectives: string[];
  keyConcepts: {
    title: string;
    description: string;
  }[];
  challenge: PedagogicalChallenge;
  terminalExperiment?: TerminalExperiment;
  projectConnection: {
    phase: string;
    description: string;
    architecturalImpact: string;
  };
}

const STATIC_PEDAGOGICAL_DATA: Record<string, LessonPedagogicalData> = {
  'aula-ts-1': {
    learningObjectives: [
      'Entender o impacto do modo strict do compilador TypeScript na prevenção de bugs em runtime',
      'Configurar flags essenciais: strictNullChecks, noImplicitAny e noUncheckedIndexedAccess',
      'Evitar coerções invisíveis e garantir que undefined seja tratado explicitamente',
    ],
    keyConcepts: [
      {
        title: 'strict: true',
        description:
          'Habilita um pacote de verificações rigorosas do compilador, impedindo que tipos assumam valores null ou undefined sem validação explícita.',
      },
      {
        title: 'Cultura do Erro em Compilação',
        description:
          'Erros do compilador TypeScript não são obstáculos; são sentinelas que evitam exceções críticas em produção.',
      },
      {
        title: 'Eliminação de Null Pointer Exceptions',
        description:
          'Com strictNullChecks ativo, acessar propriedades de objetos potencialmente nulos exige type guards ou narrowing obrigatório.',
      },
    ],
    challenge: {
      id: 'desafio-strict-1',
      title: 'Desafio: Protegendo o Compilador contra Valores Indefinidos',
      scenario:
        'Você está revisando um código legado de busca de usuário por ID em memória. No modo strict, o TypeScript apontou um possível erro de runtime:',
      codeLanguage: 'typescript',
      codeSnippet: `interface Usuario {\n  id: string;\n  nome: string;\n}\n\nconst usuarios: Usuario[] = [{ id: '1', nome: 'Alex' }];\n\nfunction obterNome(id: string): string {\n  const usuario = usuarios.find((u) => u.id === id);\n  return usuario.nome; // ⚠️ Object is possibly 'undefined'\n}`,
      question:
        'Qual das seguintes abordagens resolve o problema respeitando as boas práticas de tipagem estrita e segurança em runtime?',
      options: [
        {
          id: 'opt-1',
          label: 'Usar operador de não-nulo: return usuario!.nome;',
          isCorrect: false,
          misconceptionExplanation:
            'O operador "!" apenas silencia o compilador sem fornecer proteção real. Se o usuário não for encontrado em runtime, a aplicação lançará um TypeError fatal ("Cannot read properties of undefined").',
        },
        {
          id: 'opt-2',
          label: 'Lançar uma exceção de domínio se não encontrado ou retornar string segura com narrowing explícito.',
          isCorrect: true,
          successExplanation:
            'Excelente! Tratar a ausência explicitamente (lançando um erro de domínio ou retornando null com tipo atualizado) garante robustez tanto para o compilador quanto para o runtime.',
        },
        {
          id: 'opt-3',
          label: 'Mudar o tsconfig.json para strict: false para permitir retornos nulos.',
          isCorrect: false,
          misconceptionExplanation:
            'Desativar o strict contorna a checagem, mas degrada a confiabilidade de todo o projeto, abrindo portas para falhas imprevisíveis em produção.',
        },
      ],
      socraticHint:
        'Pense sobre o que acontece quando alguém chama obterNome("id-inexistente"). O que a função find() retorna e como seu código deve responder a isso?',
      competencyGained: 'Configuração Estrita e Defesa Contra Null/Undefined',
    },
    terminalExperiment: {
      title: 'Experimente no seu Terminal',
      command: 'bunx tsc --noEmit',
      objective: 'Verifique se o seu tsconfig.json acusa variáveis não verificadas.',
      expectedOutcome:
        'O compilador deve listar 0 erros quando todos os fluxos com possível undefined estiverem protegidos.',
    },
    projectConnection: {
      phase: 'Fundação da Plataforma',
      description:
        'A configuração strict é a base que sustenta a integridade de todas as entidades de Domínio (Curso, Módulo, Aula).',
      architecturalImpact:
        'Garante que nenhuma camada passe dados nulos sem que o próximo elo esteja ciente.',
    },
  },
  'aula-ts-2': {
    learningObjectives: [
      'Diferenciar semanticamente quando utilizar interface versus type alias',
      'Dominar técnicas de estreitamento de tipo (Type Narrowing com typeof, instanceof e in)',
      'Criar Type Guards customizados para validação segura de payloads desconhecidos',
    ],
    keyConcepts: [
      {
        title: 'Type Narrowing',
        description:
          'Processo pelo qual o TypeScript refina um tipo amplo (como unknown ou união) para um tipo mais específico dentro de um bloco condicional.',
      },
      {
        title: 'Discriminated Unions',
        description:
          'Padrão onde diferentes estruturas compartilham uma propriedade literal comum (ex: { tipo: "ALUNO" } vs { tipo: "PROFESSOR" }) permitindo narrowing automático.',
      },
    ],
    challenge: {
      id: 'desafio-narrowing-2',
      title: 'Desafio: Type Guard Seguro para Sessão de Usuário',
      scenario:
        'Recebemos um objeto session.user tipado como unknown na borda da aplicação. Precisamos extrair o papel com segurança absoluta.',
      codeLanguage: 'typescript',
      codeSnippet: `function verificarPapel(user: unknown): 'ALUNO' | 'PROFESSOR' | null {\n  // Como implementar a validação sem usar (user as any)?\n}`,
      question:
        'Qual estratégia garante type safety completa sem contornar as regras de linter e sem blind casts?',
      options: [
        {
          id: 'opt-1',
          label: 'Verificar com typeof user === "object" && user !== null && "papel" in user com checagem de valor literal.',
          isCorrect: true,
          successExplanation:
            'Perfeito! Essa é exatamente a estratégia implementada no nosso helper obterPapelUsuario(), eliminando blind casts e garantindo segurança total.',
        },
        {
          id: 'opt-2',
          label: 'Fazer cast direto: return (user as { papel: string }).papel as any;',
          isCorrect: false,
          misconceptionExplanation:
            'Casting com "as any" quebra o contrato de governança do projeto (ADR 009) e pode falhar em runtime se o objeto for null ou não possuir a propriedade.',
        },
        {
          id: 'opt-3',
          label: 'Usar JSON.stringify(user) e buscar a palavra "PROFESSOR" via regex.',
          isCorrect: false,
          misconceptionExplanation:
            'Regex sobre JSON é custoso, frágil e pode resultar em falsos positivos se o nome do usuário ou email contiver a substring procurada.',
        },
      ],
      socraticHint:
        'Lembre-se: em JavaScript puro, typeof null é "object". Como você garante que o valor é um objeto real antes de inspecionar suas chaves?',
      competencyGained: 'Type Narrowing e Guardas de Tipo Personalizadas',
    },
    terminalExperiment: {
      title: 'Teste de Guardas de Tipo',
      command: 'bun test src/middlewares/auth.middleware.test.ts',
      objective: 'Observe como o typeguard protege rotas administrativas.',
      expectedOutcome: '100% dos testes devem passar com narrow seguro de sessões.',
    },
    projectConnection: {
      phase: 'Camada de Autenticação e RBAC',
      description:
        'Permite que controllers e middlewares identifiquem se a requisição provém de ALUNO ou PROFESSOR sem recorrer a tipos perigosos.',
      architecturalImpact: 'Elimina vulnerabilidades de elevação indevida de privilégio.',
    },
  },
  'aula-ts-3': {
    learningObjectives: [
      'Construir funções e classes genéricas reutilizáveis mantendo máxima tipagem',
      'Aplicar restrições genéricas usando extends (Generic Constraints)',
      'Projetar contratos genéricos para repositórios e serviços de domínio',
    ],
    keyConcepts: [
      {
        title: 'Generics (<T>)',
        description:
          'Parâmetros de tipo que permitem criar componentes que funcionam sobre uma variedade de tipos em vez de um único, mantendo a integridade.',
      },
      {
        title: 'Restrições (<T extends { id: string }>)',
        description:
          'Garante que o tipo genérico possua minimamente certas propriedades obrigatórias, permitindo acessá-las com segurança dentro da função.',
      },
    ],
    challenge: {
      id: 'desafio-generics-3',
      title: 'Desafio: Repositório Base Genérico com Restrição de ID',
      scenario:
        'Você deseja criar uma função genérica buscarPorId<T>() que opera sobre qualquer entidade que contenha um identificador "id".',
      codeLanguage: 'typescript',
      codeSnippet: `function buscarPorId<T>(colecao: T[], id: string): T | undefined {\n  return colecao.find((item) => item.id === id); // ⚠️ Property 'id' does not exist on type 'T'\n}`,
      question:
        'Como você deve tipar o parâmetro de tipo T para que o compilador permita acessar item.id?',
      options: [
        {
          id: 'opt-1',
          label: 'Declarar a restrição genérica: function buscarPorId<T extends { id: string }>',
          isCorrect: true,
          successExplanation:
            'Exato! Ao declarar <T extends { id: string }>, você informa ao compilador que qualquer tipo passado terá no mínimo a propriedade "id" como string.',
        },
        {
          id: 'opt-2',
          label: 'Fazer o cast dentro do find: (item as any).id === id',
          isCorrect: false,
          misconceptionExplanation:
            'Usar any aqui ignora o propósito do TypeScript e retira a garantia de que os objetos passados realmente contêm um ID.',
        },
        {
          id: 'opt-3',
          label: 'Substituir T por any[] no parâmetro da função.',
          isCorrect: false,
          misconceptionExplanation:
            'Isso destrói o retorno tipado: quem chamar a função receberá any em vez do tipo original da entidade.',
        },
      ],
      socraticHint:
        'Como informamos ao compilador: "T pode ser qualquer entidade, desde que ela tenha pelo menos uma propriedade id"?',
      competencyGained: 'Abstrações Genéricas Reutilizáveis e Restrições Tipadas',
    },
    terminalExperiment: {
      title: 'Experimentando Generics no Terminal',
      command: 'bun run test',
      objective: 'Verifique a robustez dos repositórios tipados com generics.',
      expectedOutcome: 'Zero erros de tipagem com reutilização total de métodos.',
    },
    projectConnection: {
      phase: 'Camada de Persistência e Repositórios',
      description:
        'Generics são o coração dos repositórios que conectam Prisma e serviços na plataforma de ensino.',
      architecturalImpact:
        'Evita código duplicado para CursoRepository, AulaRepository e MatriculaRepository.',
    },
  },
  'aula-ts-4': {
    learningObjectives: [
      'Utilizar Utility Types avançados: Pick, Omit, Partial e ReturnType',
      'Derivar DTOs seguros a partir de Schemas Zod usando z.infer<typeof schema>',
      'Garantir SSoT (Single Source of Truth) entre validação de borda e tipos TypeScript',
    ],
    keyConcepts: [
      {
        title: 'Derivação com z.infer',
        description:
          'Em vez de criar uma interface TypeScript e um schema Zod separadamente (duplicação perigosa), definimos o schema e inferimos o tipo.',
      },
      {
        title: 'Imutabilidade de DTOs',
        description:
          'DTOs de entrada não devem ser mutados durante o ciclo de vida da requisição.',
      },
    ],
    challenge: {
      id: 'desafio-zod-4',
      title: 'Desafio: Sincronia Perfeita entre Validação de Borda e DTO',
      scenario:
        'Um desenvolvedor criou um schema Zod e uma interface manual para criar uma Aula. Um colega adicionou "duracaoMinutos" no schema mas esqueceu na interface.',
      codeLanguage: 'typescript',
      codeSnippet: `export const CriarAulaSchema = z.object({\n  titulo: z.string().min(3),\n  duracaoMinutos: z.number().int().positive(),\n});\n\n// Interface criada manualmente:\nexport interface CriarAulaDTO {\n  titulo: string;\n  // duracaoMinutos foi esquecido aqui!\n}`,
      question:
        'Qual é a prática recomendada pela arquitetura (ADR 005) para eliminar esse risco de divergência?',
      options: [
        {
          id: 'opt-1',
          label: 'Inferir o DTO diretamente do schema Zod: type CriarAulaDTO = z.infer<typeof CriarAulaSchema>;',
          isCorrect: true,
          successExplanation:
            'Correto! z.infer estabelece o Schema Zod como Fonte Única da Verdade (SSoT). Qualquer alteração nas regras de validação reflete automaticamente na tipagem.',
        },
        {
          id: 'opt-2',
          label: 'Manter a interface e usar testes manuais para verificar se os campos batem.',
          isCorrect: false,
          misconceptionExplanation:
            'Depender de checagens manuais é propenso a erros e gera débitos técnicos silenciosos conforme o sistema evolui.',
        },
        {
          id: 'opt-3',
          label: 'Remover o Zod e fazer todas as validações com if manuais no controller.',
          isCorrect: false,
          misconceptionExplanation:
            'Validadores manuais no controller violam a separação de responsabilidades e abrem brechas de segurança de borda.',
        },
      ],
      socraticHint:
        'Como garantir que o compilador e a validação de runtime nunca fiquem descompassados?',
      competencyGained: 'Modelagem de DTOs Seguros com Zod e SSoT',
    },
    terminalExperiment: {
      title: 'Validação de Schemas Zod',
      command: 'bunx tsc --noEmit',
      objective: 'Confira a derivação automática de tipos Zod sem duplicação de interfaces.',
      expectedOutcome: 'Tipos inferidos em sincronia total com os validadores de schema.',
    },
    projectConnection: {
      phase: 'Validação de Borda e Encadeamento Seguro (ADR 005)',
      description:
        'Garante que os dados enviados pelos formulários do front-end sejam perfeitamente aceitos pelo backend sem surpresas de validação.',
      architecturalImpact: '100% de previsibilidade nas chamadas à API.',
    },
  },
};

export function obterConteudoPedagogico(
  aula: AulaConteudo,
  moduloTitulo?: string,
): LessonPedagogicalData {
  if (STATIC_PEDAGOGICAL_DATA[aula.id]) {
    return STATIC_PEDAGOGICAL_DATA[aula.id];
  }

  const tituloLimpo = aula.titulo.replace(/^Aula \d+:\s*/i, '');
  const contexto = moduloTitulo || 'Desenvolvimento Web e Programação';

  return {
    learningObjectives: [
      `Compreender os fundamentos teóricos e práticos de: ${tituloLimpo}`,
      `Analisar o impacto arquitetural de ${tituloLimpo} no contexto de ${contexto}`,
      'Aplicar boas práticas de código limpo, tipagem estrita e resiliência',
    ],
    keyConcepts: [
      {
        title: 'Fundamento Central',
        description:
          aula.descricao ||
          `Exploração aprofundada dos conceitos e padrões aplicados em ${tituloLimpo}.`,
      },
      {
        title: 'Prática Deliberada',
        description:
          'O domínio de engenharia de software ocorre pela experimentação ativa, identificação de falhas e refatoração contínua.',
      },
      {
        title: 'Resiliência e Cultura do Erro',
        description:
          'Entender onde uma abordagem falha é tão valioso quanto saber como implementá-la corretamente.',
      },
    ],
    challenge: {
      id: `desafio-dinamico-${aula.id}`,
      title: `Desafio Prático: ${tituloLimpo}`,
      scenario: `Durante a implementação prática de "${tituloLimpo}", você se depara com uma decisão de engenharia para manter o sistema sustentável e seguro.`,
      question:
        'Considerando os princípios de engenharia e a filosofia "Aprender → Construir → Evoluir", qual é a abordagem mais adequada?',
      options: [
        {
          id: 'opt-din-1',
          label:
            'Aplicar validação rigorosa na borda, tipagem estrita e tratamento de erros sem vazamento técnico.',
          isCorrect: true,
          successExplanation:
            'Excelente! Essa abordagem segue os princípios arquiteturais fundamentais da plataforma, garantindo código confiável e seguro.',
        },
        {
          id: 'opt-din-2',
          label:
            'Implementar uma solução rápida contornando verificações de tipos para acelerar o desenvolvimento.',
          isCorrect: false,
          misconceptionExplanation:
            'Soluções que ignoram checagens de tipos criam dívidas técnicas e aumentam drasticamente a chance de falhas em produção.',
        },
        {
          id: 'opt-din-3',
          label:
            'Confiar cegamente nos dados de entrada sem validar ou higienizar parâmetros.',
          isCorrect: false,
          misconceptionExplanation:
            'Dados não validados na borda são a causa primária das maiores vulnerabilidades de segurança em aplicações web (OWASP Top 10).',
        },
      ],
      socraticHint:
        'Reflita sobre como as decisões de arquitetura tomadas agora impactam a manutenibilidade do projeto no longo prazo.',
      competencyGained: `Domínio Prático de ${tituloLimpo}`,
    },
    terminalExperiment: {
      title: 'Experimente na sua Máquina',
      command: 'bun run check',
      objective: `Valide as regras de lint e tipagem após experimentar o conceito de ${tituloLimpo}.`,
      expectedOutcome: 'Código formatado, tipado e livre de alertas de governança.',
    },
    projectConnection: {
      phase: 'Construção Contínua',
      description: `Esta aula fornece blocos essenciais para consolidar o aprendizado prático no módulo "${contexto}".`,
      architecturalImpact:
        'Cada conceito assimilado aproxima você da maestria arquitetural.',
    },
  };
}

export function calcularNivelMaestria(percentual: number): {
  nivel: 'Aprendiz' | 'Construtor' | 'Arquiteto';
  descricao: string;
  proximoPasso: string;
} {
  if (percentual < 40) {
    return {
      nivel: 'Aprendiz',
      descricao: 'Construindo os alicerces teóricos e primeiras práticas guiadas.',
      proximoPasso: 'Finalize os desafios iniciais para subir para Construtor.',
    };
  }
  if (percentual < 85) {
    return {
      nivel: 'Construtor',
      descricao: 'Desenvolvendo soluções ativas e aplicando padrões de arquitetura.',
      proximoPasso: 'Consolide os módulos avançados para alcançar o nível Arquiteto.',
    };
  }
  return {
    nivel: 'Arquiteto',
    descricao: 'Domínio pleno da stack, arquitetura resiliente e mentalidade de engenharia.',
    proximoPasso: 'Você dominou esta trilha! Continue explorando os próximos cursos.',
  };
}
