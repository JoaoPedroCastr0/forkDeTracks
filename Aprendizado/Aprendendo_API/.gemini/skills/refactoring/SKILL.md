---
name: refactoring
description: Use para melhorar código existente sem alterar comportamento, identificando code smells, simplificando estrutura e validando com testes.
triggers:
  - "melhorar código existente sem alterar comportamento"
  - "identificar e eliminar code smells"
  - "extrair módulos, simplificar funções ou reduzir acoplamento"
license: MIT
---

# Refactoring

## Quando Usar

- Melhorar legibilidade ou manutenibilidade de código existente
- Reduzir complexidade ou duplicação
- Preparar código para receber nova feature
- Corrigir code smells identificados em review
- Quando decidir entre refatorar e reescrever

## Regra de Ouro

> **Refatorar = mudar estrutura SEM mudar comportamento.**
> Se o comportamento muda, não é refatoração — é alteração funcional.

Testes **devem passar** antes, durante e depois de cada passo.

## Code Smells — Catálogo

### Complexidade

| Smell | Sintoma | Refatoração |
|-------|---------|-------------|
| **Função longa** | > 20-30 linhas, múltiplas responsabilidades | Extract Function |
| **Classe grande** | > 300 linhas, muitos métodos não relacionados | Extract Class |
| **Nested conditions** | 3+ níveis de if/else aninhados | Guard Clauses, Extract Function |
| **Switch/case extenso** | Switch com muitos cases | Replace with Polymorphism, Strategy |
| **Parâmetros demais** | Função com 4+ parâmetros | Introduce Parameter Object |

### Duplicação

| Smell | Sintoma | Refatoração |
|-------|---------|-------------|
| **Código duplicado** | Blocos idênticos ou quase idênticos | Extract Function, Template Method |
| **Feature envy** | Método usa mais dados de outra classe | Move Method |
| **Data clumps** | Grupo de dados que sempre aparecem juntos | Extract Class, Introduce Parameter Object |

### Acoplamento

| Smell | Sintoma | Refatoração |
|-------|---------|-------------|
| **God class** | Uma classe sabe tudo e faz tudo | Extract Class, Delegate |
| **Inappropriate intimacy** | Classes acessam internos uma da outra | Move Method, Extract Interface |
| **Middle man** | Classe que só delega para outra | Remove Middle Man, Inline Class |
| **Shotgun surgery** | Uma mudança exige alterar muitos arquivos | Move Method, Inline Class |

### Nomenclatura

| Smell | Sintoma | Refatoração |
|-------|---------|-------------|
| **Nome genérico** | `data`, `info`, `temp`, `result`, `manager` | Rename (usar nome do domínio) |
| **Nome inconsistente** | Mesmo conceito com nomes diferentes | Rename (padronizar) |
| **Abreviação obscura** | `usrMgr`, `procHndlr` | Rename (nome completo) |

## Padrões de Refatoração

### Extract Function

```
// Antes
function processOrder(order) {
  // validar
  if (!order.items.length) throw new Error("Empty");
  if (!order.customer) throw new Error("No customer");
  
  // calcular total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.qty;
  }
  
  // aplicar desconto
  if (total > 100) total *= 0.9;
  
  return { total, status: "processed" };
}

// Depois
function processOrder(order) {
  validateOrder(order);
  const total = calculateTotal(order.items);
  const finalTotal = applyDiscount(total);
  return { total: finalTotal, status: "processed" };
}
```

### Guard Clauses

```
// Antes — nested pyramid
function getDiscount(customer) {
  if (customer) {
    if (customer.active) {
      if (customer.orders > 10) {
        return 0.2;
      } else {
        return 0.1;
      }
    }
  }
  return 0;
}

// Depois — flat, legível
function getDiscount(customer) {
  if (!customer) return 0;
  if (!customer.active) return 0;
  if (customer.orders > 10) return 0.2;
  return 0.1;
}
```

### Replace Magic Numbers

