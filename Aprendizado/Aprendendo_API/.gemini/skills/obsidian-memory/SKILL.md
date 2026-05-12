---
name: obsidian-memory
description: "Use para ler ou escrever no vault Obsidian como memória cross-project apenas quando o contexto local for insuficiente ou houver valor real de continuidade."
triggers:
  - "ler/escrever no vault Obsidian"
  - "persistir conhecimento cross-project"
  - "recuperar contexto de sessões ou projetos anteriores"
license: MIT
---

# Obsidian Memory

Memória pessoal **cross-project** — não log de toda atividade. Invocada **sob demanda**, com critério.

## Pré-requisito

Vault path canônico deste ambiente, conforme `~/.gemini/GEMINI.md` na seção `## Memory`:

```
SEU_CAMINHO_DO_VAULT_OBSIDIAN
```

Se esse path mudar no arquivo global, esta skill deve refletir a mudança. Se não configurado ou inacessível: **graceful degradation** — continuar sem memória, não bloquear.

---

## Filosofia: Vault Enxuto > Vault Inflado

Um vault com 50 nós densos e bem linkados vale mais que um com 5.000 session logs descartáveis. A skill existe para **agregar valor** ao seu conhecimento de longo prazo, não para registrar tudo.

**Antes de escrever, pergunte:**
1. Esta informação tem valor **além desta tarefa**?
2. Atravessa **múltiplos projetos** ou é só deste repo?
3. Daqui a 6 meses, eu vou querer encontrar isso?

Se "não" para qualquer delas: **não escrever no vault**.

---

## Documentation Mirroring Rule (CRÍTICO)

> Documentação importante para o **projeto** vai para o **repositório** — nunca para o Obsidian.

| Tipo de informação | Local correto | Por quê |
|---|---|---|
| README, CONTRIBUTING, API docs | **Repo** (`README.md`, `docs/`) | Quem clona o repo precisa |
| ADRs / Tech Specs do projeto | **Repo** (`docs/decisions/`, `docs/adr/`) | Decisão pertence ao código |
| Runbooks operacionais, CHANGELOG | **Repo** | Equipe/CI usam |
| Onboarding de devs do projeto | **Repo** | Novo dev clona o repo, não tem o vault |
| Padrões aprendidos cross-project | **Obsidian** (`knowledge/patterns/`) | Atravessa repos |
| Preferências pessoais sobre stacks | **Obsidian** (`knowledge/preferences/`) | Pessoais e cross-project |
| Decisões cross-project (ex: "sempre uso Bun") | **Obsidian** (`knowledge/decisions/`) | Não pertence a um único repo |
| Session log de tarefa significativa | **Obsidian** (`sessions/`) | Memória de continuidade pessoal |

**Regra de ouro:** se a informação é útil para qualquer pessoa que clonar o repo → **repo**. Se só faz sentido para você lembrando entre projetos → **Obsidian**. **Sem duplicação.**

**Quando a sessão principal ou um agente identificar que está prestes a escrever doc de projeto no vault:** parar, redirecionar para o repo. Se realmente houver valor de descoberta cross-project, deixar nota mínima no vault apontando para o caminho no repo (não duplicar conteúdo).

---

## Read Protocol (Lazy)

**Não ler o vault por padrão.** Ler apenas se ao menos uma destas condições for verdadeira:

1. Contexto local (repo, código, conversa) é **insuficiente** para a tarefa
2. Trabalho em projeto **recorrente** que provavelmente tem contexto registrado
3. Decisão técnica precisa de **histórico** de decisões anteriores ou padrões aprendidos
4. Usuário **pede explicitamente** memória ("lembre o que fizemos em X", "qual foi a decisão sobre Y")

Se nenhuma condição se aplica: **não ler**. Trabalhar com o contexto disponível e seguir.

### Read — Hierarquia (parar quando suficiente)

Execute em ordem, parando assim que tiver contexto suficiente:

#### Etapa 1 — Preferências do usuário (quando relevante a decisões)

```bash
cat {VAULT_PATH}/knowledge/user-preferences.md  # MOC central de preferências
```

Carregar apenas se houver decisão prestes a ser tomada que poderia ser guiada por preferência prévia.

#### Etapa 2 — Contexto de projeto (se projeto recorrente)

```bash
ls {VAULT_PATH}/projects/{project-name}/ 2>/dev/null
cat {VAULT_PATH}/projects/{project-name}/context.md 2>/dev/null
```

Se a pasta não existir: pular. Não criar contexto de projeto sem motivo — a maior parte do contexto de projeto pertence ao **repo**, não ao vault.

#### Etapa 3 — Busca por palavra-chave (se tópico técnico específico)

```bash
grep -rl "{keyword}" {VAULT_PATH}/knowledge/ | head -5
```

Para cada resultado: ler frontmatter primeiro, carregar completo apenas se relevante.

#### Etapa 4 — Sessão recente (se for continuação explícita)

```bash
ls -t {VAULT_PATH}/sessions/ | head -3
```

Apenas se o usuário sinalizar continuação ou se a tarefa atual claramente prossegue trabalho anterior.

---

## Write Protocol (Alto Valor Apenas)

### Escrever apenas nestes momentos

