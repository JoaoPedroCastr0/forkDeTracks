---
name: ux-specification
description: Use para especificar fluxos de usuário, comportamento de interface e critérios de acessibilidade antes de implementar UX ou UI.
triggers:
  - "criar especificação de UX ou user flow"
  - "definir critérios de acessibilidade (WCAG)"
  - "avaliar ou documentar decisões de interface"
license: MIT
---

# UX Specification

## Quando Usar

- Definir o fluxo de um usuário antes de implementar
- Especificar comportamento de componentes UI complexos
- Definir critérios de acessibilidade para uma feature
- Avaliar se uma decisão de interface está adequada

## Perguntas de Discovery UX

Antes de especificar qualquer interface:

- **Quem é o usuário?** — Perfil, contexto, dispositivo principal
- **Qual é o objetivo?** — O que o usuário quer realizar?
- **Qual é o caminho mais curto?** — Quantas etapas são necessárias?
- **O que pode dar errado?** — Estados de erro, loading, vazio
- **É acessível?** — Usuários com deficiências visuais, motoras ou cognitivas conseguem usar?

## Formato de Especificação de Fluxo

```markdown
## Fluxo: [Nome do Fluxo]

### Persona
[Quem é o usuário neste fluxo]

### Objetivo
[O que o usuário quer alcançar]

### Pré-condições
[O que precisa ser verdade antes de iniciar]

### Caminho Principal (Happy Path)
1. Usuário faz X
2. Sistema mostra Y
3. Usuário faz Z
4. Sistema confirma e redireciona para W

### Caminhos Alternativos
- **Caso A:** Se [condição], então [comportamento]
- **Caso B:** Se [condição], então [comportamento]

### Estados de Erro
- **Erro de validação:** [mensagem exibida, campo destacado]
- **Erro de servidor:** [mensagem genérica, sem detalhes técnicos]
- **Timeout:** [feedback visual + opção de retry]

### Estados de Loading
- [Qual feedback visual durante operação assíncrona]

### Estado Vazio
- [O que mostrar quando não há dados]
```

## Critérios de Acessibilidade (WCAG 2.1 AA)

### Obrigatórios
- **Contraste:** texto normal ≥ 4.5:1, texto grande ≥ 3:1
- **Teclado:** todos os elementos interativos acessíveis via Tab
- **Labels:** todo input tem label associado (não só placeholder)
- **Alt text:** toda imagem informativa tem descrição
- **Foco visível:** indicador de foco sempre visível
- **Sem dependência de cor:** não usar cor como único meio de informação

### Formulários
- Erros de validação próximos ao campo com problema
- Mensagem de erro descritiva ("Email inválido" > "Erro")
- Campos obrigatórios marcados visualmente E com `aria-required`

### Navegação
- Skip links para conteúdo principal
- Landmarks (`main`, `nav`, `header`, `footer`)
- Heading hierarchy lógica (h1 → h2 → h3)

## Padrões de Feedback Visual

| Situação | Feedback Esperado |
|----------|------------------|
| Ação assíncrona | Spinner ou skeleton, desabilitar botão |
| Sucesso | Confirmação positiva com próximo passo claro |
| Erro de validação | Inline, próximo ao campo, em vermelho com ícone |
| Erro de sistema | Toast/banner com mensagem amigável + retry |
| Lista vazia | Ilustração + ação sugerida (não só "Sem resultados") |
| Confirmação destrutiva | Modal de confirmação, não ação imediata |

## Nunca Faça (UX)

- Nunca usar só cor para transmitir informação crítica
- Nunca fazer ação destrutiva sem confirmação explícita
- Nunca usar placeholder como substituto de label
- Nunca criar modais que bloqueiam sem forma clara de fechar
- Nunca mover foco de forma inesperada sem avisar o usuário

## Passos

### 1. Coletar contexto do produto

Antes de especificar qualquer fluxo:
- Quem é o usuário? (persona, nível de experiência técnica)
- Qual problema está sendo resolvido?
- Quais são os constraints de plataforma (mobile, desktop, ambos)?

### 2. Conduzir discovery de UX

Usar `## Perguntas de Discovery UX` para coletar informações estruturadas sobre o fluxo.
Registrar respostas antes de avançar.

### 3. Mapear o fluxo de usuário

Usar o `## Formato de Especificação de Fluxo` para documentar:
- Contexto: onde o usuário está antes deste fluxo
- Gatilho: o que inicia o fluxo
- Passos principais: sequência de interações
- Estados alternativos: erro, loading, empty state, confirmação
- Resultado esperado: onde o usuário termina

### 4. Definir critérios de acessibilidade

Aplicar os critérios de `## Critérios de Acessibilidade (WCAG 2.1 AA)`:
- Contraste, navegação por teclado, ARIA labels obrigatórios

### 5. Revisar padrões de feedback

Consultar `## Padrões de Feedback Visual` para garantir que loading, error, success e empty state estão especificados.

### 6. Entregar a especificação

- Documento revisado e aprovado pelo produto
- Handoff para o time de implementação (frontend/mobile)
- Critérios de aceite claros e testáveis

## Checklist de validação

- [ ] Persona do usuário identificada e documentada
- [ ] Fluxo de usuário mapeado com todos os estados (happy path, error, loading, empty)
- [ ] Critérios de acessibilidade WCAG 2.1 AA aplicados
- [ ] Padrões de feedback visual definidos para cada estado
- [ ] Casos de borda identificados (conexão lenta, dados vazios, erros de servidor)
- [ ] Especificação revisada com o time de produto
- [ ] Critérios de aceite escritos e testáveis
- [ ] Handoff documentado para implementação

## Exemplos

### Especificação de fluxo — Login

```markdown
## Fluxo: Login com Email e Senha

**Contexto:** Usuário não autenticado tenta acessar área restrita
**Gatilho:** Clique em "Entrar" ou redirecionamento automático

### Passos Principais
1. Usuário vê formulário com campos Email e Senha
2. Usuário preenche os campos
3. Usuário clica em "Entrar"
4. Sistema valida credenciais
5. Sistema redireciona para dashboard

### Estados Alternativos
- **Loading:** Botão desabilitado + spinner após submit
- **Erro de validação:** Mensagem inline nos campos inválidos
- **Credenciais inválidas:** "Email ou senha incorretos" (sem especificar qual)
- **Conta bloqueada:** Mensagem específica + link de suporte

### Acessibilidade
- Labels associados aos inputs (não placeholder como substituto)
- Foco gerenciado: após erro, foco vai para o primeiro campo com erro
- Mensagens de erro anunciadas via aria-live
```
