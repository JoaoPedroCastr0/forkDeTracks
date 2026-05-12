---
name: gemini-instructions
description: Use para criar ou atualizar GEMINI.md, SKILL.md, agentes .md e arquivos .instructions.md, definindo escopo, frontmatter e regras de uso.
triggers:
  - "criar ou atualizar GEMINI.md"
  - "criar ou atualizar SKILL.md ou .md de agente"
  - "configurar instruções por caminho (.instructions.md)"
license: MIT
---

# Gemini Instructions

## Quando Usar

- Criar ou atualizar o arquivo `GEMINI.md` do repositório
- Criar ou atualizar uma `SKILL.md` de conhecimento reutilizável
- Criar ou atualizar um `.md` de persona especializada
- Configurar instruções por caminho de arquivo (`.instructions.md`)

## Tipos de Instrução Gemini CLI

| Tipo | Arquivo | Escopo |
|------|---------|--------|
| Global | `~/.gemini/GEMINI.md` | Todas as sessões do usuário |
| Repositório | `GEMINI.md` | Todo o repositório |
| Por caminho | `.github/instructions/*.instructions.md` com `applyTo` no frontmatter | Arquivos específicos |
| Skill | `skills/<name>/SKILL.md` | Carregada sob demanda por agente |
| Agent | `agents/<name>.md` | Contexto isolado do subagente |

## Formato: GEMINI.md

Arquivo de instruções globais do repositório. Deve definir:

```markdown
# [Nome do Projeto] — Gemini Instructions

## Contexto
[O que é o projeto, stack principal, idioma de resposta]

## Convenções
[Convenções de código, nomenclatura, padrões obrigatórios]

## Protocolo de Resposta
[Como o agente deve trabalhar — etapas, aprovação, registro]

## Roster de Agentes
[Tabela de agentes disponíveis e quando chamar cada um]

## Nunca Faça
[Anti-padrões explícitos para este repositório]
```

## Formato: SKILL.md

Conhecimento procedural reutilizável. Frontmatter mínimo obrigatório:

```yaml
---
name: skill-name
description: Quando usar esta skill em uma frase precisa.
license: MIT
---
```

Campos opcionais: `type: skill`, `targets: [gemini-cli]`.

Corpo do SKILL.md deve conter:
- **Quando Usar** — gatilhos precisos
- **Checklist ou Workflow** — passo-a-passo executável
- **Padrões** — código de referência, exemplos
- **Nunca Faça** — anti-padrões explícitos

## Formato: .md

Persona isolada com contexto próprio. Frontmatter obrigatório:

```yaml
---
name: agent-name
description: [Persona]. Use quando [gatilho preciso].
tools: ["read_file", "read_many_files", "grep_search", "glob", "list_directory", "write_file", "replace", "write_todos"]
- **Deve ser COMPLETO** — persona + workflow + nunca-faz + protocolo de escalamento
- **Sem ponteiros** — não escrever "use a skill X para detalhes"; incorporar o essencial inline
- **Ferramentas mínimas** — listar só as tools que o agente realmente precisa
- **Persona forte** — o agente deve ter uma voz e perspectiva clara

Corpo do `.md` deve conter:
- Identidade e papel
- Perguntas de discovery (se aplicável)
- Workflow passo-a-passo
- Protocolo de escalamento
- O que nunca fazer

## Formato: Path-Specific Instructions

```yaml
---
applyTo: "**/*.test.ts"
---

# Instruções para arquivos de teste TypeScript

