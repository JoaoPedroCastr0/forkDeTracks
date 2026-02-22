# Workflow de CI / "Orquestrador de execução"

- Wokflow

Um Workflow é um arquivo de configuração(.yml) presente em .github/workflow(padrão) , que é interpretado pelo Github Actions, ele se torna extremamente poderoso, pois pode definir: Oque executar(jobs/steps) | Quando executar(on) | em qual ambiente executar(runs-on). 

- CI(Continuos Integration). 

Continuous Integration é uma espécie de "automação" que verifica, valida e integra qualquer mudança no codigo, antes de ser inserido no código principal,  ele é sempre executado ao lado de PRs e Push's.

Sem CI:

cada merge é um risco.

Com CI:

main sempre em estado válido, pois existe um conjunto de checagens automáticos, auxiliando a decisão de um MERGE.









