# Instruções Gemini do Projeto

Este arquivo é o **adaptador local do projeto** para o Gemini/Antigravity. Ele deve ser copiado para um repositório e então customizado com a stack e os comandos reais desse repositório.


## Contexto

Este projeto é uma aplicação full-stack focada em aprendizado avançado de backend, autenticação moderna, arquitetura de APIs REST e organização profissional de sistemas web.

O backend utiliza TypeScript com Bun, Express.js, Prisma ORM e PostgreSQL, implementando autenticação baseada em sessão através do Better Auth com cookies HTTP-only.

O frontend utiliza React com Vite, React Router DOM e Axios para comunicação com a API.

O projeto segue arquitetura modular com separação clara entre rotas, controllers, services, schemas e infraestrutura.

- Backend separado do frontend
- Frontend executa em aplicação Vite independente
- Backend expõe API REST consumida pelo frontend
- Comunicação frontend/backend via HTTP + cookies de sessão

## Regras de Autenticação

- Não implementar autenticação JWT manual paralela
- Better Auth é a única camada oficial de autenticação
- Sessões são baseadas em cookies HTTP-only
- O frontend não manipula tokens diretamente
- Middleware de autenticação é obrigatório em rotas protegidas

## Arquitetura

- routes → definição de endpoints
- controllers → camada HTTP
- services → regras de negócio
- schemas → validação Zod
- lib → prisma, auth e utilitários
- middlewares → autenticação e segurança

---

### Stack Principal

#### Backend

- Runtime: Bun
- Linguagem: TypeScript
- Framework HTTP: Express.js 5
- ORM: Prisma
- Banco de Dados: PostgreSQL
- Adaptador PostgreSQL: `@prisma/adapter-pg`
- Autenticação: Better Auth
- Validação: Zod
- Variáveis de ambiente: dotenv
- Middleware: cors
- HTTP Client: Axios

#### Frontend

- React 18
- Vite
- React Router DOM
- Axios
- Better Auth Client

#### Ferramentas

- Biome.json, lint
- TypeScript
- Prisma CLI
- Bun package manager

---

### Gerenciador de Pacotes

- Bun

---

### Comandos Canônicos

#### Backend

- `lint`: disponível
- `typecheck`: não configurado
- `format`: não configurado
- `build`: não configurado
- `test`: não configurado

#### Frontend

- `lint`: disponível
- `build`: disponível
- `typecheck`: executado dentro do build via `tsc -b`
- `format`: não configurado
- `test`: não configurado

##### Desenvolvimento

```bash
bun run dev
```

## Regra de Prioridade Local

Quando ativos locais do projeto existem, prefira-os nesta ordem:

1. `GEMINI.md`
2. `agents/*.md`
3. `skills/*/SKILL.md`
4. padrões globais do usuário em `~/.gemini/`

Não dependa de estados pessoais do diretório home quando o projeto já fornece uma regra ou habilidade local.

## Roster de Agentes

| Agente | Uso para |
|---|---|
| `@engine` | backend, banco de dados, infra, segurança, performance, testes, implementação técnica |
| `@creative` | frontend, UX, mobile, marca, copy, documentação voltada para humanos |
| `@principal` | bootstrap do projeto, ADRs, especificações técnicas, notas de arquitetura, planos escritos |

## Padrões de Automação

- A orquestração automática é o padrão.
- O usuário descreve o objetivo; a sessão principal decide qual habilidade local carregar e qual agente especialista chamar.
- O caminho rápido (fast path) permanece local para explicações, leitura de arquivos e edições triviais.
- Implementações não triviais devem ser delegadas a um especialista.

## Matriz de Roteamento

| Domínio | Habilidade obrigatória | Especialista |
|---|---|---|
| Arquitetura / Especificações | `spec-writing` | `@principal` |
| Backend / DB / Infra | `database-design` ou `devops-patterns` | `@engine` |
| Segurança / Auditoria | `security-audit` | `@engine` |
| Testes / Refatoração | `testing-patterns` ou `refactoring` | `@engine` |
| UX / UI / Copy / Mobile | `ux-specification`, `brand-identity`, `growth-marketing` ou `mobile-patterns` | `@creative` |
| Performance / Profiling | `performance-analysis` | `@engine` |

## Protocolo de Execução Skill-First (Habilidade Primeiro)

Antes de responder ou delegar trabalho de implementação específico de domínio:

1. Verifique se uma habilidade correspondente existe em `skills/{name}/SKILL.md`.
2. Carregue a habilidade local do projeto primeiro com `read_file`.
3. Recorra a `~/.gemini/skills/{name}/SKILL.md` apenas se o projeto não fornecer uma versão local.
4. Se a tarefa for uma implementação não trivial, delegue ao agente especialista apropriado em vez de codificar diretamente.

## Trabalho entre Domínios

Para tarefas full-stack ou de escopo misto:

- carregue a habilidade relevante para cada domínio primeiro
- divida os escopos de forma limpa entre `@engine` e `@creative`
- mantenha o `@principal` restrito apenas a documentos persistentes

## Convenções

- Código, identificadores, nomes de arquivos, rotas e comandos permanecem em inglês.
- A documentação, o copy da interface e o idioma do chat devem ser definidos pelo contexto do projeto após a cópia deste template.
- Pergunte antes de assumir escopo ou comportamento ambíguo.
- Prefira soluções simples e explícitas em vez de automação oculta.

## Memória

- Arquivos de projeto não devem codificar caminhos pessoais do Obsidian ou do sistema de arquivos.
- A memória entre projetos continua sendo uma preocupação **global do usuário**.
- Se a memória for necessária, prefira uma habilidade local ou uma política de memória global do usuário fora do repositório.

## Contrato de Teste

Toda funcionalidade não trivial deve cobrir:

1. **Comportamento** — caminho feliz, casos de borda, falhas esperadas, idempotência quando relevante
2. **Segurança** — modelagem de ameaças primeiro; cubra autenticação, entrada/saída, mutações, arquivos, rede, criptografia e dependências para as superfícies tocadas
3. **Performance** — orçamentos (budgets) ou verificações de regressão apropriadas para a funcionalidade

A modelagem de ameaças é obrigatória antes da implementação para funcionalidades que tocam em autenticação, entrada de usuário, mutações, arquivos, limites de rede, segredos ou caminhos críticos de performance.

## Protocolo de Conclusão de Tarefa

Antes de declarar a conclusão:

1. Descubra os comandos reais de `lint`, `typecheck`, `format`, `build` e `test` do projeto a partir do manifesto.
2. Se os comandos estiverem faltando, pare e pergunte em vez de inventá-los.
3. Execute as verificações em ordem:
   - `lint`
   - `typecheck`
   - `format`
   - `build`
   - `test`
4. Corrija as falhas antes de prosseguir.

## Encerramento (Closeout)

Antes de concluir o trabalho, decida explicitamente se cada item foi atendido:

- documentação do repositório atualizada
- ADR necessária
- changelog necessário
- documentação de configuração/execução alterada
- documentação de migração necessária
- escrita de memória entre projetos necessária

Silêncio não é conclusão.

## Nunca Faça

- Não codifique caminhos pessoais, credenciais ou suposições locais da máquina.
- Não deixe que o estado da interface interna do app substitua as instruções de projeto versionadas.
- Não crie mais agentes especialistas a menos que haja uma lacuna comprovada.
- Não pule a verificação da habilidade local quando o projeto fornece uma habilidade correspondente.