| Evento | Onde | Quando |
|---|---|---|
| Preferência sua identificada (correção, regra explícita, "sempre faça X") | `knowledge/preferences/{slug}.md` | Imediato — não esquecer |
| Padrão técnico que se repete em múltiplos projetos | `knowledge/patterns/{slug}.md` | Quando reconhecer o padrão |
| Decisão técnica relevante além do projeto atual (ex: "sempre Bun", "evitar X em Y") | `knowledge/decisions/{slug}.md` | Quando decidir cross-project |
| Insight de stack que altera como uso uma tech | `knowledge/stacks/{tech}.md` | Quando descobrir |
| Sessão multi-fase ou de aprendizado significativo | `sessions/YYYY-MM-DD-{slug}.md` | **Uma vez** no final, condensado |

### Não escrever no vault

- Status updates intra-tarefa ("comecei a fazer X", "agente Y retornou")
- Plans de tarefa (use `plan.md` da sessão)
- Retornos individuais de sub-agentes
- Session log de tarefa trivial (se a tarefa não te ensinou nada novo, não loga)
- Documentação que pertence ao **repo** (ver Documentation Mirroring Rule)
- Código completo, diffs grandes, conteúdo de arquivos
- Arquivos compilados, gerados, de build

---

## Pre-Write Deduplication

**Obrigatório antes de criar `preference`, `pattern`, `stack-node` ou `decision` cross-project.**

```bash
# Buscar arquivos existentes sobre o mesmo tema
grep -rl "{keyword1}\|{keyword2}" {VAULT_PATH}/knowledge/ | head -5

# Para cada resultado, ler frontmatter
head -15 {arquivo-encontrado}
```

| Situação | Ação |
|---|---|
| Existe arquivo cobrindo o **mesmo tema** | **Atualizar** o existente — nunca criar duplicata |
| Existe arquivo **relacionado mas distinto** | Criar novo + WikiLink cruzado |
| Nenhum relacionado | Criar normalmente |

> Em dúvida: **atualizar é sempre mais seguro que criar**. Duplicatas fragmentam o grafo.

---

## WikiLink Protocol

Todo arquivo escrito DEVE conter WikiLinks para nós relacionados — é o que faz o vault virar grafo, não pasta de notas soltas.

### Sintaxe

```markdown
[[nome-do-arquivo-sem-extensao]]
```

Obsidian resolve pelo nome do arquivo, independente do diretório.

### Links mínimos por tipo

| Arquivo | Links obrigatórios |
|---|---|
| `sessions/` | Projeto envolvido, techs principais, preferências/decisões geradas |
| `knowledge/preferences/` | Tech relacionada, sessão de origem |
| `knowledge/patterns/` | Techs envolvidas, projetos onde ocorre |
| `knowledge/stacks/` | Padrões e preferências relacionados |
| `knowledge/decisions/` | Techs envolvidas, preferências relacionadas |

**Não linkar para arquivos que não existem.** Criar o nó de destino antes de linkar.

---

## Templates

### Session log (apenas tarefa significativa)

`sessions/YYYY-MM-DD-{slug}.md`

```yaml
---
type: session
status: completed
summary: "{uma linha — o que foi feito e o que mudou em conhecimento}"
tags: [{tags}]
date: YYYY-MM-DD
---
```

Conteúdo (curto, condensado):
- O que foi feito (1-3 linhas)
- Decisões/preferências/padrões gerados (com WikiLinks)
- Bloqueadores ou continuação pendente

### Preferência

`knowledge/preferences/{slug}.md`

```yaml
---
type: preference
status: active
summary: "Regra: {uma linha clara}"
tags: [{tech-or-domain}]
date: YYYY-MM-DD
origin-session: [[YYYY-MM-DD-slug]]
---
```

```markdown
# {Título}

## Regra
{O que SEMPRE ou NUNCA fazer — sem ambiguidade}

## Origem
{O que gerou — correção, decisão consciente, padrão observado}

## Relacionados
- [[stack-node]]
- [[pattern-relacionado]]
```

Após criar: adicionar `[[{slug}]]` em `knowledge/user-preferences.md` (MOC central).

### Padrão técnico

`knowledge/patterns/{slug}.md`

```yaml
---
type: pattern
status: active
summary: "{descrição em uma linha}"
tags: [{techs}]
date: YYYY-MM-DD
origin-session: [[YYYY-MM-DD-slug]]
---
```

### Decisão cross-project

`knowledge/decisions/{slug}.md`

```yaml
---
type: decision
status: active
summary: "{decisão em uma linha}"
tags: [{techs}]
date: YYYY-MM-DD
---
```

> Decisão **dentro** de um projeto vai para o **repo** (`docs/decisions/`), não aqui.

### Stack node

`knowledge/stacks/{tech}.md`

```yaml
---
type: stack-node
status: active
summary: "{tech} — versão, padrões, gotchas conhecidos"
tags: [{tech}]
date: YYYY-MM-DD
---
```

---

## Frontmatter Schema

```yaml
---
type: session | preference | pattern | decision | stack-node | moc
status: active | archived | completed
summary: "Uma linha — base para descoberta sem ler o arquivo inteiro"
tags: [tag1, tag2]
date: YYYY-MM-DD
origin-session: [[session-slug]]   # obrigatório em preference e pattern; opcional nos demais
---
```

---

## Graceful Degradation

Se qualquer operação falhar (vault inacessível, arquivo não encontrado, permissão negada):

1. Log: `obsidian-memory: [operação] falhou — [motivo]`
2. Continuar sem bloquear a tarefa
3. Nunca retornar erro fatal por falha de memória

Vault é apoio. Não bloqueia trabalho.
