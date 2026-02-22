# Nível 1 — Sobrevivente (Fundamentos Individuais)

## Objetivo
- Dominar o ciclo de trabalho local com Git e publicar o repositório inicial no GitHub.

## Pré-requisitos
- Acesso a uma máquina com Git instalado.
- Conta no GitHub.
- Editor de texto (VS Code, nano, vim, etc.).

## Duração sugerida
- 4 a 8 horas distribuídas em 1–2 dias ou em blocos curtos ao longo de uma semana.

## Plano de estudos (passo a passo)

1. Entenda a diferença: Git vs GitHub
- Conceito: Git = sistema de controle de versão distribuído; GitHub = serviço remoto que hospeda repositórios Git e prove recursos colaborativos.
- Exercício: ler a página “What is Git?” e criar um esquema rápido (README) explicando em suas palavras.

2. Configurar identidade local
- Comandos:
    - `git config --global user.name "Seu Nome"`
    - `git config --global user.email "seu@email.com"`
    - Verificar: `git config --list`
- Exercício: confirmar que os valores aparecem corretamente.

3. Gerar par SSH e configurar no GitHub
- Gerar chave (recomendado ed25519):
    - `ssh-keygen -t ed25519 -C "seu@email.com"`
    - Iniciar agente: `eval "$(ssh-agent -s)"`
    - Adicionar chave: `ssh-add ~/.ssh/id_ed25519`
    - Copiar pública: `cat ~/.ssh/id_ed25519.pub`
- Adicionar chave no GitHub: Settings → SSH and GPG keys → New SSH key (colar conteúdo).
- Verificar conexão:
    - `ssh -T git@github.com` (deve receber mensagem de boas-vindas)
- Observação: se usar HTTPS, troque o remote por `https://...` e esteja pronto a usar token pessoal.

4. Ciclo local básico (init, add, commit)
- Inicializar repositório:
    - `mkdir meu-repositorio && cd meu-repositorio`
    - `git init`
- Fluxo mínimo:
    - Criar arquivo: `echo "# Meu Repositório" > README.md`
    - `git add README.md`
    - `git commit -m "chore: iniciar repositório de estudos"`
- Boas práticas de mensagem: verbo no imperativo, escopo opcional, breve e claro.

5. Ferramentas de inspeção (status, log, diff)
- `git status` — ver estado atual (arquivos staged/unstaged).
- `git log --oneline --graph --decorate --all` — visão compacta do histórico.
- `git diff` — ver mudanças não staged.
- Exercício: alterar README, rodar `git status`, `git diff`, fazer commit.

6. Criar remote e publicar (push)
- Adicionar remote:
    - `git remote add origin git@github.com:usuario/meu-repositorio.git`
    - (ou HTTPS) `git remote add origin https://github.com/usuario/meu-repositorio.git`
- Assegurar branch principal:
    - `git branch -M main`
- Enviar:
    - `git push -u origin main`
- Troubleshooting:
    - Se erro de autenticação, revisar SSH key ou token.
    - Se branch remoto existir, usar `git pull --rebase` antes do push.

## Exercício mínimo (prático)
- Criar repositório de estudos e publicar 5 commits descritivos:
    1. commit inicial: README
    2. adicionar arquivo de notas: `notes.md`
    3. editar notes com resumo sobre `git status` e `git diff`
    4. adicionar seção sobre SSH config
    5. documentação final com checklist de comandos
- Para cada commit: usar mensagens claras e explicar no corpo do commit (quando necessário) o que foi aprendido.

## Checklist de conclusão
- [ x ] Identity configurada (`git config --list`)
- [ x ] Chave SSH criada e validada (`ssh -T git@github.com`)
- [ x ] Repositório local inicializado com 5 commits
- [ x ] Repositório publicado no GitHub (`git push -u origin main`)
- [ x ] README com um breve relatório do que foi aprendido

## Verificação rápida (comandos sugeridos)
- `git --version`
- `git config --list`
- `ssh -T git@github.com`
- `git log --oneline`
- `git remote -v`

## Sugestões de aprofundamento (próximos passos)
- Aprender branching simples: criar `feature/*` e mesclar em `main`.
- Praticar `git restore` e `git restore --staged`.
- Ler sobre rebase vs merge (prévia antes do Nível 2).

## Recursos
- Pro Git (capítulos iniciais): https://git-scm.com/book/pt-br/v2
- Documentação Git: https://git-scm.com/docs
- GitHub SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## Avaliação (opcional)
- Peça para um colega revisar seu repositório de estudos.
- Submeta um link (ou abrir Issue no repositório raiz) com o relatório final e o link para o repositório publicado.
