---
name: web-research
description: Use para buscar documentação oficial, validar informação técnica em fonte primária e comparar versões, APIs ou tecnologias com evidências.
triggers:
  - "buscar documentação oficial de library/framework"
  - "validar informação técnica em fonte primária"
  - "comparar versões de APIs ou sintetizar múltiplas fontes"
license: MIT
---

# Web Research

## Quando Usar

- Verificar o comportamento correto de uma API em versão específica
- Encontrar documentação oficial de uma biblioteca, protocolo ou padrão
- Validar uma prática técnica com evidências reais (não só com código de exemplo)
- Comparar opções de tecnologia com dados objetivos
- Atualizar-se sobre mudanças em specs, deprecações ou breaking changes

## Hierarquia de Fontes

Sempre consumir na ordem abaixo — só descer se a fonte superior não responder:

| Nível | Tipo | Exemplos |
|-------|------|---------|
| 1 | Documentação oficial do mantenedor | docs.python.org, developer.mozilla.org, redis.io |
| 2 | Specs abertas e RFCs | RFC 9110, W3C specs, IETF drafts, OpenAPI spec |
| 3 | Changelogs e release notes oficiais | GitHub releases, CHANGELOG.md do repo oficial |
| 4 | Artigos técnicos com autoria verificável | engineering blogs (Stripe, Netflix, Cloudflare) |
| 5 | Stack Overflow | Apenas para diagnosticar sintomas e erros |
| 6 | GitHub (outros repos) | Para ver implementações — nunca como fonte de verdade |

> ⚠️ Blog posts, tutoriais e README de terceiros **não são fontes primárias** — sempre verificar na documentação oficial.

## Framework de Query

### Formular antes de buscar

Responder às seguintes perguntas antes de abrir o browser:

1. **Pergunta exata:** O que preciso saber? (não "como usar X" mas "qual é o comportamento de X quando Y acontece")
2. **Versão relevante:** Qual versão do software, linguagem ou protocolo é aplicável?
3. **Tipo de informação:** É estável (spec) ou muda com versão (comportamento padrão)?
4. **Site-alvo:** Qual é a documentação oficial deste componente?

### Queries eficientes

```
# Busca no site oficial
site:docs.rust-lang.org lifetime borrow checker

# Busca por versão específica
python 3.11 asyncio.gather exception handling

# Busca por comportamento específico
postgresql 16 JSONB index performance

# Busca por mudança em versão
react 18 concurrent mode breaking changes
```

## Passos

### 1. Identificar a fonte oficial

Para qualquer tecnologia:
- Procurar o domínio oficial (docs.X.com, X.io/docs, developer.X.com)
- Verificar se há uma landing de documentação centralizada
- Confirmar que é o site do mantenedor — não de tutorial ou wrapper

### 2. Navegar pela documentação

- Usar o índice ou search da própria documentação
- Verificar a versão da documentação (muitos sites têm docs por versão)
- Identificar se o comportamento é estável ou foi modificado

### 3. Coletar evidências

Para cada ponto de informação, registrar:

```markdown
**Fonte:** [URL completa]
**Versão documentada:** [ex: Python 3.11, Redis 7.2]
**Trecho relevante:** "[citação literal da documentação]"
**Contexto:** [o que essa informação responde]
```

### 4. Avaliar credibilidade

Checklist para cada fonte:

- [ ] É o site oficial do mantenedor ou autor original?
- [ ] A versão documentada bate com a versão em uso no projeto?
- [ ] A data de publicação é relevante para o contexto?
- [ ] Se é artigo de terceiro: o autor tem histórico verificável na área?
- [ ] Há contradição com a documentação oficial? (se sim, a oficial prevalece)

### 5. Sintetizar com rastreabilidade

Estrutura de entrega:

```markdown
## Resultado da Pesquisa: [pergunta original]

### Resposta direta
[Resposta objetiva em 1-3 frases]

### Evidências
**Fonte 1:** [URL]
> "[trecho literal]"

**Fonte 2:** [URL]
> "[trecho literal]"

### Limitações e incertezas
- [O que não foi possível confirmar]
- [Divergências entre fontes]
- [Comportamento que pode variar por versão]

### Recomendação
[O que fazer com base nas evidências]
```

## Avaliação de Fontes — Red Flags

| Sinal | Interpretação |
|-------|---------------|
| "Aprendi que..." sem link | Sem evidência — verificar |
| Tutorial de blog sem data | Pode ser desatualizado |
| README de repo não-oficial | Pode não refletir o comportamento atual |
| "Todo mundo usa..." | Popularidade ≠ correção |
| Código de exemplo sem versão | Comportamento pode ter mudado |
| Apenas uma fonte para claim crítico | Buscar confirmação independente |

## Checklist de Validação

- [ ] Pergunta original está claramente formulada
- [ ] Fonte do nível 1 ou 2 foi consultada quando disponível
- [ ] A versão da documentação corresponde à versão em uso
- [ ] Cada claim tem URL de fonte registrada
- [ ] Incertezas e limitações estão documentadas
- [ ] Síntese está separada das citações literais
- [ ] Recomendação está baseada em evidências, não em opinião

## Exemplos

### Busca de comportamento de API

**Pergunta:** O `fetch` cancela a requisição ao abortar o AbortController?

```
Query: site:developer.mozilla.org AbortController fetch cancel request
Fonte: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
Trecho: "Calling AbortController.abort() causes the request to be aborted immediately."
```

### Busca de mudança de versão

**Pergunta:** O `asyncio.gather` no Python 3.11 mudou o comportamento de exceções?

```
Query: python 3.11 asyncio.gather exception propagation changelog
Fonte: https://docs.python.org/3/whatsnew/3.11.html
Fonte: https://docs.python.org/3/library/asyncio-task.html#asyncio.gather
```
