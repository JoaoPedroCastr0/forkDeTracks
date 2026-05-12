---
name: brand-identity
description: Use para definir identidade de marca, posicionamento visual e design system foundation, incluindo paleta, tipografia, tokens, linguagem e critérios anti-generic AI.
triggers:
  - "definir identidade de marca ou visual identity"
  - "criar ou atualizar design system (tokens, paleta, tipografia)"
  - "brand discovery para produto novo"
license: MIT
---

# Brand Identity

## Quando Usar

- Definir a identidade visual e de marca de um produto novo
- Padronizar visualmente um produto que cresceu sem sistema
- Criar o design system foundation antes do frontend começar
- Estabelecer a base que vai alimentar copy, marketing e UX

## Discovery: 9 Dimensões

Nunca pular uma dimensão. Se a resposta for vaga, reformular com exemplos concretos.

### 1. Product Truth
O que o produto realmente faz, em uma frase sem jargão. O que ele entrega que ninguém mais entrega da mesma forma. Se não existe diferenciador claro: isso é um problema de produto, não de design — sinalizar antes de continuar.

### 2. Audience
Perfil concreto, não demográfico genérico. O que essa pessoa valoriza fora do contexto do produto. Quais marcas ela já escolhe — isso revela o nível de sofisticação visual esperado.

### 3. Brand Values
- 3–5 adjetivos que devem ser *sentidos* visualmente
- 3 adjetivos que o produto jamais pode transmitir
- Uma frase que a marca jamais diria (revela limites de personalidade melhor que qualquer lista)

### 4. Competitive Landscape
Os clichês visuais que definem a categoria são os anti-padrões do projeto. Mapear: cores dominantes do setor, tipografias mais usadas, padrões de UI recorrentes. Tudo isso entra na lista de proibições.

### 5. Emotional Target
Não "impressionado" ou "confortável". Emoções específicas: tensão, familiaridade, ambição, irreverência, autoridade silenciosa. A emoção na primeira exposição pode ser diferente da emoção após uso contínuo — ambas importam.

### 6. Reference World
Marcas de qualquer indústria que ressoam esteticamente. Produtos físicos, editoriais, digitais. Movimentos estéticos: Bauhaus, Swiss International Style, brutalism digital, editorial japonês, etc. Isso expande o vocabulário além dos defaults da categoria.

### 7. Anti-Inspiration
O que esse produto jamais pode parecer. Qual seria o pior elogio possível sobre o design. Qual associação de marca seria um desastre.

### 8. Platform & Constraints
Web/mobile/ambos — qual é o primário. Dark mode obrigatório. Elementos legados que existem e não podem mudar. Restrições de acessibilidade que impactam as escolhas visuais.

### 9. Product Maturity
Sistema novo do zero vs. produto existente buscando consistência. O prazo de implementação — isso determina a complexidade do sistema que faz sentido produzir agora.

---

## Output Template

O documento é escrito em prosa de diretor criativo — não em listas de bullet points genéricas. Cada seção tem voz e ponto de vista.

