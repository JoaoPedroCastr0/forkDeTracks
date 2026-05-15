# Usamos a imagem oficial do Bun
FROM oven/bun:1 AS base

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Instalar dependências (estritamente Bun)
COPY package.json bun.lock ./
# Ignoramos explicitamente package-lock.json ou yarn.lock via .dockerignore
RUN bun install --frozen-lockfile

# 2. Copiar o restante do código
COPY . .

# Expor a porta da API
EXPOSE 4000

# Healthcheck para orquestração
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# 3. Gerar o Prisma e rodar o server NO RUNTIME
# Isso garante que ele use as variáveis de ambiente do docker-compose
CMD ["sh", "-c", "bun prisma generate && bun run start:dev"]
