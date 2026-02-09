# Comandos 

- Merge

O ato de juntar o código de duas branchs.

preserva história real.

Situação:

A---B---C  (main)
     \
      D---E  (feature)


Após merge:

A---B---C------F  (main)
     \        /
      D------E

- REBASE

Reescreve a história, organizando a "arvore" (sequencia de commits).

Antes:

A---B---C  (main)
     \
      D---E  (feature)


Depois de rebase main:

A---B---C---D'---E'  (feature)

- Atenção 

Nunca fazer rabse em branch COMPARTILHADA, pois quebra:

PRs

histórico de outros devs

confiança do time

Regra de ouro:

Rebase só em branch que é só sua.









