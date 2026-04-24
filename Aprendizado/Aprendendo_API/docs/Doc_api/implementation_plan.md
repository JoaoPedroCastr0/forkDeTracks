# Estruturação e Integração do Frontend com React

Como você removeu os arquivos antigos de HTML/CSS/JS puros e já deixou a base de pastas do React preparada (`src/`, `features/`, etc.), o próximo passo é transformarmos essa pasta em um projeto React real e fazermos ele conversar com o seu backend de forma eficiente.

## User Review Required

> [!IMPORTANT]
> Vou precisar inicializar o projeto Node.js na pasta `frontend` (criar o `package.json`) e instalar as dependências do React e do Vite, já que os arquivos atuais (`main.tsx`, etc.) estão vazios e o projeto não possui configuração ainda. Você aprova?

> [!WARNING]
> Seu backend (em `app.ts`) está configurado para aceitar requisições de Origem (CORS) apenas do `http://127.0.0.1:8080`. O servidor de desenvolvimento do Vite com React normalmente roda na porta `5173`. Eu vou precisar atualizar as configurações de CORS do seu backend para permitir as requisições do React.

## Proposed Changes

---

### Frontend - Configuração Inicial (Vite + React)
Como os diretórios já existem, mas faltam os arquivos de configuração do ecossistema, farei a seguinte estruturação básica:

#### [NEW] `frontend/package.json`
- Criação do arquivo de dependências contendo `react`, `react-dom`, `typescript`, `vite` e `axios` (para consumo da API).

#### [NEW] `frontend/index.html` e `frontend/vite.config.ts`
- O `index.html` precisará referenciar o `src/main.tsx`.
- O `vite.config.ts` será configurado para o plugin do React. (vou sobrescrever o arquivo vazio que existe lá).

#### [MODIFY] `frontend/src/main.tsx` e `frontend/src/App.tsx`
- Inicialização padrão da árvore de componentes do React renderizando o `App`.

---

### Frontend - Arquitetura e Comunicação com a API

#### [NEW] `frontend/src/shared/api.ts`
- Criação de uma instância do Axios configurada para bater na URL base do seu backend (`http://localhost:4000`).
- Aqui ficarão os interceptadores caso depois precisemos colocar Token JWT nas chamadas protegidas.

#### [NEW] `frontend/src/features/Auth/Login.tsx`
- Criação de um primeiro componente visual (página de login) em React para consumirmos a rota `POST /login` da sua API e provarmos que a comunicação está funcionando. Usarei a base de estilização em CSS simples que fará a mesma função do seu projeto antigo.

---

### Backend - Ajustes de Integração

#### [MODIFY] `Aprendendo_API/src/app.ts`
- Atualização do *middleware* `cors` para incluir a origem de desenvolvimento do frontend (`http://localhost:5173` e `http://127.0.0.1:5173`), evitando bloqueios no navegador na hora do consumo.

## Verification Plan

### Teste de Comunicação Frontend -> Backend
1. Iniciar o backend localmente.
2. Instalar as dependências e iniciar o frontend (`npm run dev`).
3. Tentar fazer uma requisição de Login através da nova interface em React e verificar no Network do navegador se o Backend retornou a resposta de sucesso ou erro (mostrando que estão conversando perfeitamente).