```markdown
# [Project Name] — Brand Identity & Design System

---

## Brand Positioning

[Um parágrafo. O que essa marca é — e o que ela explicitamente não é.
Escrito como declaração, não como aspiração. Presente do indicativo.
Exemplo de tom: "Isso não é um produto de produtividade. É uma ferramenta para quem já decidiu que quer fazer coisas sérias."]

---

## Brand Personality

Cinco traços. Cada um com uma implicação comportamental concreta — como esse traço se manifesta nas decisões visuais e de linguagem.

**[Traço 1]** — [O que esse traço significa na prática. Ex: "Não explicamos óbvios. Se o usuário precisa de tutorial para entender o que um botão faz, o botão está errado."]

**[Traço 2]** — [...]

**[Traço 3]** — [...]

**[Traço 4]** — [...]

**[Traço 5]** — [...]

---

## Tone of Voice

Três regras. Cada uma com um exemplo de aplicação correta e um exemplo do que não fazer.

**Regra 1: [Nome da regra]**
✅ "[Exemplo de cópia on-brand]"
❌ "[Exemplo do que parece errado para essa marca]"

**Regra 2: [Nome da regra]**
✅ "[...]"
❌ "[...]"

**Regra 3: [Nome da regra]**
✅ "[...]"
❌ "[...]"

---

## Visual Language

[Um parágrafo narrativo descrevendo o mundo visual — referências, movimento estético, contexto cultural.
Não listar. Descrever. Como um diretor de fotografia descreve a linguagem visual de um filme antes de começar a rodar.
Exemplo de tom: "O sistema vive numa tensão deliberada entre precisão técnica e calor humano. A tipografia é densa e editorial — não convida, exige atenção. A cor é contida: um único acento cromático num campo de neutros profundos. Nenhum gradiente. Nenhuma sombra. A luz vem de dentro do conteúdo, não de decoração aplicada."]

---

## Color System

[Parágrafo de abertura descrevendo a lógica cromática — não a lista de cores, mas o princípio que governa o sistema.]

### [Nome da Cor — ex: "Obsidian"]
- **Hex:** #[valor]
- **Token:** `--color-obsidian`
- **RGB / HSL:** [valores]
- **Papel:** [Base de superfície / Texto primário / Acento / etc.]
- **Usa-se para:** [casos de uso específicos]
- **Nunca usar para:** [proibições específicas]

### [Nome da Cor 2]
[mesma estrutura]

[repetir para todas as cores do sistema — mínimo 3, máximo 7]

**Regras do sistema cromático:**
- [Regra 1 — ex: "O acento nunca aparece em mais de 10% da área visual de qualquer tela"]
- [Regra 2 — ex: "Superfícies não recebem opacidade — apenas as cores definidas no sistema"]
- [Regra 3]

---

## Typography System

[Parágrafo de abertura: a lógica tipográfica. Por que essas fontes. A relação entre elas. O que o sistema tipográfico está comunicando além do texto.]

### [Nome da Fonte] — [Fundição]
- **Papel:** Display / Body / Mono / Label
- **Pesos usados:** [somente os pesos que fazem parte do sistema]
- **Tracking:** [valor em em — ex: -0.02em para display, 0 para body]
- **Line-height:** [valor — ex: 1.1 para headlines, 1.6 para body]
- **Tamanhos no sistema:** [escala — ex: 12 / 14 / 16 / 20 / 24 / 32 / 48 / 64px]
- **Tokens:** `--font-display`, `--font-body`, etc.
- **Regra de uso:** [o que governa como essa fonte é aplicada]

### [Nome da Fonte 2]
[mesma estrutura]

**Regras do sistema tipográfico:**
- [Regra 1 — ex: "Headlines são sempre weight 300 ou 700. Nada entre esses extremos."]
- [Regra 2 — ex: "Texto corrido nunca é configurado em peso Bold — apenas Medium no máximo"]
- [Regra 3]

---

## Spacing & Layout

**Unidade base:** [valor — ex: 4px]
**Escala:** [sequência — ex: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128]
**Grid:** [definição — ex: 12 colunas, gutter de 24px, margem mínima de 16px]
**Max-width:** [valor — ex: 1280px]
**Tokens:** `--space-1` (4px) → `--space-32` (128px)

**Princípio de espaçamento:**
[Uma frase sobre a filosofia de espaço nesse sistema — ex: "O sistema respira. Quando em dúvida, adicionar espaço — não remover."]

---

## Component Principles

Cinco constraints que governam todas as decisões de componente no sistema.

1. **[Nome do princípio]** — [Descrição concreta do que isso significa na prática]
2. **[Nome do princípio]** — [...]
3. **[Nome do princípio]** — [...]
4. **[Nome do princípio]** — [...]
5. **[Nome do princípio]** — [...]

---

## Marketing Foundation

*(Esta seção é consumida pelo `@creative` (modo Conversion) antes de qualquer produção de copy.)*

### Positioning Statement
Para [audiência específica] que [situação/necessidade], [nome do produto] é [categoria] que [diferenciador único].

### Messaging Pillars

**Pilar 1: [Nome]**
Território de headline: [o que pode ser dito aqui]
O que desbloqueia em copy: [tipos de argumentos, ângulos, provas]

**Pilar 2: [Nome]**
[mesma estrutura]

**Pilar 3: [Nome]**
[mesma estrutura]

### Tagline Territory

**Direção A: [Nome]**
Emoção-alvo: [emoção específica]
Proibido nesse território: [o que quebraria a coerência]

**Direção B: [Nome]**
[mesma estrutura]

### Voice in Practice

Três transformações de cópia — mostrando a voz da marca aplicada a situações reais.

**1. [Contexto — ex: CTA de cadastro]**
❌ "Crie sua conta grátis e comece hoje"
✅ "[Versão on-brand]"

**2. [Contexto — ex: Mensagem de erro]**
❌ "Ocorreu um erro inesperado. Tente novamente."
✅ "[Versão on-brand]"

**3. [Contexto — ex: Headline de landing page]**
❌ "A plataforma completa para [categoria]"
✅ "[Versão on-brand]"

### Tone Boundaries for Marketing

O que a voz da marca jamais faz em materiais de marketing:
- [Proibição 1 — ex: "Nunca usa ponto de exclamação"]
- [Proibição 2 — ex: "Nunca promete 'facilidade' — o produto exige esforço e isso é posicionamento"]
- [Proibição 3]
- [Proibição 4]

---

## Anti-Patterns

*(Igualmente importante quanto as diretrizes. Cada item é uma decisão consciente, não uma restrição arbitrária.)*

### Visual Anti-Patterns

- **[Anti-padrão 1]** — [Por que existe essa proibição]
- **[Anti-padrão 2]** — [...]
- [continuar para todos os anti-padrões identificados no discovery]

Exemplos obrigatórios de anti-padrões visuais (customizar para o projeto):
- Gradientes fora dos casos definidos no sistema
- Drop shadows decorativas (sombras só se forem funcionais)
- #000000 ou #FFFFFF como valores de superfície ou texto
- Bordas arredondadas que não seguem o radius definido no sistema
- Qualquer cor fora da paleta definida — mesmo "só uma vez"
- Ícones de libraries genéricas (Heroicons, Material) sem customização visual

### Copy Anti-Patterns

- **[Anti-padrão 1]** — [ex: "Usar 'inovador' para descrever qualquer feature"]
- **[Anti-padrão 2]** — [...]
```

