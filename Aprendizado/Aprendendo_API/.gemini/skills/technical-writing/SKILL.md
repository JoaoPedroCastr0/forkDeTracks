---
name: technical-writing
description: Use para escrever documentação técnica clara para humanos: README, CONTRIBUTING, API docs, runbooks, onboarding e changelog.
triggers:
  - "escrever ou atualizar README, CONTRIBUTING ou CHANGELOG"
  - "criar API docs, runbooks ou guias de onboarding"
  - "documentação técnica voltada a humanos"
license: MIT
---

# Technical Writing

## Quando Usar

- Escrever ou atualizar README de um projeto
- Criar guias de contribuição (CONTRIBUTING.md)
- Documentar APIs para consumidores
- Escrever changelogs e release notes
- Criar documentação de onboarding para novos devs
- Escrever runbooks para operações

## Princípios

1. **Audiência primeiro** — quem vai ler? Dev sênior? Novo contribuidor? Usuário final?
2. **Clareza > completude** — melhor documentação curta e clara do que longa e confusa
3. **Exemplos concretos** — código que roda vale mais que prosa explicativa
4. **Mantenível** — documentação que fica desatualizada é pior que nenhuma
5. **Scannable** — headers, listas, tabelas — ninguém lê parágrafos longos

## Regra de Idioma

- Documentação e UI seguem o contexto do projeto definido em `GEMINI.md` e `AGENTS.md`
- Código, comandos, rotas, nomes de arquivo e identificadores permanecem em English
- Os exemplos abaixo usam English nos trechos executáveis e nos artefatos versionados para evitar hardcode de idioma

## README.md — Estrutura

```markdown
# Nome do Projeto

[Uma frase que explica o que é e para quem.]

## Quick Start

[3-5 passos para ter o projeto rodando. Código executável.]

## Instalação

[Passo a passo detalhado. Pré-requisitos listados.]

## Uso

[Exemplos dos cenários mais comuns. Código que funciona.]

## Configuração

[Variáveis de ambiente, arquivos de config, opções.]

## Desenvolvimento

[Como rodar testes, lint, build. Convenções do projeto.]

## Contribuindo

[Link para CONTRIBUTING.md ou instruções básicas.]

## Licença

[Tipo de licença e link.]
```

**Regras:**
- Quick Start em até 5 passos — dev impaciente testa antes de ler tudo
- Exemplos de código devem funcionar — testar antes de documentar
- Badges no topo se relevante (CI status, versão, cobertura)
- Sem informação redundante com outros arquivos (link, não copie)

## CONTRIBUTING.md — Estrutura

```markdown
# Como Contribuir

## Pré-requisitos
[Ferramentas necessárias com versões.]

## Setup do Ambiente
[Passo a passo para clonar e configurar.]

## Fluxo de Trabalho
1. Criar branch a partir de `main`
2. Fazer mudanças com commits descritivos
3. Rodar testes: `npm test`
4. Abrir PR com descrição do que/por quê

## Convenções
[Commit messages, nomenclatura, estilo de código.]

## Review Process
[O que esperar, SLA, critérios de aprovação.]
```

## API Documentation

### Documentação por Endpoint

```markdown
### POST /users

Creates a new user.

**Request:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✅ | Full name |
| email | string | ✅ | Valid email address |
| role | string | ❌ | Default: "user" |

**Response 201:**
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z"
}

**Errors:**
| Status | Code | When |
|--------|------|------|
| 400 | VALIDATION_ERROR | Required field is missing |
| 409 | DUPLICATE_EMAIL | Email is already registered |
```

**Regras:**
- Exemplo de request e response para cada endpoint
- Listar todos os erros possíveis
- Manter junto ao código (OpenAPI spec, ou Markdown versionado)
- Gerar a partir do código quando possível (swagger-jsdoc, etc.)

## Changelog — Formato

Seguir [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

## [1.2.0] - 2024-03-15

### Added
- Endpoint POST /users/reset-password

### Changed
- Pagination now uses cursor-based navigation on /orders

### Fixed
- Timezone bug in token expiration calculation

### Removed
- Deprecated endpoint GET /users/list (use GET /users)
```

**Categorias padrão:** Added, Changed, Deprecated, Removed, Fixed, Security

## Runbooks — Estrutura

```markdown
# Runbook: [Nome do Procedimento]

## Quando Usar
[Sintoma ou trigger que inicia este procedimento.]

## Pré-requisitos
[Acesso, ferramentas, permissões necessárias.]

## Passos
1. [Passo concreto com comando]
2. [Verificação de que funcionou]
3. [Próximo passo]

## Rollback
[Como desfazer se algo der errado.]

## Contato
[Quem escalonar se o runbook não resolver.]
```

## Boas Práticas de Escrita

- **Voz ativa** — "Execute o comando" (não "o comando deve ser executado")
- **Imperativos** — "Instale", "Configure", "Execute" (não "você deve instalar")
- **Frases curtas** — máximo 1-2 linhas por frase
- **Listas** — preferir listas a parágrafos para instruções
- **Tabelas** — usar para dados estruturados (parâmetros, status codes)
- **Code blocks** — com linguagem declarada para syntax highlighting
- **Links internos** — cross-reference entre documentos, não duplicar conteúdo

## Checklist de Documentação

- [ ] README com Quick Start funcional
- [ ] Todos os exemplos de código testados e funcionando
- [ ] Sem jargão inexplicado para a audiência-alvo
- [ ] Headers e estrutura permitem scanning rápido
- [ ] Links internos e externos funcionando
- [ ] Data de última atualização visível ou inferable (via git)

## Exemplos

### README.md básico funcional

```markdown
# Project Name

One-line description — what it does and for whom.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Documentation

- [Full installation guide](docs/installation.md)
- [API reference](docs/api.md)
- [Contributing](CONTRIBUTING.md)
```

### Changelog entry (Keep a Changelog)

```markdown
## [1.3.0] - 2024-02-01

### Added
- OAuth2 authentication with Google and GitHub (#123)
- Endpoint `GET /users/me` for the authenticated user profile

### Fixed
- Race condition in concurrent uploads (#145)

### Changed
- `POST /orders` now returns 201 instead of 200 (breaking change)
```
