# Nível 1 — Fundamentos

Objetivo
- Entender sintaxe básica, tipos, operadores e controle de fluxo.
- Ser capaz de escrever pequenos scripts que validam e processam entradas.

Passo a passo didático
1. Leia/assista o módulo 1 do curso recomendado (Guanabara).
2. Configure um projeto simples com Node/Bun e TypeScript (opcional).
3. Execute exemplos no REPL/VS Code e brinque com var/let/const.
4. Resolva exercícios em pequena escala (30–60 min/dia).

Exercícios obrigatórios
- FizzBuzz
  - Enunciado: receba N (inteiro >=1) e imprima de 1 a N substituindo múltiplos de 3 por "Fizz", múltiplos de 5 por "Buzz" e ambos por "FizzBuzz".
  - Entradas de exemplo: 15 → ver sequência padrão.
  - Hints: use `%` (módulo) e verifique múltiplos de 15 primeiro.

- Cálculo de média
  - Enunciado: receber uma lista de notas (números) e retornar média, menor e maior nota.
  - Critério: se lista vazia, retornar mensagem de erro tratada.
  - Testes: 3 casos (lista normal, lista com um elemento, lista vazia).

- Validação simples de entrada
  - Enunciado: validar se uma string representa um número inteiro dentro de um intervalo (ex.: 0–100).
  - Critério: tratar tipos inválidos e espaços.

Atividades de aprendizagem e dicas
- Trace exemplos à mão: pegue N pequeno e simule o loop passo a passo.
- Escreva testes simples com `console.assert` ou `Vitest`.
- Dê commit por exercício usando branch `feat/logic-level-1`.

Mini-desafio de debugging
- Introduza intencionalmente um erro comum (ex.: usar `<=` em vez de `<`) e pratique localizar o bug com breakpoints.

Sugestão de entrega
- Pasta do exercício com `solution.js`/`solution.ts`, `README.md` do exercício e 3 testes.
