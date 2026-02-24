
# Meu workflow:

name: Lint

on:
  pull_request:
    branches:
      - main

Isso significa:

Toda vez que alguém abrir um PR para main, esse workflow será executado.

- O Job
jobs:
  lint:
    runs-on: ubuntu-latest

O GitHub cria uma máquina virtual Linux temporária.

- Step 1: Checkout
uses: actions/checkout@v4

Clona o seu repositório dentro da VM.

- Step 2: Setup Node
uses: actions/setup-node@v4
with:
  node-version: 20

Instala Node 20 dentro da VM.

- Step 3: Install
run: npm install

Instala todas as dependências do seu package.json.

- Step 4: Run ESLint
run: npm run lint

Ele executa o script definido no seu package.json, provavelmente algo como:

"scripts": {
  "lint": "eslint ."
}

Ou seja:

Ele roda o ESLint em TODOS os arquivos do projeto.
