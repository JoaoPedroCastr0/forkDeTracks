---
name: testing-patterns
description: Use para definir estratégia de testes, escolher unit, integration ou E2E, escrever casos eficazes e melhorar cobertura, mocks e fixtures.
triggers:
  - "definir estratégia de testes para feature ou projeto"
  - "escrever testes unit, integration ou E2E"
  - "melhorar cobertura ou escolher mocks/stubs/fakes"
license: MIT
---

# Testing Patterns

## Quando Usar

- Definir estratégia de testes para um projeto ou feature
- Escrever testes unitários, de integração ou E2E
- Escolher entre mocks, stubs, fakes e spies
- Melhorar cobertura de testes existentes
- Identificar e corrigir testes frágeis ou ineficazes

## Pirâmide de Testes

```
        ╱ E2E ╲          ← Poucos, lentos, alto custo
       ╱────────╲
      ╱Integration╲      ← Moderados, validam fronteiras
     ╱──────────────╲
    ╱   Unit Tests    ╲   ← Muitos, rápidos, isolados
   ╱────────────────────╲
```

**Regra prática:**
- **Unit:** 70% — rápidos, isolados, testam lógica pura
- **Integration:** 20% — testam fronteiras (DB, API, filesystem)
- **E2E:** 10% — testam fluxos críticos de ponta a ponta

## Padrões de Teste

### Arrange-Act-Assert (AAA)

```
// Arrange — preparar o cenário
const user = createUser({ email: "test@example.com" });

// Act — executar a ação
const result = await loginUser(user.email, "password123");

// Assert — verificar o resultado
expect(result.token).toBeDefined();
expect(result.user.email).toBe("test@example.com");
```

### Given-When-Then (BDD)

```
// Given — initial context
given an active user with email "test@example.com"

// When — action
when the user logs in with valid credentials

// Then — expected result
then it should return a valid JWT token
and the status should be 200
```

### Naming Convention

Nome do teste deve descrever o **comportamento**, não a implementação:
- ✅ `"should return 404 when user does not exist"`
- ✅ `"should reject invalid email format"`
- ❌ `"tests findById"`
- ❌ `"test 1"`

## Test Doubles

| Tipo | Quando Usar | Exemplo |
|------|-------------|---------|
| **Mock** | Verificar que uma dependência foi chamada corretamente | Verificar que `emailService.send()` foi chamado |
| **Stub** | Forçar retorno específico de uma dependência | `userRepo.findById()` retorna user fake |
| **Fake** | Substituir implementação real por versão simplificada | In-memory database em vez de PostgreSQL |
| **Spy** | Observar chamadas sem alterar comportamento | Contar quantas vezes uma função foi chamada |

**Regra:** preferir **stubs** e **fakes** sobre mocks. Mocks testam implementação, não comportamento.

## Estratégias por Tipo

### Unit Tests
- Testar **uma unidade** de lógica por vez
- Isolar dependências com stubs/fakes
- Focar em: caminho feliz, erros esperados, valores de borda
- Devem rodar em milissegundos

### Integration Tests
- Testar **fronteiras**: banco de dados, APIs externas, filesystem
- Usar banco real (container) ou fake confiável
- Setup e teardown limpos entre testes
- Testar: queries, migrations, serialização, auth

### E2E Tests
- Testar **fluxos completos** do ponto de vista do usuário
- Poucos, focados nos fluxos mais críticos (login, compra, cadastro)
- Tolerantes a delays (usar waits explícitos, não sleeps)
- Rodar em ambiente o mais próximo possível de produção

## Fixtures e Factories

Preferir **factories** sobre fixtures estáticas:

```
// Factory — flexível, explícita
const user = buildUser({ role: "admin", active: true });

// Fixture estática — rígida, esconde contexto
const user = fixtures.adminUser; // quais campos tem? está ativo?
```

**Boas práticas:**
- Cada teste cria seus próprios dados — nunca depender de estado global
- Usar defaults sensatos na factory, sobrescrever apenas o relevante
- Limpar dados entre testes (truncate, rollback ou container efêmero)

## Checklist de Cobertura

Para cada feature, garantir testes nos **três eixos** (todos obrigatórios):

### Eixo 1 — Behavior Contract
- [ ] Caminho feliz (happy path)
- [ ] Validação de input (inválido, vazio, nulo, formato errado)
- [ ] Valores de borda (zero, máximo, string vazia, lista vazia)
- [ ] Casos de erro (exceções, timeouts, indisponibilidade)
- [ ] Idempotência (executar duas vezes produz o mesmo resultado?)

### Eixo 2 — Security Contract (cobertura completa por superfície)

**Threat Model obrigatório antes de codar.** Enumerar superfícies tocadas e mapear cada uma contra a tabela canônica em `GEMINI.md` → seção "Test Contract". Sem threat model, não entra em implementação.

A tabela canônica cobre 7 grupos: **Auth & Sessão**, **Input & Output**, **Mutation & State**, **Upload & Files**, **API & Network**, **Crypto & Secrets**, **Dependency & Build**. Cada superfície tocada gera test cases obrigatórios — não há "n/a" sem justificativa explícita.

Resumo prático (lista não exaustiva — consultar `GEMINI.md` para cobertura completa):

