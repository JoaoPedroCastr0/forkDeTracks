# Plataforma de Ensino de Programação

##  Sobre o projeto

Este projeto consiste no desenvolvimento de uma **plataforma de ensino de programação**, criada para conectar um professor sênior de tecnologia a pessoas que desejam aprender e evoluir na área de desenvolvimento de software.

A ideia central é oferecer um ambiente onde o professor, como **proprietário e administrador da plataforma**, possa disponibilizar conteúdos educacionais estruturados em **cursos, aulas, trilhas de estudos e documentos**, enquanto os alunos podem se cadastrar, acessar os conteúdos disponíveis, realizar seus estudos e acompanhar seu progresso.

Mais do que uma simples aplicação de cursos, o projeto tem como objetivo construir uma plataforma que represente uma **jornada de aprendizagem em programação**, permitindo organizar diferentes conhecimentos e tecnologias em caminhos de estudo estruturados.

---

##  Objetivo

O principal objetivo é criar uma aplicação full stack completa, aplicando na prática conceitos de **engenharia de software, arquitetura, segurança, testes e desenvolvimento web**.

O projeto será desenvolvido desde sua concepção, passando por:

* levantamento do domínio;
* definição dos requisitos;
* modelagem das entidades;
* definição das regras de negócio;
* arquitetura da aplicação;
* desenvolvimento da API;
* desenvolvimento da interface;
* autenticação e autorização;
* persistência de dados;
* testes;
* containerização;
* CI/CD;
* observabilidade;
* revisão de segurança.

O foco não será apenas fazer a aplicação funcionar, mas compreender **por que cada decisão técnica foi tomada**.

---

##  Professor

O professor é o proprietário do sistema e possui privilégios administrativos.

Através da plataforma, poderá:

* criar e gerenciar cursos;
* criar e organizar aulas;
* criar trilhas de estudos;
* disponibilizar documentos e materiais;
* organizar conteúdos educacionais;
* acompanhar alunos;
* acompanhar matrículas;
* acompanhar o progresso dos alunos.

O professor representa a figura responsável pela **curadoria e organização do conhecimento disponibilizado na plataforma**.

---

##  Alunos

Qualquer pessoa interessada em aprender programação poderá se cadastrar na plataforma como aluno.

O aluno poderá:

* criar uma conta;
* autenticar-se;
* visualizar cursos disponíveis;
* conhecer trilhas de estudos;
* matricular-se em cursos;
* acessar conteúdos aos quais possui acesso;
* estudar as aulas;
* acessar documentos e materiais;
* marcar conteúdos como concluídos;
* acompanhar seu progresso.

---

##  Trilhas de estudos

Um dos conceitos centrais da plataforma são as **trilhas de estudos**.

Uma trilha representa uma jornada de aprendizagem organizada pelo professor, podendo reunir diferentes cursos, aulas e materiais.

Por exemplo:

```text
Trilha: Desenvolvedor Full Stack
│
├── Lógica de Programação
├── JavaScript
├── TypeScript
├── Git e GitHub
├── HTTP e APIs
├── Backend
├── Banco de Dados
├── React
└── Projeto Full Stack
```

A ideia é permitir que o aluno não apenas encontre conteúdos isolados, mas tenha uma **orientação estruturada sobre o que estudar e em qual sequência**.

---

##  Cursos e aulas

Os cursos representam conjuntos de conteúdos focados em determinado assunto.

Exemplo:

```text
Curso: Node.js e APIs REST
│
├── Aula 01 — Introdução ao Node.js
├── Aula 02 — Runtime e módulos
├── Aula 03 — HTTP
├── Aula 04 — Express
├── Aula 05 — APIs REST
├── Aula 06 — Banco de dados
└── Aula 07 — Autenticação
```

Cada curso poderá possuir diversas aulas organizadas pelo professor.

---

##  Documentos e materiais

O professor também poderá disponibilizar materiais complementares para os alunos.

Esses materiais poderão estar relacionados a cursos, aulas ou trilhas de estudos.

Exemplos:

* apostilas;
* guias de estudo;
* exercícios;
* documentação;
* checklists;
* materiais complementares;
* projetos práticos.

---

##  Progresso do aluno

A plataforma deverá permitir acompanhar a evolução do aluno durante sua jornada.

O progresso poderá estar relacionado a:

* aulas concluídas;
* cursos em andamento;
* cursos concluídos;
* trilhas de estudos;
* materiais estudados.

Exemplo:

```text
Curso: Node.js e APIs REST

████████████████░░░░ 80%

8 de 10 conteúdos concluídos
```

---

#  Arquitetura

O projeto será desenvolvido utilizando uma **arquitetura em camadas**, buscando manter responsabilidades bem definidas e reduzir o acoplamento entre os componentes.

A organização deverá seguir princípios como:

```text
HTTP
 │
 ↓
Routes
 │
 ↓
Controllers
 │
 ↓
Services
 │
 ↓
Repositories
 │
 ↓
Prisma
 │
 ↓
Database
```

