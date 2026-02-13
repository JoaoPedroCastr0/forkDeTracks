# Meu repositorio

O que é git? 

Git é uma ferramenta muito utilizada por desenvolvedores para controle de versionamento de código.

-----------------------------------------------------------------------
Comandos:

- git init para dar inicio ao repositorio local 

- git remote add <URL_DO_REP_REMOTO> : Para apontar para o repositorio REMOTO. 

- echo "conteudo de texto" > nome_do_arquivo (linux)

- Git status: Comando responsável por dizer quais arquivos foram ALTERADOS e posteriormente prontos para realização de um commit, sinalizando também quais arquivos NÃO FORAM RASTREADOS. 

- Git diff: Comando responsável por sinalizar o que foi ADICIONADO ou REMOVIDO.

- Git config --list: Comando responsável listar as configurações do repositório. 

- Git log --online --graph --decorate --all: Observar commits realizados.

- ssh -T git@github.com : Verificador de chave SSH, retornando mensagem de Boas vindas, caso esteja tudo ok.

- git push --set-upstream origin main : Para que a branch local aponte para a remota escolhida. 

- git remote -v : para listar todos os repositorios remotos que estão sendo apontados 

- git fetch : para visualizar o que tem no repositorio remoto 

# Principais

1 git init

2 git remote add origin https://github.com/usuario/repo.git

3 git add .

4 git commit -m "primeiro commit"

5 git push --set-upstream origin main


Por que o primeiro push é diferente?

Porque é a primeira vez que esse relacionamento está sendo criado.

Quando você roda:

git push --set-upstream origin main


Você está dizendo:

“Essa branch main local SEMPRE vai conversar com main lá no origin.”

A partir daí, o Git grava isso internamente.


git fetch 

git pull

git push


