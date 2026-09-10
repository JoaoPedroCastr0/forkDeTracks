# 🚀 Como Rodar o Projeto — Guia Prático e Explicativo

Este documento orienta como inicializar e executar todos os serviços da **Plataforma de Ensino de Programação** (Banco de Dados, API Backend e Frontend Web), explicando de maneira simples o **porquê de cada comando**.

---

## 📋 Pré-requisitos

1. **Docker Desktop**: Necessário para rodar o banco de dados PostgreSQL em um container isolado, sem precisar instalar o banco diretamente no seu sistema operacional.
2. **Bun**: O runtime e gerenciador de pacotes ultrarrápido utilizado tanto no backend quanto no frontend.

---

## 🐘 Passo 1: Subir o Banco de Dados (PostgreSQL via Docker)

Na raiz do workspace (`Aprendizado/consolidation`), abra o terminal e execute:

```bash
docker compose up -d
```

* **Por que usamos esse comando?**
  * O Docker lê o arquivo `docker-compose.yml` e cria o container do PostgreSQL 16 na porta `5555`.
  * A flag `-d` (*detached*) roda o container em segundo plano, liberando o terminal para outras tarefas.
  * Os dados ficam salvos em um volume persistente (`pgdata`), ou seja, você não perde seus dados ao reiniciar o computador.

---

## ⚙️ Passo 2: Inicializar o Backend (API Express)

Abra um terminal e acesse a pasta do backend:

```bash
cd Aprendizado/consolidation/Backend
```

Execute os comandos na sequência abaixo:

### 1. Instalar as dependências
```bash
bun install
```
* **Por que?** Baixa e organiza todas as bibliotecas necessárias declaradas no `package.json` (Express, Prisma, Better Auth, Zod, etc.) utilizando o cache veloz do Bun.

### 2. Aplicar as migrações do banco
```bash
bun x prisma migrate dev
```
* **Por que?** Lê o arquivo `prisma/schema.prisma` e cria/atualiza as tabelas reais dentro do banco PostgreSQL (tabelas de usuários, sessões, cursos, módulos, aulas, matrículas e progressos).
* **E o `prisma generate`?** O próprio comando `migrate dev` já executa o `prisma generate` automaticamente ao final! Você só precisa rodar `bun x prisma generate` manualmente se tiver acabado de clonar o projeto/dar `git pull` e o banco já estiver atualizado, ou se o TypeScript/editor perder o autocomplete dos modelos.

### 3. Popular o banco com dados iniciais (Seed)
```bash
bun run src/database/seed.ts
```
* **Por que?** Executa um script que cadastra o **Professor Alex** (administrador da plataforma conforme a regra RN02) com senha segura e insere cursos e aulas de exemplo para que o sistema não inicie vazio.

### 4. Ligar a API com Hot-Reload
```bash
bun run start:dev
```
* **Por que?** Inicia o servidor HTTP Express na porta `4000`. A flag `--hot` faz com que o servidor reinicie instantaneamente a cada alteração que você salvar no código, acelerando o desenvolvimento.

