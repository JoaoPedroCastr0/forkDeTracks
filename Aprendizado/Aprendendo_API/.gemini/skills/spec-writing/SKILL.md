---
name: spec-writing
description: Use para produzir ADR, tech spec, architecture notes ou análise técnica persistente antes de implementar mudanças importantes.
triggers:
  - "documentar decisão arquitetural (ADR)"
  - "escrever tech spec ou architecture notes de componente novo"
  - "registrar análise técnica de impacto cross-cutting"
license: MIT
---

# Spec Writing

## Quando Usar

- Para registrar decisões arquiteturais importantes (ADR)
- Para especificar um componente novo ou redesign significativo (Tech Spec)
- Para documentar análises, clarificações ou decisões menores (Architecture Notes)
- Sempre que uma decisão precisar ser comunicada à sessão principal, ao usuário ou ao time

## Escolhendo o Formato

| Formato | Quando usar | Critério de impacto |
|---------|-------------|---------------------|
| **ADR** | Decisão cross-cutting, difícil de reverter, longo prazo | Afeta múltiplos módulos ou todo o sistema |
| **Tech Spec** | Componente novo, redesign significativo, integração externa | Afeta um módulo ou serviço específico |
| **Architecture Notes** | Análises, clarificações, padrões, pequenas decisões | Afeta uma área localizada |

**Regra prática:** se você hesitou mais de 5 minutos na decisão, é ADR ou Tech Spec.

## Passos

### 1. Determinar o formato

Com base no critério acima, escolher ADR, Tech Spec ou Architecture Notes.

### 2. Determinar onde salvar

Identificar onde o projeto organiza documentação técnica. Convenções comuns:
- ADRs: `docs/decisions/`, `docs/adr/`, `architecture/decisions/` (numerados: `0001-nome-da-decisao.md`)
- Tech Specs e Architecture Notes: `docs/`, `docs/architecture/`, ou diretório equivalente

Se não existir estrutura de documentação, criar e documentar a convenção adotada.

### 3. Redigir o documento

Usar o template correspondente em `references/`:
- `adr-template.md` → para ADRs
- `tech-spec-template.md` → para Tech Specs
- `architecture-notes-template.md` → para Architecture Notes

### 4. Registrar alternativas rejeitadas

**Obrigatório em qualquer formato:** documentar as alternativas consideradas e por que foram rejeitadas.
Sem isso, a decisão não tem contexto histórico e tende a ser revertida por erro no futuro.

### 5. Comunicar o output

Reportar à sessão principal (ou ao usuário):
- Qual arquivo foi criado/atualizado
- O que mudou
- Se outros documentos de arquitetura do projeto precisam ser atualizados
- Quais próximos passos dependem desse documento

## Referências

- `references/adr-template.md` — template de ADR
- `references/tech-spec-template.md` — template de Tech Spec
- `references/architecture-notes-template.md` — template de Architecture Notes
- Exemplos inline nesta própria skill — usar a seção `## Exemplos` abaixo como referência preenchida
- `patterns/common-patterns.md` — catálogo de padrões arquiteturais para referência

## Checklist de validação

- [ ] Tipo correto escolhido: ADR para decisão arquitetural, Tech Spec para componente novo, Architecture Notes para análise
- [ ] Problema declarado com clareza (o que, por que agora)
- [ ] Alternativas consideradas (mínimo 2-3 opções avaliadas)
- [ ] Decisão justificada com tradeoffs explícitos
- [ ] Critérios de aceite escritos e verificáveis
- [ ] Dependências e riscos mapeados
- [ ] Stakeholders relevantes revisaram antes de publicar
- [ ] Documento armazenado no local correto do repositório

## Exemplos

### ADR — Decisão de autenticação

```markdown
# ADR-001: Autenticação via JWT com refresh token

**Status:** Aceito  
**Data:** 2024-01-15  
**Decisores:** sessão principal, liderança técnica

## Contexto

A aplicação precisa autenticar usuários em múltiplos clients (web, mobile, CLI).
Sessões server-side criariam acoplamento e dificultariam o scale horizontal.

## Decisão

Usar JWT de curta duração (15min) + refresh token de longa duração (30 dias) 
armazenado em cookie HttpOnly.

## Alternativas Consideradas

| Alternativa | Prós | Contras |
|-------------|------|---------|
| Sessão server-side | Simples de implementar | Dificulta scale horizontal |
| OAuth2 externo | Não gerencia credenciais | Dependência de terceiros |
| **JWT + refresh** | Stateless, multi-client | Maior complexidade de implementação |

## Consequências

- ✅ Scale horizontal sem sticky sessions
- ✅ Funciona em web, mobile e CLI
- ⚠️ Revogação de tokens requer lista de bloqueio (Redis)
```