- **Auth**: anon→401, cross-user→403 (IDOR), token expirado/forjado/cross-tenant, brute force, user enumeration, timing-safe compare, hash forte (argon2/bcrypt), refresh token rotation, cookie flags (HttpOnly/Secure/SameSite).
- **Input**: SQLi/NoSQLi/command injection, XSS (refletido/persistido/atributo/href), SSTI, XXE, **SSRF** (bloquear redes privadas/file://), open redirect, deserialização segura, mass assignment.
- **Mutation**: CSRF (token ou SameSite+Origin), race conditions/TOCTOU, idempotency-key, ownership server-side.
- **Upload**: MIME por magic bytes, tamanho, path traversal, image bombs, EXIF stripping.
- **API**: CORS específico (não `*` com creds), rate limit, security headers (CSP/HSTS/X-Frame/X-Content-Type/Referrer-Policy), webhook signature + replay protection, GraphQL depth/complexity, WebSocket auth per-message.
- **Crypto**: CSPRNG (`crypto.randomBytes`, nunca `Math.random()`), AES-GCM/ChaCha20 com IV único, `timingSafeEqual` em segredos.
- **Output**: secrets nunca em logs/errors/responses, error sem stack/SQL/path em produção.
- **Dependency**: `npm audit`/`pip-audit` sem high/critical, lockfile commitado.

#### Authorization Matrix

Para cada endpoint protegido: matriz `{anônimo, user comum, owner, admin} × {GET, POST, PUT, DELETE}`. Cada célula é um test case com status code esperado explícito. Localização: `test/integration/authz/{resource}.test.{ext}`.

### Eixo 3 — Performance Contract

| Caminho | Tipo de assertion |
|---|---|
| Feature crítica (auth, checkout, fluxo principal) | **Budget numérico fixo** — p95 < X ms, query count ≤ N, payload < Y KB. Falha se exceder. |
| Demais features | **Regression test** — não pode piorar > X% vs baseline em `test/perf/baseline.json` |
| Endpoints com lista | **N+1 absent** — query count assertion com `n=1`, `n=10`, `n=100`; cresce linear = bug |
| Frontend | LCP, INP, CLS, bundle size com budget no Lighthouse CI |

Budgets vivem em arquivo versionado (`test/perf/budgets.json`). Alterar budget exige justificativa explícita no commit.

#### Property-based testing (recomendado)

Em parsers, validadores, formatters, funções puras com input space grande: usar `fast-check`, `hypothesis` ou `proptest` em vez de só example-based. Propriedades comuns: inverso (`parse(format(x)) === x`), idempotência (`f(f(x)) === f(x)`), invariantes de negócio.

## Anti-Patterns de Testes

| Anti-Pattern | Problema | Solução |
|-------------|----------|---------|
| **Teste frágil** | Quebra com qualquer mudança de implementação | Testar comportamento, não implementação |
| **Teste lento** | Suite leva minutos para rodar | Isolar, paralelizar, usar fakes |
| **Teste que testa o mock** | Só verifica que o mock foi chamado | Testar o resultado, não a chamada |
| **Setup gigante** | 50 linhas de setup para 1 assertion | Extrair factory, simplificar cenário |
| **Assertion faltando** | Teste passa sem verificar nada | Sempre ter pelo menos 1 assertion explícita |
| **Teste interdependente** | Ordem de execução importa | Cada teste deve ser independente |
| **Cobertura sem valor** | 100% coverage, 0% confiança | Focar em comportamentos, não em linhas |

## Passos

### 1. Definir a estratégia de testes

Antes de escrever qualquer teste:
- Identificar o tipo de componente: função pura, módulo com dependências, componente UI, serviço HTTP
- Decidir o nível de teste adequado (unit, integration, E2E)
- Mapear as dependências externas que precisarão de doubles

### 2. Escrever o teste antes do código (TDD) ou mapear cobertura existente

Para TDD:
1. Escrever o teste que falha (Red)
2. Implementar o mínimo para passar (Green)
3. Refatorar sem quebrar (Refactor)

Para cobertura retroativa:
1. Identificar os caminhos críticos do código
2. Priorizar: happy path → error cases → edge cases

### 3. Implementar os testes

- Um conceito por teste — nomes descritivos no formato `should_[behavior]_when_[context]`
- Usar o padrão AAA: Arrange, Act, Assert
- Isolar dependências externas com stubs/fakes e usar mocks só quando a interação for o comportamento sob teste
- Nunca testar implementação, testar comportamento

### 4. Executar e validar

```bash
# Rodar todos os testes
npm test / pytest / go test ./...

# Rodar com cobertura
npm test -- --coverage / pytest --cov
```

### 5. Revisar a cobertura

- Verificar `## Checklist de Cobertura` acima
- Identificar casos de borda não cobertos
- Adicionar testes de regressão para bugs corrigidos

## Exemplos

### Teste unitário (JavaScript/Jest)

```javascript
// ✅ Good: tests behavior, not implementation
describe('formatCurrency', () => {
  it('should format a positive BRL amount', () => {
    expect(formatCurrency(1234.56, 'BRL')).toBe('R$ 1.234,56')
  })

  it('should return "R$ 0,00" for zero', () => {
    expect(formatCurrency(0, 'BRL')).toBe('R$ 0,00')
  })

  it('should throw for a negative amount', () => {
    expect(() => formatCurrency(-1, 'BRL')).toThrow('Amount cannot be negative')
  })
})
```

### Teste de integração (Python/pytest)

```python
def test_create_user_should_persist_and_send_email(db_session, mock_email_service):
    # Arrange
    payload = {"email": "user@example.com", "name": "Test User"}

    # Act
    response = client.post("/users", json=payload)

    # Assert
    assert response.status_code == 201
    assert db_session.query(User).filter_by(email=payload["email"]).first()
    mock_email_service.send_welcome.assert_called_once_with(payload["email"])
```
