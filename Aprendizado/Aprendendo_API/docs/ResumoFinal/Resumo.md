# Pontos cruciais nesta etapa de aprendizado

- Cross-Origin Resource Sharing[app.use(cors());]

Regra de segurança do navegador(CORS POLICY) que controla quem pode acessar a API,
permitindo que o front desenvolvido possa acessar a API sem o backend bloquear.
Pode-se concluir também que com determinadas requisições(DELETE, PUT, PATCH) o navegador exerce
um determinado tipo de "desconfiança", e a permissão de determinados metodos funcionar é o CORS.

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

Quando uma requisição é feita no front, ela chega no servidor dividida em partes, por ser um objeto de sub-objetos,
sendo importante ressaltar que existem 4 sub-objetos clássicos, podendo ser enriquecido com middlewares conforme a decisão de cada desenvolvedor.    

req.params => Identificação de recurso ou ação do sistema, que é estabelecido na URL, no momento de montar uma rota
(Parâmetros da rota).

req.query => Parte da requisição usada para estabelecer limites de exibição de dados, paginação e buscas após o "?".

req.body => São dados enviados numa requisição através de um método estabelecido na rota.

req.headers => {

HOST: localhost:4000 -> Endereço para onde a requisição está indo, nesse caso minha própria maquina(na porta 4000).
AUTHORIZATION: Bearer eyJhbGciOiJIUzI1NiIs...  -> Local onde se envia o token JWT a cada requisição feita, para ser armazenado no browser do cliente.
CONTENT-TYPE: application/json -> Instrução ao servidor de como ler o que vem na requisição.
USER-AGENT -> Identifica se a requisição foi enviada por um adroid, iphone ou pc.
Accept: */* -> definição de formato de resposta aceitável pelo cliente. }

req.method => Método usado na requisição(GET, POST, PUT, DELETE).

req.url/req.path => URL utilizada para determinada busca ou ação no sistema. 

req.ip => Onde vem o ip do cliente.

req.user => É "injetado" na requisição, através de uma função middleware.