[Convenções específicas para este tipo de arquivo]
```

## Quando Usar Cada Tipo

| Cenário | Tipo de instrução |
|---------|------------------|
| Convenções globais do projeto | `GEMINI.md` |
| Regras para um tipo de arquivo específico | Path-specific `.instructions.md` |
| Conhecimento de domínio reutilizável | `SKILL.md` |
| Persona com workflow completo | `.md` |

## Mapeamento de Tools por Tipo de Agente

Escope as tools ao mínimo necessário para o papel do agente. A arquitetura lean tem **3 super-agentes** (`principal`, `engine`, `creative`); novos agentes específicos de projeto são raros e devem se encaixar em um destes perfis:

| Perfil | Quando usar | Tools |
|---|---|---|
| **Estrategista (read + plan)** | Espelha `principal` — planeja, não executa | `read_file`, `read_many_files`, `grep_search`, `glob`, `list_directory`, `write_file`, `replace`, `write_todos`, `save_memory` |
| **Executor técnico** | Espelha `engine` — implementa código, infra, testes, segurança, performance, git | `read_file`, `read_many_files`, `grep_search`, `glob`, `list_directory`, `write_file`, `replace`, `run_shell_command`, `write_todos`, `web_fetch`, `save_memory` |
| **Executor de produto** | Espelha `creative` — UX, frontend, mobile, brand, copy, docs | `read_file`, `read_many_files`, `grep_search`, `glob`, `list_directory`, `write_file`, `replace`, `run_shell_command`, `write_todos`, `web_fetch`, `save_memory` |
| **Somente leitura** | Audit/review puro sem mutação | `read_file`, `read_many_files`, `grep_search`, `glob`, `list_directory`, `write_todos` |
| **Discovery interativo** | Setup de projeto novo, coleta de requisitos | `read_file`, `read_many_files`, `grep_search`, `glob`, `list_directory`, `write_file`, `replace`, `write_todos`, `ask_user` |

**Princípio:** se o agente novo cabe num super-agente existente, **não criar agente** — usar o super-agente. Criação de agente específico de projeto exige justificativa explícita (gap real no super-agente, contexto de domínio singular).

## Checklist de Qualidade

Para qualquer instrução criada:
- [ ] Frontmatter com `name` e `description` preenchidos
- [ ] Conteúdo em pt-BR (padrão deste repositório)
- [ ] Sem TODO ou placeholder vazio no conteúdo
- [ ] Instruções executáveis, não só conceituais
- [ ] Sem repetição de conteúdo já em outra instrução
- [ ] Tag `⚠️ EXPERIMENTAL` se ainda não validado em produção

## Passos

### 1. Identificar o escopo da instrução

Determinar onde a instrução deve atuar — usar `## Quando Usar Cada Tipo` como guia:
- Afeta todo repositório → `GEMINI.md`
- Afeta diretório específico → `.instructions.md`
- Capacidade reutilizável → `SKILL.md`
- Persona com fluxo → `.md`

### 2. Escrever o frontmatter YAML

Consultar o formato correspondente em `## Formato: SKILL.md` ou `## Formato: .md`.
Campos mínimos obrigatórios: `name`, `description`.

### 3. Estruturar o conteúdo

Para **Skills**: seguir as seções obrigatórias de `## Formato: SKILL.md`:
1. Quando Usar
2. Passos/Procedimento
3. Exemplos ou Templates
4. Checklist de validação

Para **Agents**: seguir as seções obrigatórias:
1. Persona
2. Metodologia
3. Protocolo de Escalamento
4. Fluxo de Trabalho
5. Nunca Faça

### 4. Validar com checklist

Completar o `## Checklist de Qualidade` abaixo antes de commitar.

### 5. Registrar no repositório

```bash
# Posicionar o arquivo no local correto
# Para agents e skills em um projeto:
agents/nome.md
skills/nome/SKILL.md
```

## Exemplos

### SKILL.md mínimo válido

```markdown
---
name: minha-skill
description: Use quando precisar [contexto de uso]. Fornece [o que entrega].
license: MIT
---

# Minha Skill

## Quando Usar

- Situação A que justifica uso
- Situação B que justifica uso

## Passos

### 1. Primeiro passo
Descrição acionável.

### 2. Segundo passo
Descrição acionável.

## Checklist de validação

- [ ] Critério 1
- [ ] Critério 2
```

### .md mínimo válido

```markdown
---
name: meu-agente
description: Papel do agente. Use quando precisar [contexto].
tools: ["read_file", "read_many_files", "grep_search", "glob", "list_directory", "write_file", "replace", "write_todos"]
---

# Meu Agente

## Persona

[1-3 linhas descrevendo a persona e princípio central]

## Metodologia

[Seções técnicas específicas do domínio]

## Protocolo de Escalamento

[Quando e como escalar]

## Fluxo de Trabalho

[Passos numerados]

## Nunca Faça

[Proibições explícitas]
```
