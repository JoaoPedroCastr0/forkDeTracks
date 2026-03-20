models/
  User.ts        → entidade (banco)

schemas/
  userSchemas.ts → validação + DTO (infer)

services/
  userService.ts → lógica usando DTO

controllers/
  userController.ts → usa schema.parse()