# Pontos cruciais nesta etapa de aprendizado

- Cross-Origin Resource Sharing[app.use(cors());]

Regra de segurança do navegador(CORS POLICY) que controla quem pode acessar a API,
permitindo que o front desenvolvido possa acessar a API sem o backend bloquear.
Pode-se concluir também que com determinadas requisições(DELETE, PUT, PATCH) o navegador exerce
um determinado tipo de "desconfiança", e a permissão de determinado metodo funcionar é o cors.

Frontend quer acessar API
        ↓
Browser pergunta:
"Pode usar Authorization? PUT? DELETE?"
        ↓
Backend (CORS):
"Pode sim 👍"
        ↓
Requisição acontece

- requisição HTTP

Quando uma requisição é feita no front, ela chega no servidor dividida em partes: 
req.params => Identificação de recurso ou ação do sistema, que é estabelecido na URL, no momento de montar uma rota.

req.query => Parte da requisição usada para estabelecer limites de exibição de dados e paginação, após o "?".

req.body => São dados enviados numa requisição através de um método estabelecido.

req.headers => ...26/03


Host: localhost:4000
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
User-Agent: Mozilla/5.0
Accept: */*





