Arquitetura mais madura

No futuro:

controllers/
├── task/
│   ├── create-task.controller.ts
│   ├── update-task.controller.ts
│   ├── list-task.controller.ts
│   ├── toggle-task.controller.ts
│   └── delete-task.controller.ts
│
├── trash/
│   ├── restore-task.controller.ts
│   ├── permanent-delete.controller.ts
│   └── list-deleted.controller.ts

para trabalhar com : 

centenas de endpoints
múltiplos módulos
equipe grande
microsserviços
domínio complexo 

Como o trabalho nao tem essa complexidade, optei por : 

controllers/
├── taskController.ts
├── trashController.ts

Trabalhando com fluxos contextuais. 

