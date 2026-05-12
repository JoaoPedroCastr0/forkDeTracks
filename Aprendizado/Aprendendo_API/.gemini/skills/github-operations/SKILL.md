---
name: github-operations
description: "Use para operar GitHub via CLI ou API: criar issues e PRs, gerenciar branches, labels e milestones, publicar releases e revisar workflows."
triggers:
  - "criar/gerenciar issues, PRs ou releases no GitHub"
  - "gerenciar branches, labels ou milestones"
  - "configurar ou executar GitHub Actions workflows"
license: MIT
---

# GitHub Operations

## Quando Usar

- Criar ou gerenciar issues e pull requests
- Criar releases e tags
- Gerenciar branches, labels e milestones
- Verificar status de workflows e CI
- Automatizar operações repetitivas no GitHub

## Operações Comuns

### Issues
```bash
# Criar issue
gh issue create --title "Título" --body "Descrição" --label "bug"

# Listar issues
gh issue list --state open --label "bug"

# Fechar issue
gh issue close <número>
```

### Pull Requests
```bash
# Criar PR
gh pr create --title "feat: descrição" --body "## O que muda\n..." --base main

# Verificar status de checks
gh pr checks <número>

# Aprovar PR
gh pr review <número> --approve

# Fazer merge
gh pr merge <número> --squash --delete-branch
```

### Releases
```bash
# Criar release com tag
gh release create v1.2.3 --title "Release 1.2.3" --notes "## Changelog\n..."

# Listar releases
gh release list
```

### Branches
```bash
# Criar e mudar para branch
git checkout -b feat/nome-da-feature

# Listar branches remotas
git branch -r

# Deletar branch remota (após merge)
git push origin --delete feat/nome-da-feature
```

### Workflows (GitHub Actions)
```bash
# Listar runs do workflow
gh run list --workflow ci.yml

# Ver logs de um run
gh run view <run-id> --log

# Re-rodar workflow falho
gh run rerun <run-id>
```

## Convenções de Nomenclatura

### Branches
```
feat/nome-descritivo
fix/nome-do-bug
chore/nome-da-tarefa
docs/nome-da-doc
```

### Commits (Conventional Commits)
```
feat: adiciona autenticação JWT
fix: corrige cálculo de desconto para produtos sem estoque
chore: atualiza dependências de segurança
docs: adiciona exemplos de uso da API
```

### Labels de Issue
```
bug         — comportamento incorreto
enhancement — melhoria de feature existente
feature     — nova funcionalidade
chore       — manutenção, dependências
security    — vulnerabilidade ou hardening
docs        — documentação
```

## Checklist antes de criar PR

- [ ] Branch atualizada com a base (main/develop)
- [ ] Commits com mensagens descritivas (Conventional Commits)
- [ ] CI passando localmente (`npm test`, `go test ./...`, etc.)
- [ ] Descrição do PR explica o quê, por quê e como testar
- [ ] Issue relacionada linkada (`Closes #123`)
- [ ] Sem commits de debug, console.log ou arquivos temporários

## Passos

### 1. Autenticar no GitHub CLI

```bash
gh auth login
gh auth status  # verificar autenticação
```

### 2. Identificar a operação necessária

Consultar `## Operações Comuns` para o comando exato:
- Issues: `gh issue create/list/view/close`
- PRs: `gh pr create/list/review/merge`
- Releases: `gh release create`
- Workflows: `gh workflow run/list/view`

### 3. Executar com convenções

Seguir `## Convenções de Nomenclatura` para branches, labels e títulos:
- Branch: `feat/descricao`, `fix/descricao`, `chore/descricao`
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- PR title: mesmo formato do commit

### 4. Criar PR com descrição completa

```bash
gh pr create   --title "feat: adicionar autenticação JWT"   --body "## O que muda
...
## Como testar
..."   --label "enhancement"   --assignee "@me"
```

### 5. Completar checklist antes do PR

Usar `## Checklist antes de criar PR` para garantir qualidade antes do review.

## Exemplos

### Criar issue com template

```bash
gh issue create   --title "bug: botão de login não responde no Safari"   --body "## Descrição
O botão de login não dispara o evento de submit no Safari 17.

## Reprodução
1. Abrir em Safari
2. Preencher credenciais
3. Clicar em Entrar

## Comportamento esperado
Usuário é autenticado

## Comportamento atual
Nada acontece"   --label "bug,priority:high"   --assignee "meu-usuario"
```

### Workflow de PR completo

```bash
# Criar branch
git checkout -b feat/autenticacao-jwt

# Trabalhar... commitar...
git commit -m "feat: implementar autenticação JWT com refresh token"

# Push e criar PR em um comando
gh pr create --fill --draft

# Quando pronto para review
gh pr ready

# Após aprovações, fazer merge
gh pr merge --squash --delete-branch
```
