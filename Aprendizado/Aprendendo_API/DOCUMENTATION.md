# 📘 Documentação Técnica: Sistema de Gerenciamento de Tarefas

Esta documentação detalha a arquitetura, as tecnologias e os fluxos do projeto, servindo como guia para desenvolvedores que desejam entender, manter ou evoluir o sistema.

---

## 🧠 Parte 1: Visão Geral da Arquitetura

O projeto utiliza uma arquitetura **Fullstack moderna baseada em camadas (Layered Architecture)** no backend e uma abordagem **orientada a funcionalidades (Feature-based Architecture)** no frontend.

### Stack Tecnológica
- **Backend**: [Node.js](https://nodejs.org/) com runtime [Bun](https://bun.sh/) e framework [Express](https://expressjs.com/).
- **Frontend**: [React](https://react.dev/) com [Vite](https://vitejs.dev/) e [TypeScript](https://www.typescriptlang.org/).
- **Autenticação**: [Better Auth](https://www.better-auth.com/) (gerenciamento de sessões, usuários e contas).
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) com ORM [Prisma](https://www.prisma.io/).
- **Estilização**: CSS Vanilla (seguindo boas práticas de design moderno).

### Organização de Pastas
```text
/
├── prisma/               # Configurações e esquemas do banco de dados
├── src/                  # Código fonte do Backend
│   ├── auth/             # Configuração do Better Auth (Server)
│   ├── controllers/      # Lógica de entrada e resposta das rotas
│   ├── services/         # Regras de negócio
│   ├── repository/       # Comunicação direta com o Prisma (Acesso a dados)
│   ├── middlewares/      # Interceptores (Auth, Erros, Validação)
│   ├── routes/           # Definição dos endpoints
│   ├── schemas/          # Validação de dados com Zod
│   └── server.ts         # Ponto de entrada do servidor
├── frontend/             # Código fonte do Frontend (React)
│   ├── src/
│   │   ├── features/     # Módulos isolados por funcionalidade (auth, tasks)
│   │   ├── shared/       # Componentes, hooks e serviços globais
│   │   ├── routes/       # Configuração de rotas do React Router
│   │   └── App.tsx       # Componente raiz
└── DOCUMENTATION.md      # Esta documentação
```

---

## ⚙️ Parte 2: Backend (API)

O backend segue o padrão de responsabilidade única através de camadas bem definidas.

### Camadas e Responsabilidades
1.  **Routes**: Mapeia os endpoints HTTP para os controllers específicos.
2.  **Controllers**: Recebe a requisição, extrai os dados e delega para o Service. É responsável pelo status code da resposta.
3.  **Services**: Onde reside a inteligência do sistema. Valida regras de negócio e chama o Repository.
4.  **Repositories**: Abstrai as operações do Prisma. Se o banco mudar, apenas esta camada é alterada.
5.  **Middlewares**: Processamentos transversais, como verificação de token e tratamento global de erros.

### Fluxo de Requisição
O caminho de uma requisição autenticada (ex: Criar Tarefa) é:
`request` → `route` → `authMiddleware` → `validateMiddleware` → `taskController` → `taskService` → `taskRepository` → `Database (Prisma)` → `response`

### Autenticação (Better Auth)
Utilizamos o **Better Auth** para uma gestão de identidade robusta.
- **Login**: Ocorre via endpoints gerados automaticamente em `/api/auth`.
- **Sessão**: O backend utiliza o `auth.api.getSession` dentro do `authMiddleware` para validar o usuário através dos headers/cookies da requisição.
- **Segurança**: As senhas são tratadas internamente pelo Better Auth, e as sessões são persistidas no banco de dados.

### Banco de Dados
O Prisma gerencia os modelos e migrações.
- **Modelos Principais**:
    - `User`: Armazena dados do usuário e credenciais.
    - `Task`: Relacionado ao `User` (1:N). Possui `title`, `description` e `createdAt`.
    - `Session / Account`: Tabelas de suporte ao Better Auth.

---

## 🌐 Parte 3: Frontend (React)

O frontend é construído para ser modular e escalável.

### Estrutura de Funcionalidades (`features/`)
Cada funcionalidade (como `tasks`) contém seus próprios componentes, páginas e lógica, evitando que o projeto se torne uma "bagunça" de arquivos globais.

### Consumo da API
- **Axios**: Centralizado em `shared/services/api.ts`. Configurado com `withCredentials: true` para suportar sessões baseadas em cookies.
- **Better Auth Client**: Em `shared/services/authClient.ts`, configuramos o cliente React que facilita o login e a verificação de sessão no lado do cliente.

### Autenticação no Frontend
- **Estado**: O usuário permanece logado enquanto houver uma sessão válida no banco de dados, reconhecida pelo Better Auth.
- **Rotas Protegidas**: Implementadas via componentes de alta ordem ou hooks que verificam a existência de um `user` no contexto antes de renderizar a página.

---

## 🔗 Parte 4: Integração Frontend ↔ Backend

A comunicação é feita via **REST API** com formato **JSON**.

### Exemplo: Fluxo de Login
1.  **React**: Chama `authClient.signIn.email({ email, password })`.
2.  **Request**: `POST /api/auth/login` enviando as credenciais.
3.  **Backend**: Better Auth valida, cria uma sessão no banco e retorna um cookie/token.
4.  **React**: Recebe o sucesso e redireciona o usuário para `/dashboard`.

### Exemplo: Fluxo de Requisição Autenticada (Listar Tarefas)
1.  **React**: Faz `api.get('/tasks')`.
2.  **Headers**: O Axios envia automaticamente os cookies da sessão.
3.  **Backend**: `authMiddleware` intercepta, valida no banco e injeta o `req.user`.
4.  **Backend**: Retorna array de tarefas em JSON.

---

## 🔁 Parte 5: Fluxos Principais

### Cadastro e Login
- O usuário se registra fornecendo nome, email e senha.
- Após o login bem-sucedido, o `authClient` do frontend mantém as informações do usuário atualizadas.

### CRUD de Tarefas
- **Criação**: O frontend envia `title` e `description`. O backend associa automaticamente ao `userId` extraído da sessão.
- **Listagem**: Filtra tarefas pertencentes apenas ao usuário logado.
- **Exclusão/Edição**: Valida se o ID da tarefa pertence ao usuário antes de realizar a operação.

---

## 🧪 Parte 6: Como Rodar o Projeto

### Pré-requisitos
- Bun instalado.
- PostgreSQL rodando localmente ou via Docker.

### Passo a Passo
1.  **Clone o repositório** e entre na pasta.
2.  **Configurar Variáveis de Ambiente**:
    - Crie um arquivo `.env` na raiz (use `.env.example` como base).
    - Configure `DATABASE_URL` e `BETTER_AUTH_SECRET`.
3.  **Instalar Dependências**:
    ```bash
    bun install
    cd frontend && bun install
    ```
4.  **Preparar o Banco de Dados**:
    ```bash
    bun prisma migrate dev
    ```
5.  **Iniciar o Projeto**:
    - No terminal da raiz (Backend): `bun run dev`
    - No terminal da pasta frontend (Frontend): `bun run dev`

---

## 📌 Parte 7: Boas Práticas e Melhorias

### O que já está bom:
- **Separação de Preocupações**: O uso de Services e Repositories facilita testes unitários.
- **Validação**: Uso de Zod garante que dados inválidos nem cheguem à regra de negócio.
- **Type Safety**: TypeScript de ponta a ponta.

### Sugestões de Melhoria:
1.  **Cache**: Implementar Redis para as sessões do Better Auth em escala.
2.  **Frontend State**: Utilizar `React Query` ou `SWR` para gerenciar o cache das tarefas no frontend, melhorando a percepção de performance.
3.  **Testes**: Adicionar testes de integração (Supertest no backend) e E2E (Playwright no frontend).
4.  **Dockerização**: Criar um `docker-compose.yml` para subir o PostgreSQL e a aplicação com um único comando.

---

**Desenvolvido por Antigravity AI.**
