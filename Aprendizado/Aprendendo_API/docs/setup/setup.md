🚀 Backend API

Bun + Express 5 + TypeScript + ESLint + Zod

📌 Stack Utilizada

⚡ Bun

🚀 Express 5

🧠 TypeScript

🛡 Zod

🧹 ESLint

📦 ESM ("type": "module")

🧱 1️⃣ Criar o Projeto do Zero
🔹 Criar pasta
mkdir backend
cd backend
🔹 Inicializar projeto com Bun
bun init

Responda as perguntas ou aceite padrão.

📦 2️⃣ Configurar package.json

Substituir pelo modelo padrão:

{
  "name": "backend",
  "module": "index.ts",
  "type": "module",
  "private": true,
  "scripts": {
    "start:dev": "bun --hot src/server.ts",
    "lint": "eslint ."
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/bun": "latest",
    "@types/express": "^5.0.6",
    "eslint": "^10.0.2",
    "typescript": "^5"
  },
  "dependencies": {
    "express": "^5.2.1",
    "zod": "^4.3.6"
  }
}
📥 3️⃣ Instalar Dependências
bun install

Caso ainda não tenha editado o package.json:

bun add express zod
bun add -d typescript eslint @eslint/js @types/express @types/bun
🧠 4️⃣ Criar Estrutura de Pastas
mkdir src
mkdir src/routes
mkdir src/controllers
mkdir src/services
mkdir src/DTOs
mkdir src/REPOSITORY
mkdir src/REPOSITORY/models
📄 5️⃣ Criar Arquivos Principais
touch src/app.ts
touch src/server.ts

No Windows PowerShell:

ni src/app.ts
ni src/server.ts
⚙️ 6️⃣ Criar tsconfig.json
npx tsc --init

Ou criar manualmente:

{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
🧹 7️⃣ Configurar ESLint

Criar o arquivo:

eslint.config.js

Modelo base:

import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json"
      }
    }
  }
];
🚀 8️⃣ Rodar Projeto em Modo Desenvolvimento
bun run start:dev

Isso ativa:

⚡ Execução com Bun

🔥 Hot reload automático

📦 TypeScript executando diretamente

🧪 9️⃣ Rodar Lint
bun run lint

ou

bun lint
🔁 Fluxo de Trabalho Diário
🔹 Iniciar servidor
bun run start:dev
🔹 Criar nova feature

Criar rota

Criar controller

Criar service

Criar DTO

Atualizar repository

🔹 Validar código
bun run lint
🧠 Fluxo Arquitetural Padrão
Route
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Model
📌 Comandos Importantes do Bun
Instalar dependência
bun add nome-da-lib
Instalar dev dependency
bun add -d nome-da-lib
Remover pacote
bun remove nome-da-lib
Atualizar dependências
bun update
🛠 Quando Clonar o Projeto do Git
git clone <url>
cd backend
bun install
bun run start:dev
📦 Futuro (Banco de Dados)

Quando adicionar PostgreSQL, Prisma ou outro ORM:

bun add prisma
bunx prisma init
🎯 Modelo Mental

Sempre que começar projeto novo:

1️⃣ bun init
2️⃣ configurar package.json
3️⃣ bun install
4️⃣ criar estrutura src
5️⃣ configurar tsconfig
6️⃣ configurar eslint
7️⃣ rodar bun --hot
📂 Estrutura Final do Projeto
src/
 ├── server.ts
 ├── app.ts
 ├── routes/
 ├── controllers/
 ├── services/
 ├── DTOs/
 ├── REPOSITORY/
 │    └── models/