Cada camada terá uma responsabilidade específica.

O objetivo é que decisões de negócio não fiquem acopladas ao framework HTTP ou diretamente à camada de persistência.

---

#  Stack

## Backend

* Bun
* TypeScript
* Express
* Prisma
* Zod

## Frontend

* React
* TypeScript
* Tailwind CSS
* shadcn/ui

## Banco de dados

* PostgreSQL
* Prisma Migrations

## Testes

* Vitest
* Playwright

## Infraestrutura

* Docker
* GitHub Actions
* CI/CD

## Qualidade e segurança

* Biome
* TypeScript strict
* Validação de dados
* Autenticação
* Autorização
* Práticas baseadas no OWASP Top 10
* Logs
* Observabilidade

---

#  Segurança

A segurança será considerada desde a concepção do sistema.

Entre os aspectos estudados e aplicados estarão:

* autenticação segura;
* armazenamento seguro de credenciais;
* autorização baseada em permissões;
* validação de dados;
* proteção de endpoints;
* gerenciamento de sessões/tokens;
* controle de acesso;
* proteção contra ataques comuns;
* gerenciamento de variáveis de ambiente;
* tratamento seguro de erros;
* segurança de dependências;
* princípios do OWASP Top 10.

A segurança não será tratada como uma etapa adicionada ao final do projeto, mas como parte da arquitetura da aplicação.

---

#  Estratégia de testes

O projeto utilizará diferentes níveis de testes.

### Testes unitários

Responsáveis por verificar unidades isoladas e principalmente regras de negócio.

### Testes de integração

Responsáveis por verificar a comunicação entre diferentes partes da aplicação, incluindo a persistência de dados.

### Testes E2E

Responsáveis por validar fluxos completos da perspectiva do usuário.

Exemplo:

```text
Cadastro
   ↓
Login
   ↓
Visualização de curso
   ↓
Matrícula
   ↓
Acesso à aula
   ↓
Conclusão da aula
   ↓
Atualização do progresso
```

O objetivo é possuir uma estratégia de testes que permita responder:

> **Quais comportamentos do sistema estão protegidos por testes e em qual nível?**

---

#  CI/CD

O projeto também terá uma pipeline de integração contínua para impedir que código com problemas avance para as próximas etapas.

Um fluxo esperado:

```text
Pull Request
     ↓
Lint
     ↓
Typecheck
     ↓
Testes
     ↓
Build
     ↓
E2E
     ↓
Deploy
```

A pipeline deverá funcionar como uma camada automatizada de qualidade do projeto.

---

#  Containerização

Docker será utilizado para padronizar o ambiente de desenvolvimento e facilitar a execução dos serviços necessários.

A containerização também será utilizada como oportunidade de compreender:

* imagens;
* containers;
* redes;
* volumes;
* variáveis de ambiente;
* comunicação entre serviços;
* diferenças entre ambientes de desenvolvimento e produção.

---

#  Observabilidade

O projeto também terá preocupação com a capacidade de investigar problemas após a aplicação estar em execução.

Serão estudados e aplicados conceitos como:

* logs estruturados;
* níveis de log;
* identificação de requisições;
* tratamento de erros;
* métricas;
* monitoramento;
* alertas.

O objetivo é conseguir responder:

> **"Se algo der errado em produção, temos informações suficientes para entender o que aconteceu?"**

---

#  Objetivo técnico do projeto

Este projeto também funciona como um **laboratório prático de engenharia de software**.

A intenção é desenvolver a aplicação entendendo e documentando decisões como:

> "Essa é a arquitetura que escolhi."

> "Essas são as responsabilidades de cada camada."

> "Essas são as regras de negócio."

> "Essas operações utilizam transação por causa disso."

> "Essa autenticação funciona dessa forma."

> "Essas são as ameaças consideradas."

> "Esses testes cobrem esses cenários."

> "Esse pipeline impede código quebrado de chegar ao deploy."

> "Esses logs permitem investigar problemas em produção."

O resultado esperado não é apenas uma aplicação funcionando, mas um projeto no qual seja possível **explicar tecnicamente as decisões tomadas durante sua construção**.

---

#  Status

 **Em desenvolvimento**

O projeto será construído progressivamente, começando pela definição do domínio e das regras de negócio antes da implementação.

---

## Próximas etapas

1. Definir requisitos do sistema
2. Identificar atores e casos de uso
3. Definir regras de negócio
4. Modelar o domínio
5. Modelar o banco de dados
6. Definir a arquitetura
7. Inicializar o backend
8. Implementar autenticação e autorização
9. Implementar os casos de uso
10. Desenvolver o frontend
11. Integrar frontend e API
12. Implementar testes
13. Implementar E2E
14. Containerizar a aplicação
15. Criar CI/CD
16. Implementar observabilidade
17. Realizar revisão de segurança
18. Realizar revisão arquitetural