```
// Antes
if (response.status === 429) { ... }
if (retryCount > 3) { ... }

// Depois
const HTTP_TOO_MANY_REQUESTS = 429;
const MAX_RETRIES = 3;

if (response.status === HTTP_TOO_MANY_REQUESTS) { ... }
if (retryCount > MAX_RETRIES) { ... }
```

## Ordem Segura de Refatoração

1. **Garantir testes passando** — nunca refatorar sem testes verdes
2. **Registrar ponto de rollback** — usar commit existente, branch ou snapshot permitido pela política do repositório
3. **Um passo pequeno por vez** — cada mudança isolada e testável
4. **Rodar testes após cada passo** — feedback contínuo
5. **Registrar progresso incremental** — manter diffs pequenos e rastreáveis; só commitar quando autorizado ou quando a política do repositório permitir
6. **Nunca misturar** refatoração com mudança funcional no mesmo commit

## Quando Refatorar vs Reescrever

| Cenário | Decisão |
|---------|---------|
| Código funciona, mas é difícil de manter | **Refatorar** |
| Testes existem e cobrem bem o comportamento | **Refatorar** |
| Nenhum teste, comportamento não documentado | **Escrever testes primeiro**, depois refatorar |
| Arquitetura fundamentalmente errada | **Reescrever** (com spec e testes novos) |
| Tecnologia obsoleta (framework morto, linguagem legada) | **Reescrever** |
| Custo de entender > custo de reescrever | **Reescrever** |

## Checklist Pré-Refatoração

- [ ] Testes existem e passam
- [ ] Comportamento atual é entendido e documentado
- [ ] Escopo da refatoração é definido (quais smells atacar)
- [ ] Mudanças funcionais estão separadas da refatoração
- [ ] Ponto de rollback (commit ou branch) criado

## Checklist Pós-Refatoração

- [ ] Todos os testes continuam passando
- [ ] Nenhum comportamento foi alterado
- [ ] Build e lint passando
- [ ] Código mais legível ou mais simples que antes
- [ ] Commits pequenos e descritivos

## Passos

### 1. Garantir cobertura de testes antes de começar

**Nunca refatorar sem testes.** Se não houver testes:
1. Escrever testes caracterizando o comportamento atual (Characterization Tests)
2. Validar que os testes passam com o código atual
3. Só então iniciar a refatoração

### 2. Identificar code smells

Usar o `## Code Smells — Catálogo` abaixo para mapear o que precisa ser melhorado.
Priorizar por: impacto na manutenibilidade × risco de quebra.

### 3. Aplicar refatorações atômicas

Seguir a `## Ordem Segura de Refatoração`:
- Uma refatoração por vez
- Rodar os testes após cada mudança
- Registro incremental por refatoração (diff pequeno, fácil de reverter, com commit só quando permitido)

### 4. Usar padrões do catálogo

Consultar `## Padrões de Refatoração` para o padrão correto:
- Extract Method/Function para código duplicado
- Rename para nomes que não revelam intenção
- Extract Variable para expressões complexas

### 5. Validar o resultado

- Todos os testes passando
- Cobertura mantida ou melhorada
- Completar o `## Checklist Pós-Refatoração` antes de abrir PR

## Exemplos

### Extract Method

```python
# ❌ Before: coupled and duplicated logic
def process_order(order):
    total = 0
    for item in order.items:
        price = item.price * item.quantity
        if item.quantity > 10:
            price *= 0.9  # 10% discount
        total += price
    order.total = total
    order.status = "processed"
    db.save(order)

# ✅ After: single responsibility, easier to test
def calculate_total(items):
    return sum(calculate_item_price(item) for item in items)

def calculate_item_price(item):
    price = item.price * item.quantity
    return price * 0.9 if item.quantity > 10 else price

def process_order(order):
    order.total = calculate_total(order.items)
    order.status = "processed"
    db.save(order)
```

### Rename Variable

```typescript
// ❌ Before: names with no meaning
const d = new Date()
const u = await db.findOne({ id: req.params.id })
const r = u.role === 'admin'

// ✅ After: clear intent
const currentDate = new Date()
const user = await db.findOne({ id: req.params.id })
const isAdmin = user.role === 'admin'
```
