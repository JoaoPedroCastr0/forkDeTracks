# Nível 3 — Algoritmos e Análise

Objetivo
- Implementar algoritmos clássicos (busca/ordenação), medir comportamento e escolher soluções adequadas para inputs pequenos/médios.

Passo a passo didático
1. Revise conceitos de complexidade (O(n), O(log n), O(n^2)).
2. Implemente algoritmos em código claro e com comentários.
3. Meça tempos e escreva observações no README do exercício.

Exercícios obrigatórios
- Busca binária
  - Implementar versão iterativa (e opcionalmente recursiva).
  - Critério: função recebe array ordenado e valor; retorna índice ou -1.
  - Testes: busca presente, ausência e bordas (primeiro/último índice).

- Bubble sort (ou outra ordenação simples)
  - Implementar e provar que o array fica ordenado.
  - Medir tempo médio para arrays com 100 e 1000 elementos (rodar múltiplas vezes e tirar média).

- Projeto final pequeno
  - Resolver 10 problemas (fácil→médio) e documentar solução, complexidade e trade-offs.

Critérios de aceitação
- Testes automatizados para cada algoritmo.
- Comparação de tempos com observações no `README.md` do exercício.
- PR com checklist e revisão por colega.

Dicas e práticas
- Para medir, use `performance.now()` e repita execuções para reduzir ruído.
- Explique por que uma ordenação O(n^2) pode ser aceitável para listas pequenas.

Mini-desafio de debugging
- Forneça um array já ordenado e observe se a implementação de sorting altera o array indevidamente (bug de inplace vs copy).

Sugestão de entrega
- Pasta `level-3/` com `binarySearch.ts`, `bubbleSort.ts`, scripts de medição, testes e `README.md` com análise.
