# 📋 Especificação de Requisitos do Sistema

> **Projeto:** Plataforma de Ensino de Programação  
> **Módulo:** `consolidation`  
> **Fonte Única da Verdade:** [`Aprendizado/consolidation/README.md`](../README.md)  
> **Status:** Aprovado para Modelagem de Domínio  

---

## 1. Visão Geral do Produto

A **Plataforma de Ensino de Programação** é um sistema web full-stack projetado para conectar um **Professor de Tecnologia** (administrador e curador) a **Alunos** (estudantes), proporcionando uma jornada de aprendizagem estruturada através de **Trilhas de Estudo**, **Cursos**, **Aulas**, **Materiais de Apoio** e **Acompanhamento de Progresso**.

---

## 2. Atores do Sistema

| Ator | Descrição | Nível de Acesso (RBAC) |
| :--- | :--- | :--- |
| **Visitante** | Usuário não autenticado que acessa a plataforma pública. | Leitura pública da landing page, catálogo de cursos e trilhas abertas. |
| **Aluno** | Usuário cadastrado e autenticado interessado em aprender. | Matrícula em cursos, acesso às aulas, download de materiais e registro de progresso. |
| **Professor (Admin)** | Proprietário e gestor pedagógico do sistema. | Gestão total de trilhas, cursos, aulas, materiais, métricas de alunos e matrículas. |

---

## 3. Requisitos Funcionais (RF)

### 3.1 Módulo: Autenticação e Usuários (AUTH)
* **RF01:** O sistema deve permitir que um visitante crie uma nova conta fornecendo nome completo, e-mail válido e senha segura.
* **RF02:** O sistema deve permitir que usuários (Alunos e Professor) realizem login utilizando e-mail e senha.
* **RF03:** O sistema deve manter sessões seguras e persistentes em banco de dados, permitindo encerramento voluntário (*logout*).
* **RF04:** O sistema deve diferenciar as permissões de acesso com base no perfil do usuário (`STUDENT` ou `INSTRUCTOR`).
* **RF05:** O sistema deve permitir ao usuário autenticado visualizar e atualizar seus dados de perfil (nome e imagem/avatar).

### 3.2 Módulo: Trilhas de Estudos (TRACKS)
* **RF06:** O Professor deve poder criar, editar, reordenar e desativar Trilhas de Estudos.
* **RF07:** O Professor deve poder associar cursos a uma Trilha em uma sequência didática específica (ordem de estudo recomendada).
* **RF08:** Alunos e Visitantes devem poder visualizar a listagem de trilhas ativas e o detalhe dos cursos que a compõem.

### 3.3 Módulo: Cursos e Módulos (COURSES)
* **RF09:** O Professor deve poder criar novos cursos contendo título, descrição, carga horária estimada, nível (Iniciante, Intermediário, Avançado) e status (`DRAFT`, `PUBLISHED`, `ARCHIVED`).
* **RF10:** O Professor deve poder atualizar informações, alterar o status de publicação ou arquivar cursos.
* **RF11:** O Professor deve poder organizar os cursos em módulos temáticos (ex: Módulo 1 - Fundamentos, Módulo 2 - Prática).
* **RF12:** Alunos e Visitantes devem poder buscar e filtrar cursos por título, nível e trilha associada.
* **RF13:** Apenas cursos com status `PUBLISHED` devem ser visíveis publicamente e elegíveis para matrícula.

### 3.4 Módulo: Aulas e Conteúdos (LESSONS)
* **RF14:** O Professor deve poder cadastrar aulas dentro dos módulos de um curso, especificando título, descrição, tipo de conteúdo (vídeo, texto/markdown), URL do recurso e duração estimada.
* **RF15:** O Professor deve poder ordenar a sequência de aulas dentro de cada módulo.
* **RF16:** O Aluno matriculado deve poder acessar e consumir o conteúdo detalhado de cada aula do curso.
* **RF17:** O sistema deve impedir que usuários não matriculados acessem o conteúdo restrito das aulas.

### 3.5 Módulo: Documentos e Materiais de Apoio (MATERIALS)
* **RF18:** O Professor deve poder anexar materiais complementares (apostilas, checklists, links de repositórios, resumos) a uma aula, curso ou trilha.
* **RF19:** O Aluno matriculado deve poder visualizar e baixar os materiais disponibilizados.

