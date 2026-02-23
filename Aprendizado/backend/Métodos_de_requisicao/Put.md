# Métodos de requisição 

- Exemplo PUT

PUT é usado para atualizar completamente um recurso já existente.


[ Linha inicial ]
PUT /usuarios/1 HTTP/1.1

[ HEADERS ]
Host: api.meusite.com
Content-Type: application/json

[ Body ]
{
  "nome": "João Atualizado",
  "idade": 21
}

- Linha Inicial

Método → PUT

Rota → /usuarios/1

Versão → HTTP/1.1

Aqui está dizendo:

Quero substituir completamente o usuário com ID 1.

- Headers 

Host: api.meusite.com
Content-Type: application/json

Host → servidor destino

Content-Type → formato do body

- Body 

{
  "nome": "João Atualizado",
  "idade": 21
}

Esse é o novo estado completo do recurso IDENTIFICADO(1).




