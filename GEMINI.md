# Regras Locais do Projeto — Plataforma de Ensino de Programação

> **Repositório:** `forkDeTracks`  
> **Workspace Principal:** `Aprendizado/consolidation`  
> **Cofre SSoT (Obsidian):** `C:\Users\234853299\Desktop\Cofre_consolidation`  

---

## 1. Contexto e Stack Canônica

* **Domínio:** Plataforma de Ensino de Programação com cursos, trilhas, aulas, matrículas e progresso.
* **Backend:** `Aprendizado/consolidation/Backend` (Bun, Express 5, TypeScript strict, Prisma 7, PostgreSQL, Zod, Better Auth).
* **Frontend:** `Aprendizado/consolidation/Frontend` (Next.js 15 App Router, React 19, Tailwind CSS, shadcn/ui, Better Auth Client).
* **Banco de Dados:** PostgreSQL rodando via Docker (`localhost:5555`).

### Comandos Canônicos

* **Backend:**
  - `lint`: `bun run lint`
  - `typecheck`: `bunx --bun tsc --noEmit`
  - `format`: `bun run format`
  - `check`: `bun run check`
  - `dev`: `bun run start:dev`
  - `migrate`: `bun x prisma migrate dev`
  - `generate`: `bun x prisma generate`
  - `seed`: `bun run src/database/seed.ts`

* **Frontend:**
  - `typecheck`: `bunx --bun tsc --noEmit`
  - `build`: `bun run build`
  - `dev`: `bun run dev`

---

## 2. Invariantes de Negócio e Segurança

### Regra RN02 — Professor Único e Administrador da Plataforma (Proibição Total de Cadastro de Professor)
* O professor Alex (`alex@ensino.com` / `prof_alex`) é o proprietário e único administrador dos cursos. Ele é pré-existente no banco e garantido via seed (`src/database/seed.ts`).
* **NÃO EXISTE CADASTRO DE PROFESSOR EM NENHUMA HIPÓTESE.**
* Nenhuma tela de cadastro, formulário, seletor de perfil, rota ou endpoint aceita criar conta com perfil de professor.
* A tela de login é universal e direta: não possui seleção de perfil ("Sou Aluno" / "Sou Professor"). O sistema identifica o perfil automaticamente a partir da sessão ativa.
* Todo e qualquer auto-cadastro na aplicação é estritamente de perfil `ALUNO` (garantido no Better Auth via `papel.input = false` e `defaultValue = 'ALUNO'`).
* **Padrão de Senhas Seguras:** O tamanho mínimo de senha é padronizado em **8 caracteres** em todas as camadas (validação de borda Zod, Better Auth e formulário do Frontend).

### Regra ADR 005 — Encadeamento Seguro de Dados (Borda ao Banco)
**Toda e qualquer rota presente e futura deve obedecer aos 5 elos inquebráveis:**

1. **Borda HTTP:** `req.body`, `req.params` ou `req.query` obrigatoriamente filtrados pelo middleware `validate({ ... })` com schemas estritos do Zod.
2. **Controller:** Extração explícita do objeto tipado: `const dados = req.body as DTO;`. Proibido desestruturar variáveis soltas sem proveniência rastreável.
3. **Service:** Validações de domínio, unicidade e autorização consumindo as propriedades de seu contêiner de origem (`dados.campo`).
4. **Repository:** Mapeamento explícito propriedade por propriedade no bloco `data: { coluna: dados.campo }`. **Proibição absoluta de blind spreads (`...dados` ou `...req.body`).**
5. **Persistência / Banco:** O banco **NUNCA** conversa com SQL montado manualmente. Toda escrita e consulta ocorre estritamente via métodos tipados do Prisma Client (`create`, `update`, `findUnique`, `findMany`), que compilam em Prepared Statements parametrizados (`$1`, `$2`).

### Regra ADR 006 — Controle de Acesso Baseado em Papéis (RBAC Obrigatório)
* Rotas com privilégios administrativos ou de mutação de catálogo (`POST /cursos`, `PUT /cursos/:id`, `DELETE /cursos/:id`) devem conter obrigatoriamente o encadeamento: `authMiddleware, requireRole('PROFESSOR')`.
* Usuários autenticados com papel `ALUNO` que tentarem acessar rotas restritas ao `PROFESSOR` são imediatamente bloqueados na borda com `403 Forbidden` (`"Acesso negado: seu perfil não possui permissão para executar esta ação"`).

### Regra ADR 007 — Padronização de Tratamento de Erros e Sanitização de Diagnósticos
* **Proibição de Vazamento de Diagnósticos Técnicos:** Nenhum stack trace, código interno de exceção, query SQL ou nome de constraint de banco de dados pode ser devolvido na resposta HTTP para o cliente (OWASP A05:2021).
* **Camada de Erros Operacionais:** O `Backend/src/utils/AppError.ts` e a função centralizada `tratarErro.ts` regem todas as respostas de falha.
* Erros 500 ou não previstos devem ser capturados, logados no console com detalhamento técnico completo e devolvidos ao cliente com uma mensagem amigável e segura: `"Não foi possível completar a operação no momento. Por favor, tente novamente mais tarde."`.

---

## 3. Idioma e Convenções

* **Linguagem Ubíqua do Domínio:** Entidades e modelos em Português (`Curso`, `Aula`, `Trilha`, `Matricula`, `Progresso`, `Usuario`).
* **Código e Identificadores Técnicos:** Arquitetura e comandos canônicos em padrão internacional.
* **Documentação Viva:** Toda nova decisão, mudança arquitetural ou regra deve ser sincronizada ao cofre Obsidian em `C:\Users\234853299\Desktop\Cofre_consolidation`.
