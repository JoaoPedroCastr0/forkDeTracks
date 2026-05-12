---
name: architecture-reading
description: Use para entender a arquitetura atual antes de decidir ou implementar, mapeando stack, fronteiras, fluxos, padrões e decisões já existentes.
triggers:
  - "entender arquitetura antes de agir"
  - "projeto desconhecido antes de implementação"
  - "mapear stack, fronteiras e padrões existentes"
license: MIT
---

# Architecture Reading

## Quando Usar

- Antes de qualquer decisão arquitetural em um projeto existente
- Quando a sessão principal ou um agente precisa entender o contexto técnico atual
- Ao iniciar uma nova tarefa em codebase desconhecido
- Para validar se uma nova decisão conflita com decisões anteriores

## Passos

### 1. Localizar documentação de contexto existente

Buscar documentação arquitetural no projeto. Locais comuns:
- Diretório `docs/` e subdiretórios (architecture, decisions, adr, context)
- `README.md` na raiz do projeto
- Arquivos de decisão (ADRs) — podem estar em `docs/decisions/`, `docs/adr/`, `architecture/decisions/` ou similar
- Arquivos de convenções ou padrões do projeto

> **Dica:** usar busca por nomes de arquivo (`architecture`, `adr`, `decisions`, `stack`, `conventions`) para descobrir a estrutura de documentação do projeto.

Se não existir nada: registrar que o projeto **não tem contexto documentado** e recomendar criar.

### 2. Mapear a stack tecnológica

Ler os arquivos de configuração do projeto:
```
package.json / pom.xml / build.gradle / Cargo.toml / go.mod / pyproject.toml
docker-compose.yml / Dockerfile
.env.example
```

Extrair: linguagem, frameworks, bancos de dados, serviços externos, versões principais.

### 3. Identificar fronteiras do sistema

Mapear:
- Quais são os módulos/serviços principais?
- Como eles se comunicam (HTTP, eventos, filas, RPC)?
- Quais são as dependências externas?
- Onde ficam as fronteiras de domínio?

### 4. Identificar padrões arquiteturais em uso

Verificar evidências de:
- Padrão de camadas (MVC, Clean Architecture, Hexagonal)?
- Separação de responsabilidades (repositórios, serviços, controllers)?
- Padrões de comunicação (REST, GraphQL, eventos)?
- Padrões de dados (CQRS, Event Sourcing)?

### 5. Consolidar o relatório de leitura

Produzir um resumo estruturado com:
```markdown
## Stack
[linguagem, frameworks, bancos]

## Fronteiras
[módulos e como se comunicam]

## Padrões Identificados
[padrões arquiteturais em uso]

## Decisões Anteriores Relevantes
[ADRs encontrados que impactam a tarefa atual]

## Lacunas Documentais
[o que não está documentado e deveria estar]
```

## Quando Não Existe Documentação

Se o projeto não tem documentação arquitetural, registrar claramente:

> "Projeto sem documentação arquitetural. Análise baseada em inferência de código.
> Recomendo criar um documento de arquitetura com o resultado desta leitura."

## Referências

- Template de resumo canônico: usar a seção `### 5. Consolidar o relatório de leitura` desta própria skill
- Exemplo de saída: usar a seção `## Exemplos` abaixo como referência

## Checklist de validação

- [ ] Stack tecnológica completa mapeada (linguagem, frameworks, banco, infra)
- [ ] Fronteiras do sistema identificadas (o que é interno vs externo)
- [ ] Padrões de comunicação mapeados (REST, gRPC, filas, eventos)
- [ ] Decisões arquiteturais existentes localizadas (ADRs, Tech Specs)
- [ ] Convenções do projeto documentadas (nomenclatura, estrutura de pastas)
- [ ] Pontos de atenção / dívida técnica identificados
- [ ] Resumo entregue ao time antes de iniciar qualquer implementação

## Exemplos

### Output de leitura arquitetural

```markdown
## Leitura Arquitetural — Projeto X

**Stack:** Node.js 20 + TypeScript, Express, PostgreSQL 15, Redis, Docker  
**Padrão:** Layered Architecture (handler → service → repository)  
**Testes:** Jest + Supertest (integração), 73% de cobertura atual

### Fronteiras
- **Externas:** Stripe (pagamentos), SendGrid (email), S3 (arquivos)
- **Internas:** API REST → Worker queue (BullMQ) → Email service

### Convenções Encontradas
- Arquivos em `kebab-case`, classes em `PascalCase`
- Erros tipados: `AppError extends Error` com `code` e `status`
- Migrations em `db/migrations/` — rodar com `npm run db:migrate`

### Pontos de Atenção
- Sem rate limiting nos endpoints públicos (risco de abuse)
- `UserRepository` com 3 queries N+1 identificadas nas linhas 45, 67, 89
```
