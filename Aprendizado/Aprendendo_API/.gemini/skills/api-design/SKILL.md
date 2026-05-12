---
name: api-design
description: Use para criar ou revisar APIs REST, GraphQL e gRPC, definindo contratos, versionamento, paginação, error responses, rate limiting e OpenAPI.
triggers:
  - "projetar nova API REST, GraphQL ou gRPC"
  - "revisar API existente (versionamento, paginação, errors)"
  - "definir contratos de API ou gerar OpenAPI spec"
license: MIT
---

# API Design

## Quando Usar

- Projetar uma API nova (REST, GraphQL, gRPC)
- Revisar ou melhorar uma API existente
- Definir padrões de resposta, erros e paginação
- Planejar versionamento de API
- Escrever documentação OpenAPI/Swagger

## Princípios Fundamentais

1. **Contract-first** — definir o contrato antes de implementar
2. **Consistência** — mesmos padrões em todos os endpoints
3. **Previsibilidade** — dev que conhece 1 endpoint sabe usar os outros
4. **Evolução** — projetar para mudança sem quebrar clientes existentes

## REST — Padrões de Design

### Nomenclatura de Recursos

```
# Substantivos no plural, kebab-case
GET    /users
GET    /users/{id}
POST   /users
PUT    /users/{id}
PATCH  /users/{id}
DELETE /users/{id}

# Sub-recursos
GET    /users/{id}/orders
POST   /users/{id}/orders

# Ações (quando CRUD não é suficiente)
POST   /orders/{id}/cancel
POST   /users/{id}/reset-password
```

**Regras:**
- Recursos são **substantivos**, nunca verbos (`/users`, não `/getUsers`)
- Plural para coleções (`/users`), singular para item (`/users/{id}`)
- Máximo 3 níveis de aninhamento — além disso, referenciar por ID
- IDs no path, filtros na query string

### Status Codes

| Code | Quando Usar |
|------|-------------|
| `200 OK` | GET/PUT/PATCH bem-sucedido |
| `201 Created` | POST que criou recurso (incluir `Location` header) |
| `204 No Content` | DELETE bem-sucedido |
| `400 Bad Request` | Input inválido, validação falhou |
| `401 Unauthorized` | Sem autenticação ou token inválido |
| `403 Forbidden` | Autenticado, mas sem permissão |
| `404 Not Found` | Recurso não existe |
| `409 Conflict` | Conflito de estado (duplicata, versão desatualizada) |
| `422 Unprocessable Entity` | Sintaxe OK, mas semântica inválida |
| `429 Too Many Requests` | Rate limit excedido |
| `500 Internal Server Error` | Erro não esperado no servidor |

### Formato de Erro Consistente

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "not-an-email"
      }
    ]
  }
}
```

**Regras:**
- Sempre retornar JSON, mesmo em erros
- Campo `code` legível por máquina (UPPER_SNAKE_CASE)
- Campo `message` legível por humano
- Nunca expor stack traces ou detalhes internos

### Paginação

**Cursor-based (recomendado para grandes volumes):**
```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MTAwfQ==",
    "has_more": true
  }
}
```

**Offset-based (mais simples, para volumes pequenos):**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Regras:**
- Default de `per_page` sensato (20-50)
- Limite máximo de `per_page` (100) para evitar abuse
- Cursor-based para tabelas grandes (evitar OFFSET em milhões de rows)

### Filtros, Ordenação e Busca

```
# Filtros
GET /users?status=active&role=admin

# Ordenação
GET /users?sort=created_at&order=desc

# Busca
GET /users?q=john

# Campos específicos (sparse fieldsets)
GET /users?fields=id,name,email
```

### Versionamento

| Estratégia | Exemplo | Quando Usar |
|------------|---------|-------------|
| **URL path** | `/v1/users` | APIs públicas, clareza máxima |
| **Header** | `Accept: application/vnd.api+json;version=2` | APIs internas, sem poluir URL |
| **Query param** | `/users?version=2` | Transição, debugging |

**Regra prática:** URL path para APIs públicas, header para APIs internas.

### Rate Limiting

Headers de resposta obrigatórios:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
Retry-After: 30  (quando 429)
```

### Idempotência

- GET, PUT, DELETE são naturalmente idempotentes
- POST não é — usar header `Idempotency-Key` para operações críticas
- Armazenar resultado da primeira execução e retornar em requisições duplicadas

## GraphQL — Padrões de Design

### Schema Design

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  orders(first: Int, after: String): OrderConnection!
}

type OrderConnection {
  edges: [OrderEdge!]!
  pageInfo: PageInfo!
}
```

**Regras:**
- Usar Relay Connection Specification para paginação
- Campos obrigatórios com `!`
- Mutations retornam o objeto afetado
- Erros de negócio no payload, não em `errors[]`

### Boas Práticas

- Limitar profundidade de query (max depth: 5-10)
- Limitar complexidade de query (max cost)
- Usar DataLoader para evitar N+1
- Mutations nomeadas como verbos: `createUser`, `cancelOrder`

## Documentação

Toda API deve ter documentação atualizada:

- **REST:** OpenAPI/Swagger spec mantida junto ao código
- **GraphQL:** Schema introspection + descrições nos types
- **gRPC:** Protobuf com comentários descritivos

Documentação mínima por endpoint:
- Descrição do que faz
- Parâmetros (tipo, obrigatório, default, exemplo)
- Respostas possíveis (sucesso + erros)
- Exemplo de request e response

## Checklist de Design

- [ ] Nomenclatura consistente em todos os endpoints
- [ ] Status codes semânticos e documentados
- [ ] Formato de erro padronizado
- [ ] Paginação em endpoints que retornam listas
- [ ] Rate limiting configurado
- [ ] Autenticação e autorização definidos
- [ ] Versionamento planejado
- [ ] Documentação (OpenAPI / schema) atualizada

## Passos

### 1. Entender os casos de uso

Antes de definir endpoints:
- Quais operações o consumidor precisa fazer?
- Quais dados precisa receber e enviar?
- Qual a frequência e volume esperado?

### 2. Definir o estilo da API

- **REST**: recursos bem definidos, stateless, HTTP semântico → usar `## REST — Padrões de Design`
- **GraphQL**: queries flexíveis, múltiplos consumidores, dados relacionados → usar `## GraphQL — Padrões de Design`
- **gRPC**: performance crítica, comunicação interna entre serviços

### 3. Modelar os recursos (REST)

- Nomear recursos no plural: `/users`, `/orders`
- Usar hierarquia para relacionamentos: `/users/{id}/orders`
- Mapear verbos HTTP aos métodos CRUD:
  - `GET` → leitura (idempotente)
  - `POST` → criação
  - `PUT/PATCH` → atualização
  - `DELETE` → remoção

### 4. Definir contratos de request/response

- Schemas de entrada com validação explícita
- Envelope de resposta consistente (success + error format)
- Campos obrigatórios vs opcionais documentados

### 5. Documentar

Usar `## Documentação` — OpenAPI/Swagger para REST, SDL para GraphQL.
Incluir exemplos de request/response para cada endpoint.

### 6. Validar com checklist

Completar o `## Checklist de Design` antes de publicar a API.

## Exemplos

### REST — Endpoint padrão

```http
# Create order
POST /api/v1/orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "user_id": "usr_123",
  "items": [
    { "product_id": "prod_456", "quantity": 2 }
  ]
}

# Response 201 Created
{
  "data": {
    "id": "ord_789",
    "status": "pending",
    "total": 99.90,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```
