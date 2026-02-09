# Nível 2 — Colaborador (Trabalho em Equipe)

## Objetivo
- Colaborar em projetos do Lab com práticas de workflow saudáveis e previsíveis.

## Tópicos principais
- Branching model: feature branches vs `main`.
- Criar branch de feature: `git checkout -b feature/nome-da-feature`.
- Fork + Pull Request workflow (quando contribuir em repositórios externos).
- Sincronização: `git fetch`, `git pull --rebase` e `git rebase` para manter a branch atualizada.
- Resolução de conflitos: usar `git mergetool` ou resolver manualmente e commitar.

## Boas práticas
- Não commitar direto em `main`.
- Commits pequenos e atômicos; mensagens claras (ver Conventional Commits no Nível 3).
- Abrir PRs com descrição do que foi feito, como testar e possíveis impactos.

## Exercício mínimo
- Fazer fork (se aplicável), criar uma branch de feature, implementar uma
  alteração mínima no Website Institucional e abrir um Pull Request.
- Iterar no PR a partir de comentários de review: ajustar código, rebase/merge
  conforme a política do repositório e atualizar o PR.

## Comandos úteis
- `git checkout -b feature/minha-feature`
- `git add . && git commit -m "feat: adicionar X"`
- `git fetch origin`
- `git pull --rebase origin main`
- `git rebase origin/main`
- `git mergetool` (quando configurado)

## Checklist de conclusão
- [x] Branch criada e push para remote
- [x] Pull Request aberto com descrição e checklist
- [x] Feedback incorporado no PR
- [x] PR mergeado ou fechado com justificativa

## Recursos
- Guia de Pull Requests: https://docs.github.com/en/pull-requests
- Resolução de conflitos: https://git-scm.com/docs/git-mergetool