### 3.6 Módulo: Matrículas (ENROLLMENTS)
* **RF20:** O Aluno autenticado deve poder matricular-se em cursos publicados com um único clique.
* **RF21:** O Aluno deve poder visualizar a lista de todos os cursos nos quais está matriculado no seu painel (*Dashboard*).
* **RF22:** O Professor deve poder visualizar a lista de alunos matriculados em cada curso.

### 3.7 Módulo: Progresso do Aluno (PROGRESS)
* **RF23:** O Aluno matriculado deve poder marcar e desmarcar uma aula como concluída.
* **RF24:** O sistema deve calcular automaticamente o percentual de conclusão do curso pelo aluno com base nas aulas concluídas vs total de aulas ativas.
* **RF25:** O sistema deve emitir um status de "Curso Concluído" quando o aluno atingir 100% das aulas finalizadas.
* **RF26:** O Professor deve poder visualizar o percentual de conclusão individual de cada aluno por curso.

---

## 4. Regras de Negócio (RN)

* **RN01 - Unicidade de E-mail:** Não pode haver mais de um usuário cadastrado com o mesmo endereço de e-mail.
* **RN02 - Imutabilidade de Papel no Cadastro Público:** Todo usuário cadastrado pela rota pública recebe automaticamente o papel de Aluno (`role = STUDENT`). A atribuição do papel de Professor (`INSTRUCTOR`) ocorre exclusivamente via seed inicial ou promoção manual no banco.
* **RN03 - Matrícula Única:** Um aluno não pode se matricular mais de uma vez no mesmo curso (a relação `(userId, courseId)` deve ser única).
* **RN04 - Elegibilidade para Matrícula:** Apenas cursos no estado `PUBLISHED` aceitam novas matrículas de alunos. Cursos em `DRAFT` ou `ARCHIVED` rejeitam matrículas.
* **RN05 - Idempotência na Conclusão de Aulas:** A ação de marcar uma aula como concluída deve ser idempotente. Registrar a conclusão de uma aula já concluída não duplica registros e não altera a data original de conclusão.
* **RN06 - Vínculo de Conclusão e Matrícula:** Um aluno só pode marcar uma aula como concluída se possuir uma matrícula ativa e válida no curso pertencente àquela aula.
* **RN07 - Cálculo Determinístico de Progresso:** O percentual de progresso de um curso é obtido estritamente pela fórmula:
  $$\text{Progresso (\%)} = \left( \frac{\text{Quantidade de aulas ativas concluídas}}{\text{Quantidade total de aulas ativas do curso}} \right) \times 100$$
  Se o curso não possuir aulas cadastradas, o progresso deve ser considerado $0\%$.
* **RN08 - Soft Delete em Cursos com Histórico:** Um curso que já possui alunos matriculados não pode ser excluído fisicamente do banco de dados (*hard delete*). Ele deve ser marcado como arquivado (`status = ARCHIVED` ou `deletedAt != null`), preservando o histórico de estudos dos alunos.
* **RN09 - Acesso Restrito a Conteúdos:** Nenhum endpoint da API deve retornar dados confidenciais de aulas (como links diretos de vídeos protegidos ou materiais) para usuários que não possuam matrícula confirmada.

---

## 5. Requisitos Não Funcionais (RNF)

### 5.1 Desempenho e Escalabilidade
* **RNF01:** O tempo de resposta da API (P95) para consultas de cursos, aulas e progresso deve ser inferior a **200ms** sob carga normal.
* **RNF02:** O banco de dados PostgreSQL deve utilizar índices B-Tree nas chaves de busca frequente: `(userId, courseId)` em matrículas, `(courseId, order)` em aulas e `(userId, lessonId)` em progresso.

### 5.2 Segurança e Conformidade (OWASP Top 10)
* **RNF03:** Todas as senhas devem ser criptografadas utilizando algoritmo seguro de hashing adaptativo (Argon2id ou Bcrypt com custo mínimo de 12), gerenciado pelo Better Auth.
* **RNF04:** A autenticação deve trafegar tokens de sessão via Cookies seguros com atributos `HttpOnly`, `SameSite=Lax` (ou `Strict`) e `Secure` (em produção).
* **RNF05:** Prevenção contra IDOR: Toda operação de mutação (ex: concluir aula, editar curso) deve verificar se o ID do recurso solicitado pertence ao usuário logado ou se o usuário possui papel de `INSTRUCTOR`.
* **RNF06:** Proteção de borda com `helmet` para cabeçalhos de segurança (X-Frame-Options, Content-Security-Policy) e `express-rate-limit` (máximo de 100 req/min por IP geral e 10 req/min para rotas de autenticação).
* **RNF07:** Sanitização estrita de logs: Nunca registrar tokens de sessão, hashes de senha, payloads de autenticação ou URLs de conexão no console ou arquivos de log.

