#  Comandos úteis

- git checkout main(1);

Ocorre o direcionamento para a branch main(principal).

É útil pois a feature irá se inicar a partir da VERSÃO MAIS ATUAL do código.

- git pull origin main(2);

Realiza ATUALIZAÇÃO da branch local com o que está no repositório remoto(origin). "Puxe tudo que está no remoto para a local".
Obs: o que esta no local não irá ser substituído, ira ocorrer uma "mistura".

Utilidade: uma feature não será criada em cima de código desatualizado.

- git checkout -b feature/"nome-da-feature"(3);

Criação de uma nova branch(do tipo feature), ja direcionando para a mesma.

Utilidade: Os commits feitos não afetarão a main, o trabalho é isolado e com segurança, após o trabalho , um Pull Request pode ser aberto para juntar isso à main.