# Estágio 1: Build
FROM oven/bun:1 AS builder
WORKDIR /app

# Copiar apenas os arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copiar o restante do código fonte
COPY . .

# Rodar o build (ajuste o comando se necessário, ex: bun run build)
RUN bun run build

# Estágio 2: Runtime (Servindo com um servidor estático leve)
FROM nginx:alpine AS runtime

# Copiar os arquivos buildados do estágio anterior para o diretório do Nginx
# Geralmente o build do Vite vai para a pasta 'dist'
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor a porta padrão do Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