> 🟢 **Backend online:** [`http://localhost:4000`](http://localhost:4000)  
> * Teste de saúde: [`http://localhost:4000/health`](http://localhost:4000/health)

---

## 💻 Passo 3: Inicializar o Frontend (Interface Web Next.js)

Abra um **segundo terminal** e acesse a pasta do frontend:

```bash
cd Aprendizado/consolidation/Frontend
```

### 1. Instalar as dependências
```bash
bun install
```
* **Por que?** Instala os pacotes do ecossistema React, Next.js 15, Tailwind CSS e componentes shadcn/ui.

### 2. Iniciar o servidor web
```bash
bun run dev
```
* **Por que?** Compila as páginas em modo de desenvolvimento na porta `3000`, permitindo navegar pelo catálogo, fazer login, cadastrar-se e assistir às aulas em tempo real.

> 🌐 **Frontend online:** [`http://localhost:3000`](http://localhost:3000)

---

## 🔑 Credenciais para Acesso

| Perfil | E-mail | Senha | Finalidade |
| :--- | :--- | :--- | :--- |
| **Professor (Admin)** | `alex@ensino.com` | `Professor@123` | Gerenciar o catálogo, criar cursos, módulos e aulas. |
| **Aluno** | Auto-cadastro em [`/cadastro`](http://localhost:3000/cadastro) | Mínimo 8 caracteres | Ver catálogo, matricular-se nos cursos e concluir aulas. |

---

## 🛠️ Comandos Úteis do Dia a Dia

Todos os comandos abaixo devem ser executados na pasta `Aprendizado/consolidation/Backend`:

* **`bun run test`**:  
  * *Por que rodar?* Executa a bateria com os **17 testes ponta a ponta (E2E)**, validando saúde da API, autenticação, bloqueios de segurança (RBAC) e cálculo de progresso do aluno.
* **`bun run check`**:  
  * *Por que rodar?* Roda o linter e o formatador do **Biome**, garantindo código padronizado, limpo e sem uso de `any`.
* **`bunx --bun tsc --noEmit`**:  
  * *Por que rodar?* Faz a checagem estrita de tipos do **TypeScript** sem gerar arquivos, assegurando que não há erros de tipagem.
* **`bun run db:studio`**:  
  * *Por que rodar?* Abre uma interface gráfica no navegador pelo **Prisma Studio**, permitindo visualizar, filtrar e editar diretamente as linhas de qualquer tabela do banco de dados.

---

## 🏡 Parte 2: Como Rodar do Zero em Outra Máquina (Casa / Novo Setup)

Quando você for rodar esse projeto em outro computador após dar `git clone` ou `git pull` da nova branch, você estará com um **ambiente zerado** (sem banco de dados local, sem dependências instaladas e sem arquivos `.env`, que não sobem para o GitHub por segurança).

Siga este passo a passo sequencial para ter tudo funcionando em poucos minutos:

### 1. Obter os arquivos da branch atualizada
No terminal da sua máquina de casa:
```bash
git fetch origin
git checkout <nome-da-sua-branch>
git pull origin <nome-da-sua-branch>
```

### 2. Configurar os arquivos de variáveis de ambiente (`.env`)
Como arquivos `.env` contêm segredos e estão no `.gitignore`, você deve criá-los na sua máquina local a partir dos exemplos:

* **No Backend (`Aprendizado/consolidation/Backend`):**
  Copie o arquivo de exemplo:
  ```bash
  # No Windows PowerShell:
  Copy-Item .env.example .env
  # No Linux / Mac:
  cp .env.example .env
  ```
  *(O arquivo `.env` já vem pré-configurado com a porta 4000 e a URL do PostgreSQL local `localhost:5555`).*

* **No Frontend (`Aprendizado/consolidation/Frontend`):**
  Crie o arquivo `.env.local`:
  ```bash
  # Crie o arquivo .env.local com o seguinte conteúdo:
  NEXT_PUBLIC_API_URL=http://localhost:4000
  ```

### 3. Subir o Banco de Dados no Docker
Certifique-se de que o **Docker Desktop** está aberto e rodando.  
Na pasta `Aprendizado/consolidation`, execute:
```bash
docker compose up -d
```
> Isso criará o container `postgres-ensino` zerado na porta `5555`.

### 4. Inicializar e Popular o Backend
No terminal, entre na pasta do backend:
```bash
cd Aprendizado/consolidation/Backend

# 1. Instala dependências (Express, Prisma, Better Auth, etc.)
bun install

# 2. Executa as migrações para criar as tabelas no PostgreSQL zerado
bun x prisma migrate dev

# 3. Executa o seed para cadastrar o Professor Alex e cursos iniciais
bun run src/database/seed.ts
```

### 5. Instalar dependências do Frontend
Abra um segundo terminal e acesse a pasta do frontend:
```bash
cd Aprendizado/consolidation/Frontend

bun install
```

### 6. Subir a Aplicação e Validar

1. **Terminal 1 (Backend):**
   ```bash
   cd Aprendizado/consolidation/Backend
   bun run start:dev
   ```
   > API disponível em: `http://localhost:4000`

2. **Terminal 2 (Frontend):**
   ```bash
   cd Aprendizado/consolidation/Frontend
   bun run dev
   ```
   > Web app disponível em: `http://localhost:3000`

3. **Validação Instantânea (Terminal 3):**
   Para ter certeza de que todo o ecossistema (banco, auth e regras) está funcionando perfeitamente:
   ```bash
   cd Aprendizado/consolidation/Backend
   bun run test
   ```
   > Se todos os **17 testes passarem com sucesso**, sua máquina de casa está 100% configurada e pronta para o desenvolvimento!

---

### 🚨 Guia Rápido de Solução de Problemas (Troubleshooting)

* **Erro `ECONNREFUSED` ao rodar o backend ou testes:**  
  * *Causa:* O Docker Desktop não foi iniciado ou o container do banco caiu.  
  * *Solução:* Abra o Docker Desktop e execute `docker compose up -d` na raiz do projeto.
* **Erro de tipagem do Prisma ou modelo não encontrado:**  
  * *Causa:* O Prisma Client não foi compilado no `node_modules` local.  
  * *Solução:* Execute `bun x prisma generate` na pasta `Backend`.
* **Porta 4000 ou 3000 já em uso:**  
  * *Causa:* Um processo anterior do Node/Bun ficou preso em segundo plano.  
  * *Solução:* Finalize a tarefa no Gerenciador de Tarefas ou altere temporariamente a porta no `.env`.
