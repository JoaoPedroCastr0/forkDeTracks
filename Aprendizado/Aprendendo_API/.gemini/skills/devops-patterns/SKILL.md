---
name: devops-patterns
description: Use para configurar CI/CD, Docker, infraestrutura como código, ambientes, deploys e gestão segura de secrets.
triggers:
  - "configurar pipeline CI/CD (GitHub Actions, GitLab CI)"
  - "Docker, docker-compose ou infraestrutura como código"
  - "estratégia de deploy, ambientes ou gestão de secrets"
license: MIT
---

# DevOps Patterns

## Quando Usar

- Configurar pipelines de CI/CD
- Criar ou otimizar Dockerfiles e docker-compose
- Definir estratégia de deploy (blue-green, canary, rolling)
- Configurar infraestrutura como código (IaC)
- Gerenciar secrets e variáveis de ambiente
- Configurar ambientes (dev, staging, production)

## CI/CD Pipeline

### Estrutura Recomendada

```
Install → Lint → Build → Test → Security → Deploy
```

**Princípios:**
- **Fail fast** — lint e testes unitários primeiro, E2E por último
- **Reprodutível** — mesmo commit, mesmo resultado, sempre
- **Incremental** — cache de dependências entre runs
- **Seguro** — secrets nunca em logs, scan de vulnerabilidades automático

### GitHub Actions — Padrões

```yaml
# Estrutura recomendada
name: CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.node-version'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.node-version'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
```

**Boas práticas:**
- Fixar versões de actions (`@v4`, não `@latest`)
- Usar cache de dependências (`cache: 'npm'`)
- Separar jobs para paralelismo (lint || test, deploy sequencial)
- Branch protection: exigir CI verde para merge

## Docker

### Dockerfile Multi-Stage

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
```

**Boas práticas:**
- Multi-stage builds — imagem final menor e mais segura
- `.dockerignore` configurado (node_modules, .git, tests)
- Rodar como usuário não-root (`USER node`)
- Healthcheck configurado
- Versões específicas de imagens base (não `latest`)

### Docker Compose — Desenvolvimento

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 5s
      timeout: 5s
      retries: 5
```

## Estratégias de Deploy

| Estratégia | Risco | Rollback | Quando Usar |
|------------|-------|----------|-------------|
| **Rolling** | Médio | Lento | Default, mudanças incrementais |
| **Blue-Green** | Baixo | Instantâneo | Mudanças de alto risco, zero downtime |
| **Canary** | Baixo | Rápido | Validar com subset de tráfego antes |
| **Recreate** | Alto | Lento | Mudanças que exigem downtime (migrations destrutivas) |

**Regras:**
- Sempre ter rollback plan antes de deployar
- Migrations de banco separadas do deploy de código
- Feature flags para mudanças arriscadas (deploy ≠ release)
- Smoke tests automatizados pós-deploy

## Secrets Management

**Nunca:**
- Secrets no código ou em repositório
- Secrets em logs ou output de CI
- Secrets em variáveis de ambiente não criptografadas em produção

**Sempre:**
- Usar secret managers (GitHub Secrets, AWS Secrets Manager, HashiCorp Vault)
- Rotacionar secrets periodicamente
- Princípio de menor privilégio (cada serviço só acessa o que precisa)
- Auditar acesso a secrets

## Ambientes

| Ambiente | Propósito | Dados |
|----------|-----------|-------|
| **Development** | Desenvolvimento local | Dados fake/seed |
| **Staging** | Validação pré-produção | Dados anonimizados de produção |
| **Production** | Usuários reais | Dados reais, backup obrigatório |

**Regras:**
- Staging deve ser o mais próximo possível de production
- Nunca usar dados reais de produção em desenvolvimento
- Feature flags para controlar rollout gradual
- Observabilidade (logs, métricas, traces) em todos os ambientes

## Checklist de Infraestrutura

- [ ] CI/CD pipeline configurado e testado
- [ ] Dockerfile otimizado (multi-stage, non-root, healthcheck)
- [ ] Secrets gerenciados por secret manager
- [ ] Rollback plan documentado e testado
- [ ] Monitoramento e alertas configurados
- [ ] Backup e disaster recovery planejados
- [ ] Branch protection rules ativas
- [ ] Ambientes isolados (dev, staging, prod)

## Passos

### 1. Mapear o contexto de infraestrutura

- Identificar a plataforma alvo (AWS, GCP, Azure, bare metal, k8s)
- Verificar stage atual: local → staging → produção
- Listar ferramentas já em uso no projeto (Docker, Terraform, Ansible, etc.)

### 2. Definir a estratégia de CI/CD

Consultar `## CI/CD Pipeline` para o padrão adequado:
- GitHub Actions, GitLab CI, CircleCI, Jenkins
- Definir triggers: push, PR, tag, schedule
- Definir stages: lint → test → build → deploy

### 3. Containerizar a aplicação

Usar padrões de `## Docker`:
- Dockerfile multi-stage para imagens lean
- `.dockerignore` sempre presente
- Variáveis de ambiente via `ENV` ou secrets externos

### 4. Configurar estratégia de deploy

Escolher a estratégia em `## Estratégias de Deploy`:
- **Blue-Green**: zero downtime, rollback instantâneo
- **Canary**: rollout gradual, validação em produção
- **Rolling**: atualização gradual de instâncias

### 5. Gerenciar secrets

Consultar `## Secrets Management` — nunca hardcodar secrets em código.
Usar: Vault, AWS Secrets Manager, GitHub Secrets, etc.

### 6. Validar com checklist

Completar o `## Checklist de Infraestrutura` antes de cada deploy em produção.

## Exemplos

### GitHub Actions — Pipeline básico

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage

  build-and-push:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build e push Docker image
        run: |
          docker build -t ${{ secrets.REGISTRY }}/app:${{ github.sha }} .
          docker push ${{ secrets.REGISTRY }}/app:${{ github.sha }}
```

### Dockerfile multi-stage (Node.js)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
```
