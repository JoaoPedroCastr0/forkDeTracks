# Métodos de requisição


- Exemplo POST 

[ LINHA INICIAL ]
POST /usuarios HTTP/1.1

[ HEADERS ]
Host: api.meusite.com
Content-Type: application/json

[ BODY ]
{
  "nome": "João",
  "idade": 20
}

- Request (requisição).

Um request possui 3 principais caracteristicas :

Linha inicial(método + endpoint ou rota + versão http).

Headers(metadados).

Body(dados enviados para o servidor).

- Fluxo real

Cliente → envia POST + body
Servidor → valida → salva no banco → retorna resposta

# O que acontece no backend?

O servidor recebe os dados em req.body

Valida os campos

Executa um CRUD, como:

INSERT INTO usuarios (nome, email) VALUES ('João', 'joao@email.com');

O banco gera um id

O servidor responde:

Status: 201 Created

{
  "id": 10,
  "nome": "João",
  "email": "joao@email.com"
}
