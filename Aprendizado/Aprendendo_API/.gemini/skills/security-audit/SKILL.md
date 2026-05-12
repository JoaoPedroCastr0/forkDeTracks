---
name: security-audit
description: Use para auditar código, dependências e configurações por vulnerabilidades, cobrindo OWASP, auth, secrets, headers e classificação de severidade.
triggers:
  - "auditar código por vulnerabilidades OWASP"
  - "revisar dependências por CVEs ou configurações inseguras"
  - "gerar relatório de segurança com classificação de severidade"
license: MIT
---

# Security Audit

## Quando Usar

- Auditar código novo ou existente por vulnerabilidades
- Verificar dependências por CVEs conhecidos
- Avaliar configurações de segurança (headers, CORS, CSP)
- Revisar autenticação e autorização
- Preparar relatório de segurança para compliance

## OWASP Top 10 — Checklist Detalhado

### 1. Injection (SQLi, NoSQLi, Command, XPath)

**Verificar:**
- Todo input externo é validado antes de usar?
- Queries usam prepared statements ou ORM (nunca concatenação)?
- Comandos shell recebem input sanitizado?
- Headers e cookies são tratados como input externo?

**Ferramentas:**
```bash
# Análise estática por linguagem
semgrep --config "p/owasp-top-ten" .
```

### 2. Autenticação Quebrada

**Verificar:**
- Senhas com hash seguro (bcrypt, argon2 — nunca MD5/SHA1)?
- Sessões com expiração configurada?
- Tokens JWT com secret forte e expiração?
- Brute force protegido (rate limiting, lockout)?
- MFA disponível para operações críticas?

### 3. Exposição de Dados Sensíveis

**Verificar:**
- Dados em trânsito: TLS/HTTPS obrigatório?
- Dados em repouso: criptografia quando necessário?
- Logs sem PII (email, CPF, tokens, senhas)?
- Secrets em variáveis de ambiente (nunca no código)?
- `.env` no `.gitignore`?

### 4. XML External Entities (XXE)

**Verificar:**
- Parsers XML com external entities desabilitados?
- Input XML validado antes de processar?

### 5. Controle de Acesso Quebrado

**Verificar:**
- IDOR (Insecure Direct Object Reference) — pode acessar recurso de outro usuário?
- Escalação de privilégio — usuário comum pode acessar admin?
- Endpoints sensíveis protegidos por middleware de auth?
- CORS configurado restritivamente (não `*`)?

### 6. Misconfiguration de Segurança

**Verificar:**
- Debug desabilitado em produção?
- Headers de segurança presentes?
  ```
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: [política restritiva]
  ```
- Default credentials removidas?
- Diretórios de listagem desabilitados?

### 7. Cross-Site Scripting (XSS)

**Verificar:**
- Output sanitizado antes de renderizar (escape HTML)?
- Framework com auto-escaping habilitado?
- `dangerouslySetInnerHTML` / `v-html` / `innerHTML` — justificado e sanitizado?
- CSP configurado para mitigar XSS?

### 8. Deserialização Insegura

**Verificar:**
- Input deserializado com validação de schema?
- Sem `eval()`, `pickle.loads()` ou equivalentes em input externo?
- JSON Schema ou Zod/Yup para validação de estrutura?

### 9. Componentes Vulneráveis

**Verificar por stack:**
```bash
# JavaScript/Node.js
npm audit
npx audit-ci --moderate

# Python
pip-audit
safety check

# Go
govulncheck ./...

# Ruby
bundle audit check --update

# Java
mvn dependency-check:check

# Rust
cargo audit
```

### 10. Logging e Monitoramento Insuficientes

**Verificar:**
- Falhas de autenticação são logadas?
- Acesso a dados sensíveis é logado?
- Logs não contêm dados sensíveis (senhas, tokens)?
- Alertas configurados para anomalias (rate de erros, acessos incomuns)?

## Classificação de Severidade

| Severidade | Critério | Ação Requerida |
|------------|----------|----------------|
| 🔴 **CRÍTICO** | RCE, SQLi, exposição de secrets, bypass de auth | Parar tudo, corrigir imediatamente |
| 🟠 **ALTO** | XSS stored, IDOR, dados sensíveis expostos | Corrigir antes do próximo deploy |
| 🟡 **MÉDIO** | CORS permissivo, headers faltando, logs insuficientes | Priorizar no backlog |
| 🟢 **BAIXO** | Hardening, boas práticas não seguidas | Incluir como recomendação |

## Template de Relatório

```markdown
## Relatório de Segurança

**Escopo:** [módulos/arquivos/PRs auditados]
**Data:** YYYY-MM-DD
**Auditor:** @engine

### Resumo Executivo
[X] findings: [N] críticos, [N] altos, [N] médios, [N] baixos

### Findings Críticos 🔴
| # | Arquivo:Linha | Tipo | Descrição | Impacto | Recomendação |
|---|---------------|------|-----------|---------|--------------|
| 1 | `auth.ts:42` | SQLi | Query concatenada | RCE | Usar parameterized query |

### Findings Altos 🟠
[mesma tabela]

### Findings Médios 🟡
[mesma tabela]

### Recomendações de Hardening 🟢
[lista de melhorias não urgentes]

### Dependências Vulneráveis
| Pacote | Versão | CVE | Severidade | Versão Corrigida |
|--------|--------|-----|------------|------------------|

### Próximos Passos
[ações recomendadas com prioridade]
```

## Checklist Rápido Pré-Deploy

- [ ] `npm audit` / `pip-audit` / equivalente sem findings críticos
- [ ] Sem secrets no código ou em logs
- [ ] HTTPS obrigatório
- [ ] Headers de segurança configurados
- [ ] CORS restritivo
- [ ] Rate limiting em endpoints de auth
- [ ] Input validation em todas as fronteiras

## Passos

### 1. Definir escopo da auditoria

- Listar os arquivos, módulos ou PRs a auditar
- Identificar a stack (linguagem, frameworks, banco de dados)
- Verificar se há dependências de terceiros a analisar

### 2. Análise de dependências

```bash
# Node.js
npm audit

# Python
pip-audit / safety check

# Ruby
bundle audit

# Java/Maven
mvn dependency-check:check
```

### 3. Auditoria de código — OWASP Top 10

Usar o `## OWASP Top 10 — Checklist Detalhado` abaixo para revisar o código.
Focar primeiro nas vulnerabilidades de maior impacto (Injection, Auth, Exposure).

### 4. Análise de secrets e configurações

```bash
# Search for hardcoded secrets
rg -n -i "(password|secret|api[_-]?key|token)" --glob "*.{js,py,go,ts}" .

# Check whether .env was ever versioned
git log --all --full-history -- .env
```

### 5. Gerar relatório

Usar o `## Template de Relatório` abaixo.
Classificar cada finding por severidade (🔴 Crítico → 🟢 Baixo).
Incluir recomendação concreta e prazo sugerido.