### 5.3 Arquitetura e Engenharia de Software
* **RNF08:** O backend deve seguir rigorosamente a **Clean-Layered Architecture**:
  - `Domain`: Entidades e regras puras (Zero dependências externas).
  - `Application`: Casos de uso e contratos de repositório (`Interfaces`).
  - `Infrastructure`: Implementação do Prisma 7, Better Auth e drivers.
  - `Presentation`: Express, Controllers, Schemas Zod e Middlewares.
* **RNF09:** A inversão de dependência é mandatória: Use Cases nunca dependem de objetos do Express (`Request`, `Response`) e nunca conhecem o Prisma Client diretamente.
* **RNF10:** Validação de entradas em tempo de compilação e execução utilizando schemas estritos do **Zod** para `body`, `params`, `query` e variáveis de ambiente no boot (`env.ts`).

### 5.4 Testabilidade e Qualidade de Código
* **RNF11:** Cobertura de Testes Automatizados:
  - **100% de cobertura nos Casos de Uso (Testes Unitários)** utilizando Vitest e repositórios em memória (*In-Memory Repositories*), executando em menos de 3 segundos.
  - **Testes de Integração** para todos os fluxos críticos de rotas da API usando Supertest contra banco PostgreSQL efêmero de teste.
  - **Testes E2E** cobrindo o fluxo completo do aluno (Cadastro -> Matrícula -> Estudo -> Conclusão) utilizando Playwright.
* **RNF12:** O código deve passar com 0 erros e 0 warnings no **Biome** (`check:ci`) e no TypeScript estrito (`tsc --noEmit`).

### 5.5 Infraestrutura e Portabilidade
* **RNF13:** O ambiente local deve ser executado de forma 100% reproduzível via **Docker Compose**, contendo:
  - Container do banco PostgreSQL 16 Alpine com **volume nomeado persistente obrigatório** (`pgdata:/var/lib/postgresql/data`).
  - Container da API Backend (Bun).
  - Container do Frontend (Vite).
* **RNF14:** Pipeline de CI/CD automatizado no GitHub Actions disparado a cada Pull Request na branch `main`, bloqueando merge se houver falhas de lint, tipagem ou testes.

---

## 6. Matriz de Rastreabilidade (Atores × Casos de Uso)

```text
[ VISITANTE ]
     ├─▶ Visualizar Catálogo de Cursos Públicos (RF08, RF12)
     ├─▶ Visualizar Trilhas de Estudos (RF08)
     └─▶ Criar Conta / Cadastrar-se (RF01)

[ ALUNO ]
     ├─▶ Autenticar-se / Login / Logout (RF02, RF03)
     ├─▶ Gerenciar Perfil (RF05)
     ├─▶ Matricular-se em Curso Publicado (RF20, RN03, RN04)
     ├─▶ Visualizar Meus Cursos / Dashboard (RF21)
     ├─▶ Acessar Conteúdo e Aulas do Curso (RF16, RF17, RN06)
     ├─▶ Baixar Materiais de Apoio (RF19)
     ├─▶ Marcar / Desmarcar Aula Concluída (RF23, RN05, RN06)
     └─▶ Visualizar Meu Progresso em Cursos e Trilhas (RF24, RF25, RN07)

[ PROFESSOR / ADMIN ]
     ├─▶ Gerenciar Trilhas de Estudo (Criar, Editar, Ordenar) (RF06, RF07)
     ├─▶ Gerenciar Cursos (Criar, Editar, Publicar, Arquivar) (RF09, RF10, RN08)
     ├─▶ Gerenciar Módulos e Aulas (Criar, Editar, Ordenar) (RF11, RF14, RF15)
     ├─▶ Fazer Upload / Anexar Materiais de Apoio (RF18)
     ├─▶ Acompanhar Alunos e Matrículas (RF22)
     └─▶ Monitorar Progresso Individual dos Alunos (RF26)
```
