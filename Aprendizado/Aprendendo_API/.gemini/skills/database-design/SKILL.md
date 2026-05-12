---
name: database-design
description: Use para modelar dados, criar schemas e migrations, revisar queries e definir padrões de acesso em bancos SQL ou NoSQL.
triggers:
  - "modelar schema ou estrutura de dados"
  - "criar ou revisar migrations SQL/NoSQL"
  - "otimizar queries ou escolher banco de dados"
license: MIT
---

# Database Design

## Quando Usar

- Modelar um schema de banco de dados novo
- Criar ou revisar migrations
- Escrever ou otimizar queries complexas
- Escolher entre SQL e NoSQL para um caso de uso
- Projetar padrões de acesso para NoSQL

## SQL — Padrões e Boas Práticas

### Modelagem

- Normalizar até 3NF por padrão; desnormalizar apenas quando performance exigir
- Chaves primárias: UUIDs para sistemas distribuídos, BIGINT autoincrement para sistemas internos
- Chaves estrangeiras com `ON DELETE` explícito (não usar CASCADE sem analisar impacto)
- Timestamps `created_at` e `updated_at` em todas as tabelas

### Migrations

- Uma migration por mudança atômica
- Migrations devem ser reversíveis (up + down)
- Nunca alterar dados em migration de schema (usar migration de dados separada)
- Migrations em produção: testar em staging primeiro, executar em horário de baixo tráfego

### Índices

- Index em todas as colunas usadas em `WHERE`, `JOIN` e `ORDER BY` frequentes
- Índices compostos: ordem importa (coluna mais seletiva primeiro)
- Verificar índices não utilizados com `pg_stat_user_indexes` (PostgreSQL)
- Índices têm custo de escrita — não indexar tudo

### Queries

```sql
-- Usar EXPLAIN ANALYZE para entender o plano de query
EXPLAIN ANALYZE SELECT ...;

-- Evitar SELECT * em produção
SELECT id, name, email FROM users WHERE is_active = true;

-- Paginação eficiente com cursor (evitar OFFSET em tabelas grandes)
SELECT id, user_id, status, created_at
FROM orders
WHERE id > :cursor
ORDER BY id
LIMIT 20;
```

## NoSQL — Padrões e Boas Práticas

### Escolha do banco

| Banco | Quando usar |
|-------|------------|
| MongoDB | Documentos com schema flexível, queries ad-hoc |
| Redis | Cache, sessões, pub/sub, rate limiting |
| DynamoDB | Alta escala, padrões de acesso previsíveis |
| Firestore | Apps mobile/web com sync em tempo real |

### Modelagem NoSQL

**Diferente do SQL: modelar pelos padrões de acesso, não pela normalização.**

- Definir os padrões de acesso primeiro: "quais queries o sistema faz?"
- Desnormalização é esperada — duplicar dados para evitar joins
- Documentos grandes vs. muitos documentos pequenos: depende do caso

### MongoDB
```javascript
// Indexar campos de busca frequente
db.users.createIndex({ email: 1 }, { unique: true });
db.orders.createIndex({ userId: 1, createdAt: -1 });

// Projeção: retornar apenas o necessário
db.users.find({ isActive: true }, { name: 1, email: 1 });
```

### Redis
```
# Cache com TTL
SET user:123 "{...}" EX 3600

# Rate limiting
INCR rate:user:123
EXPIRE rate:user:123 60
```

## Checklist de Revisão de Schema

- [ ] Chaves primárias definidas
- [ ] Chaves estrangeiras com constraint explícita
- [ ] Índices nos campos de busca principais
- [ ] Timestamps de auditoria (`created_at`, `updated_at`)
- [ ] Migration reversível com down
- [ ] Sem alteração de dados em migration de schema
- [ ] Testado com dados de volume realista

## Passos

### 1. Mapear os casos de uso e padrões de acesso

Antes de modelar qualquer schema:
- Quais queries serão mais frequentes?
- Qual a relação entre as entidades? (1:1, 1:N, N:M)
- Quais dados precisam de consistência transacional?
- Qual o volume esperado por tabela/coleção?

### 2. Escolher o tipo de banco

- **SQL**: dados relacionais com integridade referencial, transações ACID
- **NoSQL Document**: dados com schema variável, leitura por documento
- **NoSQL Key-Value**: cache, sessões, dados simples de alta velocidade
- **NoSQL Time Series**: métricas, logs, eventos temporais

### 3. Modelar o schema

Para **SQL**: usar `## SQL — Padrões e Boas Práticas`
- Normalizar até 3NF, desnormalizar conscientemente para performance
- Definir PKs, FKs, constraints, índices

Para **NoSQL**: usar `## NoSQL — Padrões e Boas Práticas`
- Modelar orientado à query, não à relação
- Evitar joins — embutir ou referenciar com base no padrão de acesso

### 4. Criar migrations versionadas

```bash
# Example with common tools
# Prisma
npx prisma migrate dev --name create_users_table

# Flyway / Liquibase
V001__create_users_table.sql
```

### 5. Validar com checklist

Completar o `## Checklist de Revisão de Schema` antes de aplicar em produção.

## Exemplos

### Schema SQL — Tabela de usuários

```sql
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for the most common lookup
CREATE INDEX idx_users_email ON users(email);

-- Trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Modelagem NoSQL — Documento de pedido (MongoDB)

```json
{
  "_id": "ord_789",
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "items": [
    {
      "product_id": "prod_456",
      "name": "Product A",
      "unit_price": 49.95,
      "quantity": 2
    }
  ],
  "total": 99.90,
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z"
}
```
> ✅ `user` e `items` embutidos porque são sempre lidos juntos com o pedido.