---

## Language Rules: No AI Face

Esta é a regra mais importante deste sistema. O documento de brand identity deve parecer escrito por um diretor criativo humano — não por um assistente de IA.

### Frases Proibidas (nunca usar)

| ❌ Frase proibida | Motivo |
|------------------|--------|
| "um equilíbrio perfeito entre X e Y" | Hedge. Decisões de design não são equilibradas — são tomadas. |
| "transmite confiança e inovação" | Sem significado. Toda marca quer isso. |
| "clean e moderno" | Descritores vazios sem referente específico. |
| "bold yet approachable" | Oxímoro genérico de pitch deck. |
| "poderia considerar", "talvez", "uma opção seria" | Nunca hedge. Decisões são declaradas. |
| "versátil" para descrever qualquer elemento | Versátil = sem personalidade. |
| "aesthetic" sem referente específico | Não existe estética sem nome. |
| "minimalista" sem descrever o que foi removido | Minimalismo é consequência, não estilo. |
| "sofisticado" como único descritor | O que especificamente é sofisticado e por quê? |
| "premium" sem definir o que custa mais caro | Premium em qual dimensão? |

### Tom Correto

**Declarativo, não hipotético:**
- ❌ "A cor principal poderia ser um azul profundo que evoca confiança"
- ✅ "O acento cromático é #1B4FFF — um azul índigo saturado. Não navy, não royal. Índigo. A diferença importa."

**Específico, não genérico:**
- ❌ "A tipografia escolhida transmite profissionalismo"
- ✅ "O tracking de -0.02em no display não é acidente. Aperta as letras o suficiente para parecer editorial sem cruzar para o território de logotipo."

**Com rationale técnico, não com metáfora de personalidade:**
- ❌ "Escolhemos esta fonte porque ela parece moderna e acessível"
- ✅ "Escolhemos ABC Diatype Medium porque o eixo humanista do grotesco mantém legibilidade em tamanhos pequenos sem perder a formalidade que a categoria exige."

**Anti-padrões tão detalhados quanto padrões:**
- Cada proibição deve ter um motivo.
- "Nunca use gradientes" é insuficiente.
- "Gradientes não existem neste sistema. A profundidade vem de valor tonal — não de transição cromática." — é o nível correto.

### Estrutura de Documento

- Não usar bullet lists para transmitir raciocínio — usar prosa
- Seções narrativas (Visual Language, Brand Positioning) devem ser parágrafos completos
- Listas são aceitáveis apenas onde a estrutura serve a consulta (Color System, Typography tokens)
- O documento deve ter começo, meio e fim — não ser um repositório de itens

---

## Checklist de Validação

Antes de entregar o documento, verificar:

**Discovery**
- [ ] Todas as 9 dimensões foram coletadas com respostas concretas (não genéricas)
- [ ] Os clichês visuais da categoria foram mapeados e entram como anti-padrões
- [ ] O diferenciador do produto está definido e se reflete na identidade

**Color System**
- [ ] Todas as cores têm nomes próprios (não "Primary", "Secondary")
- [ ] Nenhuma cor é #000000 ou #FFFFFF puro
- [ ] Cada cor tem casos de uso E proibições
- [ ] Tokens CSS definidos para todas as cores

**Typography System**
- [ ] Máximo 3 famílias tipográficas no sistema
- [ ] Cada peso usado está justificado (não "usamos todos os pesos disponíveis")
- [ ] Tracking e line-height definidos para cada papel
- [ ] Tokens CSS definidos

**Linguagem do documento**
- [ ] Nenhuma das frases proibidas está presente
- [ ] As seções narrativas são prosa, não bullet lists
- [ ] Os anti-padrões são tão detalhados quanto os padrões
- [ ] O documento tem voz — não é neutro

**Marketing Foundation**
- [ ] Positioning statement no formato correto
- [ ] 3 pilares de mensagem com território e o que desbloqueiam
- [ ] 2+ direções de tagline com emoção-alvo e proibições
- [ ] 3 exemplos de voz na prática (antes/depois)
- [ ] Tone boundaries listados

**Entrega**
- [ ] Revisado contra os valores de marca coletados no discovery
- [ ] Anti-padrões checados contra os clichês da categoria mapeados
- [ ] Documento salvo em `docs/brand-identity.md` ou `.github/brand-identity.md` no projeto

---

## Referências

- *Designing Brand Identity* — Alina Wheeler
- *The Brand Gap* — Marty Neumeier
- *Logo Design Love* — David Airey
- *Detail in Typography* — Jost Hochuli (para decisões tipográficas)
- [Pentagram work](https://www.pentagram.com/work) — referência de output de estúdio
- [Wolff Olins case studies](https://www.wolffolins.com/work) — posicionamento + sistema visual
