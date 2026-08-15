# 🚀 Plano de Aula Didático: Do Zero ao Colaborador Git & GitHub

> **Público-Alvo:** Estudantes iniciantes em programação.  
> **Objetivo:** Compreender a necessidade do controle de versão, dominar o fluxo de trabalho individual e colaborativo, e absorver boas práticas de mercado desde o primeiro dia.

---

## 📌 1. Varredura e Mapeamento do Material de Estudo

Realizamos uma análise completa da estrutura existente no diretório [`git`](file:///C:/Users/Usu%C3%A1rio/Desktop/forkDeTracks/forkDeTracks/Aprendizado/git) para organizar esta aula em uma jornada de aprendizado progressiva:

```
git/
├── Fluxo_git.md                     # Visão geral do ciclo de vida de uma feature
├── Sobrevivente_nivel1/              # Nível 1: Fundamentos, Git local e SSH
│   ├── README.md
│   ├── Resumo.md
│   └── notesSSH.md
├── Colaborador_nivel2/               # Nível 2: Branches, Fork e Pull Requests
│   ├── README.md
│   ├── Comandos.md
│   ├── Fork.md
│   └── branchModels.md
└── Facilitador_nivel3/               # Nível 3: Boas práticas avançadas, CI/CD e Governança
    ├── README.md
    ├── Comandos.md
    ├── Issues.md
    ├── WorkflowsDeCI.md
    └── conventionalCommits.md
```

---

## 🎓 2. Estrutura Modular da Aula

---

### 🛡️ Módulo 1: O "Sobrevivente" (Fundamentos de Git e Repositório Local)
*Baseado no material de [`Sobrevivente_nivel1`](file:///C:/Users/Usu%C3%A1rio/Desktop/forkDeTracks/forkDeTracks/Aprendizado/git/Sobrevivente_nivel1/README.md)*

#### 🎯 Conceito Chave & Analogia
- **O que é o Git?** É o seu "Save Point" de videogame. Em vez de salvar `projeto_v1`, `projeto_final_mesmo`, o Git registra o histórico exato do código ao longo do tempo.
- **O que é o GitHub?** É a nuvem onde seus "saves" ficam guardados e compartilhados com o time.

#### 🗝️ Autenticação Segura (SSH)
*Detalhado em [`notesSSH.md`](file:///C:/Users/Usu%C3%A1rio/Desktop/forkDeTracks/forkDeTracks/Aprendizado/git/Sobrevivente_nivel1/notesSSH.md)*
1. Gerar chave SSH: `ssh-keygen -t ed25519 -C "seu@email.com"`
2. Iniciar agente: `eval "$(ssh-agent -s)"` e adicionar chave: `ssh-add ~/.ssh/id_ed25519`
3. Testar conexão com GitHub: `ssh-T git@github.com`

#### 🔄 Ciclo de Vida do Código (Instantâneo Local)
1. **Iniciar Repositório:** `git init`
2. **Conectar ao GitHub:** `git remote add origin <URL_DO_REPOSITORIO>`
3. **Verificar Estado:** `git status` (mostra o que mudou)
4. **Analisar Alterações:** `git diff` (linhas adicionadas/removidas)
5. **Preparar para o Save (Staging):** `git add .`
6. **Criar o Save Point (Commit):** `git commit -m "mensagem descritiva"`
7. **Primeiro Push (Vínculo de Upstream):**  
   ```bash
   git push --set-upstream origin main
   ```
   > 💡 **Por que o 1º push é diferente?** Ele estabelece a relação direta de rastreamento entre sua branch local (`main`) e a remota (`origin/main`). Nas próximas vezes, basta usar `git push` ou `git pull`.

---

### 🤝 Módulo 2: O "Colaborador" (Trabalho em Equipe, Branches & PRs)
*Baseado no material de [`Colaborador_nivel2`](file:///C:/Users/Usu%C3%A1rio/Desktop/forkDeTracks/forkDeTracks/Aprendizado/git/Colaborador_nivel2/README.md)*

#### 🌳 Isolamento com Branches (`branchModels.md`)
- **`main`**: Branch principal, mantida **sempre estável** e pronta para produção.
- **`feature/nome-da-feature`**: Branch isolada para desenvolver uma única funcionalidade sem afetar o código principal.

#### 🛠️ Fluxo de Trabalho Recomendado (`Comandos.md`)
```bash
# 1. Ir para a main e atualizar antes de iniciar qualquer trabalho
git checkout main
git pull origin main

# 2. Criar e mudar para a nova branch de funcionalidade
git checkout -b feature/minha-nova-tela

# 3. Fazer o trabalho, adicionar e commitar
git add .
git commit -m "feat: adiciona formulario de login"

# 4. Enviar a branch para o repositório remoto
git push -u origin feature/minha-nova-tela
```

#### 🔀 Fork vs Branch Direta (`Fork.md`)
- **Branch no próprio repo:** Utilizado quando você faz parte do time com permissão de escrita.
- **Fork:** Uma cópia completa do repositório para a sua conta pessoal. Utilizado em projetos Open Source ou quando você não tem permissão direta no repositório original.

#### 📋 Pull Request (PR) e Code Review
- Ao subir a branch, você abre um **Pull Request** no GitHub pedindo para unir sua branch com a `main`.
- Um colega revisa o código, faz comentários/sugestões e aprova antes do Merge.

---

### ⚡ Módulo 3: O "Facilitador" (Qualidade, Rebase, CI/CD e Governança)
*Baseado no material de [`Facilitador_nivel3`](file:///C:/Users/Usu%C3%A1rio/Desktop/forkDeTracks/forkDeTracks/Aprendizado/git/Facilitador_nivel3/README.md)*

#### 📝 Conventional Commits (`conventionalCommits.md`)
Padronização de mensagens de commit para facilitar a leitura e automação de changelogs:
- `feat:` Nova funcionalidade (`feat: adiciona botao de filtro`)
- `fix:` Correção de bug (`fix: corrige calculo de desconto`)
- `docs:` Documentação (`docs: atualiza guia de instalacao no README`)
- `refactor:` Melhoria de código sem alterar regra de negócio
- `chore:` Tarefas de manutenção e configurações (`chore: atualiza dependencias`)
- `test:` Adição ou ajuste de testes

#### 🔀 Merge vs Rebase (`Comandos.md`)
| Estratégia | O que faz? | Histórico | Quando usar? |
| :--- | :--- | :--- | :--- |
| **`git merge`** | Junta as branches criando um commit de merge. | Histórico real / não-linear. | Para integrar branches finalizadas na `main`. |
| **`git rebase`** | Re-aplica seus commits no topo da branch base. | Histórico limpo / linear. | Para atualizar sua branch local com as novidades da `main`. |

> ⚠️ **REGRA DE OURO DO REBASE:** Nunca faça rebase em branches compartilhadas ou públicas! Faça apenas em branches locais/privadas.

#### 📌 GitHub Issues & Kanban (`Issues.md`)
- **Issue:** Registro oficial no GitHub para relatar um bug, propor uma ideia ou mapear uma tarefa.
- **GitHub Projects (Kanban):** Painel visual (*To Do*, *In Progress*, *Done*) para gerenciar a saúde e prioridade das entregas do time.

#### ⚙️ Workflows de CI/CD (GitHub Actions) (`WorkflowsDeCI.md`)
- **CI (Continuous Integration):** Automação ativada em Pushes e PRs para validar o código via scripts (ex: `eslint`, testes automatizados).
- Garante que a branch `main` nunca quebre por erro humano.

---

## 💻 3. Exercício Guiado (Passo a Passo Prático)

Para fixar a aula, vamos simular a entrega de uma funcionalidade em equipe:

1. **Atualize seu ambiente local:**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Crie sua branch de trabalho:**
   ```bash
   git checkout -b feature/adicionar-card-aluno
   ```
3. **Faça uma alteração de código** (ex: adicione seu nome em um arquivo `alunos.md`).
4. **Verifique o status e faça o commit com padronização:**
   ```bash
   git status
   git add .
   git commit -m "feat: adiciona perfil do aluno na lista de apresentacao"
   ```
5. **Envie para o GitHub e abra o Pull Request:**
   ```bash
   git push -u origin feature/adicionar-card-aluno
   ```
6. **No GitHub:** Solicite a revisão de um colega, responda aos comentários se houver, e faça o Merge após a aprovação!

---

## 🎯 4. Checklist de Maturidade Profissional em Git

- [ ] Sempre faço `git pull` na `main` antes de criar uma nova branch.
- [ ] Escrevo mensagens de commit claras usando Conventional Commits (`feat`, `fix`, etc.).
- [ ] Trabalho isolado em `feature branches`, nunca commitando direto na `main`.
- [ ] Abro Pull Requests com descrições explicativas e reviso o código do meu time.
- [ ] NUNCA faço `git rebase` em branches compartilhadas com outros desenvolvedores.
- [ ] Respeito a execução do CI (GitHub Actions) antes de aprovar e integrar um código.
