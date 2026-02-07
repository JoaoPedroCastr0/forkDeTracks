Segue um plano base conciso com os conhecimentos essenciais antes de dividir front / back. Foco em prática e automonia.

Conhecimentos base (comuns a toda equipe)

Lógica de programação e estruturas de dados básicas.
JavaScript moderno (ES6+) e TypeScript (tipagem, generics, tsconfig).
Git & GitHub: branches, PRs, code review, rebase/merge.
Terminal (Windows PowerShell / WSL): navegação, scripts, npm/bun.
HTTP, REST, status codes, headers, CORS, WebSockets básicos.
Conceitos de redes e segurança básica (TLS, auth tokens, OWASP Top 10).
Testes: unitários, integração, e2e (Vitest/Jest + Playwright).
Debugging e leitura de logs (IDE, terminal, Bun/Node logs).
CI/CD básico (GitHub Actions): pipelines de build/test/deploy.
Containerização mínima (Docker) e conceitos de ambiente.
Observability: logs, métricas e alerts (ex.: Sentry/basic Prometheus).
Clean code, modularização e patterns simples (SRP, SOLID básico).
Soft skills: comunicação assíncrona, code review, pair programming.
Stack preferencial (Nexus Stack — alinhar prática)

Runtime: Bun.
Backend: Node/Bun + TypeScript + Fastify/Express.
ORM: Prisma.
Frontend: React + TypeScript + Tailwind CSS + shadcn/ui.
Monorepo/estrutura: organizar packages por domínio (opcional).
Conteúdos práticos recomendados (hands-on)

Criar um projeto template com Bun + TS + ESLint + Prettier + Vitest.
API simples: CRUD com Fastify + Prisma (SQLite para dev).
Frontend simples: React + Tailwind consumindo a API.
Pipeline CI: build, lint, test, deploy em staging.
Roadmap 6 meses (sugestão)

Mês 1: Fundamentos — JS/TS, Git, terminal, HTTP, pequenos exercícios.
Mês 2: Tools & Testing — Bun, config TS, lint, testes unitários.
Mês 3: Backend básico — Fastify/Express, Prisma, migrations, autenticação.
Mês 4: Frontend básico — React, Tailwind, componentes, chamadas à API.
Mês 5: Integração — E2E, CI/CD, container dev (docker), observability.
Mês 6: Projeto integrado + revisão de código + especialização (front ou back).
Checklist de validação antes da divisão

Todos completaram exercícios de API e frontend básicos.
Pipeline CI rodando com testes verdes.
Repositório template com boas práticas e lint configurado.
Cada membro subiu um PR revisado por outro colega.
Documento curto com decisões de arquitetura e padrões escolhidos.
Sugestões de organização de aprendizado

Branches: feat/<tema>, fix/<tema>, docs/<tema>.
Commits curtos e descritivos (imperativo).
Faça exercícios práticos curtos e entregue via PR pequeno.
Ao final, abrir Issue com link do repositório de exercícios e checklist preenchido.
Ninguém evolui sozinho — proponha reviews periódicos e pair programming.