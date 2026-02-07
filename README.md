# learning-paths
Este repositório documenta roteiros de aprendizado práticos. 

## JavaScript/TypeScript — stack unificada para reduzir a curva de aprendizagem

Usar JavaScript/TypeScript no frontend e no backend acelera a aprendizagem. Alinhar linguagem e ferramentas reduz conceitos duplicados e permite reaproveitar conhecimento (componentes, tipos, utilitários).

### Por que adotar uma stack unificada
- Menos context switching: mesma linguagem em cliente e servidor.
- Reuso: compartilhe tipos e validações entre frontend e backend.
- Ferramentas comuns: bundlers, formatadores e devtools similares.
- Mental model único: async/await, módulos e tipagem compõem a mesma base.

### Stack sugerida (padrão ATNexusLab)
- Runtime: Bun (execução e pacote).
- Linguagem: TypeScript (tipagem forte).
- Frontend: React + Tailwind + shadcn/ui.
- Backend: Bun/Node + Fastify/Express.
- DB: Prisma ORM.

### Como começar (passos práticos)
- Crie um mono-repo ou pacote compartilhado para tipos: packages/shared.
- Defina DTOs e esquemas em TypeScript e importe no frontend e backend.
- Use scripts do Bun para rodar dev servers com hot reload.
- Teste endpoints com fetch no frontend usando os mesmos tipos.

### Benefícios pedagógicos
- Aprendizagem baseada em código real: implemente um endpoint e consuma-o com React.
- Debug mais simples: logs e erros em TypeScript indicam onde ajustar tipos.
- Menos dependências mentais: um único ecossistema para dominar.

### Exemplo de desafio de debug (erro comum)
- Sintoma: resposta do backend quebra o frontend com "property undefined".
- Causa provável: contrato (tipo) entre backend e frontend divergente.
- Passos de investigação:
  - Verifique a versão do pacote de tipos compartilhados.
  - Rode tsc/tsc --noEmit para checar erros de tipagem.
  - Teste a API com curl ou Insomnia para comparar shape da resposta.

### Boas práticas e fluxo de trabalho
- Branches: feat/<tema>, fix/<tema>, docs/<tema>.
- Commits: verbo no imperativo (ex.: "Add shared types for users").
- PRs pequenos e focados.
- Valide links e consistência entre trilhas antes de merge.

### Checklist rápido antes de finalizar um nível
- - Tipos compartilhados atualizados.
- - Endpoints testados pelo frontend.
- - Logs claros no servidor e no cliente.
- - PR pequena com descrição do impacto em outras trilhas.

Ninguém evolui sozinho. Peça revisão e crie um Draft PR quando estiver em dúvida.

Links úteis:
- tracks/typescript-node/README.md
- tracks/react/README.md
- tracks/prisma/README.md

Roteiros detalhados por trilha:
- Lógica de Programação - Java Script(base): [tracks/logic/README.md](tracks/logic/README.md)
- Git & GitHub (base): [tracks/git/README.md](tracks/git/README.md)






- TypeScript & Node.js (backend): [tracks/typescript-node/README.md](tracks/typescript-node/README.md)
- React & Frontend (frontend): [tracks/react/README.md](tracks/react/README.md)
- Banco de Dados com Prisma (dados): [tracks/prisma/README.md](tracks/prisma/README.md)
- Projeto Integrado (fullstack): [tracks/fullstack-project/README.md](tracks/fullstack-project/README.md)


Como usar este diretório

- Siga os níveis em ordem. Documente cada exercício com commits e um
  pequeno relatório em Markdown.
- Ao terminar um nível, abra uma Issue no repositório raiz com o link para o
  repositório de exercícios e um resumo do seu progresso.

Como seguir a trilha (expectativas para membros)

- **Siga a ordem proposta:** inicie pelo `Nível 1`, avance para `Nível 2` e
  só depois para `Nível 3`.
- **Cadência sugerida:** complete um nível em 1–2 semanas (ajuste conforme
  disponibilidade). Marque progresso com commits e um pequeno relatório.
- **Registro de exercícios:** mantenha um repositório separado (por exemplo
  `tracks/git-exercises`) contendo os commits de cada exercício — isso facilita
  revisão e compartilhamento.
- **Como reportar progresso:** ao concluir um nível, abra uma Issue no repo
  raiz com:
  - link para o repositório de exercícios;
  - resumo (1–2 parágrafos) do que foi aprendido;
  - checklist preenchido do nível.
- **Revisão por pares:** peça um colega para revisar seu repositório e deixar
  comentários na Issue ou abrir uma PR com sugestões.
- **Política de participação:** siga as instruções de cada arquivo de nível
  e respeite as práticas de branch/PR ao contribuir em projetos reais.
