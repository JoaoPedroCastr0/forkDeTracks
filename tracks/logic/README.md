# Lógica de Programação e Estruturas de Dados Básicas

## Objetivo
- Fornecer base prática em lógica e estruturas de dados para ingressar nas trilhas de frontend e backend.
- Priorizar raciocínio algorítmico, leitura de código e resolução de problemas.

## O que aprender
- Conceitos: variáveis, tipos, expressões e operadores.
- Fluxo de controle: `if/else`, `switch`, loops (`for`, `while`).
- Funções: parâmetros, retorno, escopo.
- Estruturas básicas: arrays, strings, pilha, fila e conceito de lista ligada.
- Algoritmos simples: busca linear, busca binária, ordenações básicas (bubble/insertion).
- Noções de complexidade (O-notation) e trade-offs.

## Formato da trilha

Cada nível contém: objetivo, exercícios obrigatórios, critérios de aceitação, dicas de estudo e um mini-desafio de debugging.

### Nível 1 — Fundamentos
- Breve: dominar sintaxe, controle de fluxo e pequenos scripts práticos.
- Arquivo: [Nível 1 — Fundamentos](./nivel-1-fundamentos.md)

### Nível 2 — Estruturas e problemas
- Breve: implementar e testar estruturas básicas (Stack, Queue) e manipulação de strings/arrays.
- Arquivo: [Nível 2 — Estruturas e problemas](./nivel-2-estruturas.md)

### Nível 3 — Algoritmos e análise
- Breve: implementar algoritmos clássicos, medir desempenho e documentar trade-offs.
- Arquivo: [Nível 3 — Algoritmos e análise](./nivel-3-algoritmos.md)

## Como estudar (dicas práticas)
- Codifique diariamente: 30–60 minutos focados em exercícios.
- Trace exemplos à mão antes de codar.
- Implemente estruturas do zero (ex.: linked list em TypeScript).
- Use o debugger do VS Code e prints controlados para aprendizado.
- Faça PRs pequenos e peça revisão de um colega.
- Resolva problemas em Beecrowd, HackerRank ou LeetCode (nível fácil/médio).

## Recursos recomendados
- Curso introdutório (gratuito): Gustavo Guanabara — Fundamentos de Programação
  - https://youtube.com/playlist?list=PLHz_AreHm4dmSj0MHol_aoNYCSGFqvfXV
- Ferramentas: VS Code, Node/Bun para scripts; extensões JS/TS para debugging.

## Exercícios sugeridos
- Nível 1: FizzBuzz, cálculo de média, validação simples de entrada.
- Nível 2: Implementar `Stack` e `Queue`, inverter string sem library.
- Nível 3: Implementar busca binária e bubble sort; comparar tempos em arrays pequenos.

## Checklist para PR
- Código funciona localmente e testes simples passam.
- `README.md` curto com instruções para reproduzir exercícios.
- Branch: `feat/logic-level-<n>`.
- Commit: verbo no imperativo (ex.: "Add exercícios Nível 1 de lógica").
- Peer review recebido de pelo menos 1 colega.

---
Resumo: use o curso do Guanabara como base teórica e pratique implementando e debugando soluções; documente cada exercício e peça revisão via PR.
