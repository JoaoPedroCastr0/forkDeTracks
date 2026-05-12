---
name: performance-analysis
description: Use para investigar lentidão, fazer profiling, benchmarks e otimizações em backend, frontend, banco de dados ou infraestrutura.
triggers:
  - "sistema/endpoint/query está lento"
  - "identificar gargalos antes de otimizar"
  - "profiling, benchmarks ou definição de SLOs de performance"
license: MIT
---

# Performance Analysis

## Quando Usar

- Sistema está lento e a causa não é clara
- Antes de otimizar (para identificar o gargalo real)
- Definir SLOs de performance para um sistema
- Validar que uma otimização realmente melhorou os números

## Regra de Ouro

**Nunca otimize sem medir primeiro.** Intuição sobre onde está o gargalo está errada na maioria das vezes.

Ciclo: Medir → Identificar gargalo → Hipótese → Otimizar → Medir novamente.

## Métricas por Camada

### Backend / API
- **Latência p50, p95, p99** (não só média — outliers importam)
- **Throughput** (requests/s que o sistema aguenta)
- **Taxa de erro** (% de requests com falha)
- **Tempo de CPU e memória** sob carga

### Banco de Dados
- **Queries lentas** (slow query log)
- **N+1 queries** (query count por request)
- **Taxa de hit de índice** vs. sequential scans
- **Connection pool** utilization

### Frontend
- **Core Web Vitals:** LCP, FID/INP, CLS
- **Time to Interactive (TTI)**
- **Bundle size**
- **Network waterfall** (requests bloqueantes)

## Ferramentas por Stack

### Backend
```bash
# Node.js — profiling com clinic.js
clinic doctor -- node server.js
clinic flame -- node server.js

# Python — profiling
python -m cProfile -o output.prof app.py
python -m pstats output.prof

# Go — pprof
go tool pprof http://localhost:6060/debug/pprof/profile
```

### Banco de Dados
```sql
-- PostgreSQL: queries lentas
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 20;

-- EXPLAIN ANALYZE
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

### Frontend
```
# Lighthouse (Chrome DevTools ou CLI)
npx lighthouse https://exemplo.com --view

# Bundle analyzer (webpack)
npx webpack-bundle-analyzer stats.json
```

## Checklist de Análise

### 1. Estabelecer baseline
- [ ] Medir latência p50/p95/p99 atual
- [ ] Medir throughput máximo atual
- [ ] Identificar os endpoints/paths mais lentos

### 2. Identificar gargalo
- [ ] CPU-bound? (alto CPU, baixa latência de I/O)
- [ ] I/O-bound? (alto wait time, baixo CPU)
- [ ] Memory? (GC pressure, OOM)
- [ ] Database? (slow queries, N+1, missing index)
- [ ] Network? (payloads grandes, muitos requests)

### 3. Hipótese e otimização
- [ ] Uma mudança por vez
- [ ] Medir o impacto de cada mudança isoladamente

### 4. Validar e documentar
- [ ] Comparar métricas antes e depois
- [ ] Documentar a otimização e o ganho obtido
- [ ] Verificar que não houve regressão em outros pontos

## Sinais de Alerta Comuns

- Query sem índice em tabela grande = sequential scan
- N+1 queries = query dentro de loop
- Bundle JS > 1MB = muito a carregar antes de renderizar
- Memory leak = uso de memória cresce continuamente
- CPU spike sem carga = GC ou computação síncrona na thread principal

## Passos

### 1. Definir a hipótese de problema

Antes de perfilar:
- Qual comportamento está lento? (endpoint, query, render, build)
- Qual é a métrica atual e qual a meta?
- Em qual ambiente ocorre? (prod, staging, local com dados reais?)

### 2. Medir antes de otimizar

**Nunca otimizar sem medir primeiro.**

```bash
# Backend — response time breakdown for an endpoint
curl -sS -w "\ntime_connect: %{time_connect}\ntime_starttransfer: %{time_starttransfer}\ntime_total: %{time_total}\n" http://localhost:3000/api/endpoint

# Database — EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

# Frontend — Lighthouse
npx lighthouse https://example.com --output json
```

### 3. Identificar o gargalo

Usar `## Métricas por Camada` para guiar a análise:
- Backend: CPU, memória, I/O, queries N+1
- Frontend: LCP, FID, CLS (Core Web Vitals)
- Banco: índices ausentes, table scans, lock contention

### 4. Perfilar com ferramenta adequada

Consultar `## Ferramentas por Stack` para escolher a ferramenta correta para a linguagem/plataforma.

### 5. Implementar e validar a otimização

- Implementar **uma** otimização por vez
- Medir novamente com a mesma metodologia do passo 2
- Documentar o ganho obtido (ex: "P95 de 2.3s → 340ms após adição de índice")

### 6. Completar o checklist

Usar `## Checklist de Análise` antes de fechar o ciclo de otimização.

## Exemplos

### Análise de query lenta (PostgreSQL)

```sql
-- Identify slow queries
SELECT query, mean_exec_time, calls, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Analyze one specific query
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.*, o.* FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.email = 'user@example.com';

-- Typical issue: "Seq Scan" on a large table
-- Fix: CREATE INDEX idx_users_email ON users(email);
```

### Profiling de endpoint (Node.js)

```javascript
// Using clinic.js
// $ npx clinic doctor -- node server.js
// $ npx clinic flame -- node server.js

// Or use console.time for a targeted measurement
async function getUser(id) {
  console.time('db-query')
  const user = await db.findById(id)
  console.timeEnd('db-query')  // output: db-query: 245ms
  return user
}
```
