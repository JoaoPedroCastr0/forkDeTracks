# Nível 2 — Estruturas de Dados e Manipulação

Objetivo
- Implementar e utilizar estruturas de dados básicas (Stack/Queue) e manipular strings/arrays sem helpers prontos.

Passo a passo didático
1. Revise arrays e operações básicas (push/pop, shift/unshift, slice).
2. Escreva pseudocódigo para `Stack` e `Queue` antes de implementar.
3. Implemente as estruturas em TypeScript/JavaScript e escreva testes unitários.

Exercícios obrigatórios
- Implementar `Stack`
  - Métodos: `push(item)`, `pop()`, `peek()`, `isEmpty()`.
  - Critério: não usar `Array.prototype.reverse` para operações de implementação de comportamento de pilha (usar array como base com push/pop ok).
  - Testes: empilhar e desempilhar múltiplos elementos, comportamento quando vazia.

- Implementar `Queue`
  - Métodos: `enqueue(item)`, `dequeue()`, `peek()`, `isEmpty()`.
  - Critério: garantir ordem FIFO e testes para bordas.

- Inverter string sem library
  - Enunciado: implementar função que recebe string e retorna invertida sem usar `split`+`reverse`+`join`.
  - Hints: usar loop decrescente ou `Stack`.

Critérios de aceitação
- Código documentado com comentários curtos.
- Testes unitários cobrindo comportamento normal e casos de borda.
- Documentar complexidade (O-notation) de cada operação.

Dicas e práticas
- Implemente e depois refatore: comece simples, depois extraia helper functions.
- Use asserts para validar invariantes (por exemplo: tamanho da pilha após operações).

Mini-desafio de debugging
- Crie um caso onde `dequeue` remove o elemento errado por erro de índice; pratique reproduzir e corrigir o bug usando breakpoints.

Sugestão de entrega
- Pasta `level-2/` com `stack.ts`, `queue.ts`, `reverseString.ts`, `tests/` e `README.md` com instruções.
