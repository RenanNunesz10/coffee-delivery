# Coffee Delivery — Technical Specification

**Versão:** 1.3.0
**Status:** Base técnica para implementação
**Última atualização:** 17/11/2026
**Documentos relacionados:** [`PRD_SPEC.md`](./PRD_SPEC.md) · [`TASKS_SPEC.md`](./TASKS_SPEC.md) · [`AGENTS.md`](../AGENTS.md)

## Histórico de versões

| Versão | Data | Alteração |
|---|---|---|
| 1.0.0 | 17/11/2026 | Versão inicial. |
| 1.1.0 | 17/11/2026 | Rota `/success`; justificativa Tailwind × styled-components; nomes de componentes do enunciado; tipo `CoffeeTag[]`; validação de storage com Zod; script anti-flash de tema; timeout ViaCEP; configuração de testes e deploy. |
| 1.2.0 | 17/11/2026 | Fidelidade ao Figma: `DELIVERY_FEE_CENTS = 350`, Phosphor Icons, tokens com nomes do Style Guide, ilustrações geradas com IA. |
| 1.3.0 | 17/11/2026 | Tokens finais (light/dark) com ajustes WCAG AA e regras de combinação; utilities de tipografia e raio; teste automatizado de contraste. |

## 1. Stack e justificativas

| Tecnologia | Uso | Justificativa |
|---|---|---|
| React 19 | Interface | Componentização e estado declarativo. Já instalado no projeto. |
| TypeScript (`strict`) | Tipagem | Contratos explícitos para domínio, props e ações. |
| Vite | Build/dev server | Inicialização rápida, HMR e build estático para deploy. |
| Tailwind CSS v4 (`@tailwindcss/vite`) | Estilização | Ver 1.1. |
| React Router | Rotas | Navegação SPA entre `/`, `/checkout` e `/success` (RF-07). |
| Context API + `useReducer` | Estado global | Carrinho com transições previsíveis e testáveis (RF-03 a RF-06). |
| React Hook Form | Formulário | Controle eficiente de campos e erros do checkout. |
| Zod + `@hookform/resolvers` | Validação | Um schema reutilizado no formulário, na revalidação da confirmação e na leitura do `localStorage` (RF-08, RF-09, RF-11, RN-10). |
| Phosphor Icons (`@phosphor-icons/react`) | Ícones | Biblioteca indicada no Style Guide do Figma; variantes `regular`/`fill`, tree-shakeable, `aria-hidden` por padrão quando decorativos. |
| Vitest + Testing Library + jsdom | Testes | Integração nativa com Vite; testes de lógica e de componentes. |
| ESLint (typescript-eslint, react-hooks) | Qualidade | Já configurado pelo template Vite. |

As versões ficam registradas no `package-lock.json`. Nenhuma biblioteca é adicionada sem necessidade demonstrável e registro nesta tabela.

### 1.1 Decisão: Tailwind CSS em vez de styled-components
O desafio de origem usa styled-components; o enunciado permite Tailwind desde que o motivo seja registrado. Motivos:
- **Tema por tokens CSS:** os temas são definidos como variáveis CSS em `data-theme`, consumidas pelo Tailwind via `@theme`. A troca de tema não exige re-render de componentes nem `ThemeProvider` de estilos — só um atributo no `<html>`.
- **Mobile-first nativo:** prefixos `sm:`/`md:`/`lg:`/`xl:` tornam a responsividade (RF-15) explícita no próprio markup.
- **Sem runtime de CSS-in-JS:** CSS gerado em build, menor custo em tempo de execução e menor bundle.
- **Integração com Vite 8 / React 19:** plugin oficial mantido, sem configuração de Babel/SWC adicional.
- **Consistência:** cores arbitrárias (`bg-[#...]`) são proibidas; somente tokens semânticos.

Contrapartida aceita: classes longas no JSX; mitigada com componentes pequenos e helpers de variantes quando necessário.

## 2. Arquitetura da SPA

Camadas leves, organizadas por funcionalidade:

1. **Presentation:** páginas e componentes React, sem regras de negócio complexas.
2. **Application/state:** Contexts, reducer e hooks que orquestram ações.
3. **Domain:** tipos, constantes e funções puras (carrinho, preço, frete, pedido).
4. **Infrastructure:** adaptadores de `localStorage` e cliente ViaCEP.

### 2.1 Fluxo de dados
- `coffees.ts` fornece o catálogo tipado.
- Componentes disparam ações via `useCart()`.
- `cartReducer` produz novo estado sem mutação.
- `CartProvider` persiste o carrinho após cada alteração.
- O Checkout valida com Zod e consulta a ViaCEP por serviço isolado.
- Funções puras de `pricing.ts` calculam valores em centavos.
- A confirmação cria e persiste o `Order` (snapshot) **antes** de limpar o carrinho.
- `/success` lê o snapshot; nunca reconstrói o pedido a partir do carrinho.

### 2.2 Diagrama de alto nível

```text
main.tsx
└── App
    └── AppProviders (ThemeProvider → CartProvider)
        └── RouterProvider
            └── PageLayout (Header + <Outlet/>)
                ├── /          HomePage ── Hero, CoffeeCatalog ── CoffeeCard ── QuantityInput
                ├── /checkout  CheckoutPage ── DeliveryAddressForm ── viacep service
                │                           ├── PaymentMethodSelector
                │                           └── CartItem[] + CartSummary
                └── /success   SuccessPage ── OrderSuccess ── orderStorage
```

## 3. Estrutura de diretórios

```text
coffee-delivery/
├── AGENTS.md                     # diretrizes do assistente de IA
├── CLAUDE.md                     # importa AGENTS.md (convenção do Claude Code)
├── README.md
├── index.html                    # script anti-flash de tema, fontes, favicon
├── vercel.json                   # rewrite SPA para deploy
├── public/
│   ├── favicon.svg
│   └── brand/                    # logo e símbolo exportados
├── docs/
│   ├── PRD_SPEC.md
│   ├── TECH_SPEC.md
│   ├── TASKS_SPEC.md
│   ├── BRAND_GUIDE.md
│   ├── AI_USAGE.md
│   ├── figma/                    # exports de referência dos frames
│   └── screenshots/
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx
    │   ├── router.tsx
    │   └── providers.tsx
    ├── assets/
    │   ├── brand/                # logo light/dark usada no Header
    │   └── coffees/              # imagens dos cafés
    ├── components/               # UI reutilizável e sem regra de domínio
    │   ├── PageLayout/
    │   ├── Header/               # inclui CartBadge
    │   ├── ThemeToggle/
    │   ├── QuantityInput/
    │   └── EmptyState/
    ├── features/
    │   ├── catalog/
    │   │   ├── data/coffees.ts
    │   │   ├── components/       # CoffeeCard, CoffeeCatalog, Hero
    │   │   └── pages/HomePage.tsx
    │   ├── cart/
    │   │   ├── cartContext.ts    # createContext + tipos do valor exposto
    │   │   ├── CartProvider.tsx  # useReducer + persistência + valores derivados
    │   │   ├── cartReducer.ts
    │   │   ├── cartStorage.ts
    │   │   ├── cartTypes.ts
    │   │   ├── useCart.ts
    │   │   └── components/       # CartItem, CartSummary
    │   ├── checkout/
    │   │   ├── components/       # DeliveryAddressForm, PaymentMethodSelector
    │   │   ├── hooks/usePostalCodeLookup.ts
    │   │   ├── schemas/checkoutSchema.ts
    │   │   ├── services/viacep.ts
    │   │   └── pages/CheckoutPage.tsx
    │   ├── orders/
    │   │   ├── orderService.ts
    │   │   ├── orderStorage.ts
    │   │   ├── components/OrderSuccess.tsx
    │   │   └── pages/SuccessPage.tsx
    │   └── theme/
    │       ├── themeContext.ts   # createContext (separado do Provider por causa do react-refresh)
    │       ├── ThemeProvider.tsx
    │       ├── themeStorage.ts
    │       └── useTheme.ts
    ├── domain/
    │   ├── types.ts
    │   ├── constants.ts
    │   └── pricing.ts
    ├── lib/
    │   ├── formatCurrency.ts
    │   ├── postalCode.ts         # normalização e máscara
    │   └── storage.ts            # leitura/escrita segura de JSON
    ├── styles/
    │   ├── tokens.css
    │   └── index.css
    └── tests/
        ├── setup.ts              # jest-dom; limpa DOM, localStorage, data-theme e mocks
        └── matchMedia.ts         # mock de prefers-color-scheme (jsdom não tem matchMedia)
```

Testes unitários e de componentes ficam ao lado do módulo (`*.test.ts(x)`). Alterações nesta estrutura devem ser registradas aqui.

### 3.1 Componentes

| Componente | Responsabilidade | RF |
|---|---|---|
| `PageLayout` | Header + conteúdo da rota (`<Outlet/>`), container e largura máxima. | RF-07, RF-15 |
| `Header` | Logo, localização (cidade/UF do último pedido), `ThemeToggle`, link do carrinho com `CartBadge`. | RF-04, RF-14, RF-16 |
| `ThemeToggle` | Botão acessível de alternância (`aria-pressed`/rótulo dinâmico). | RF-14 |
| `QuantityInput` | Controle −/+ controlado, `min` configurável, rótulos acessíveis. | RF-02, RF-05 |
| `CoffeeCard` | Imagem, tags, nome, descrição, preço, `QuantityInput` e botão adicionar. | RF-01, RF-02, RF-03 |
| `CoffeeCatalog` | Grid responsivo de `CoffeeCard`. | RF-01, RF-15 |
| `CartItem` | Linha do carrinho com quantidade e "Remover". | RF-05 |
| `CartSummary` | Subtotal, entrega, total e botão "Confirmar pedido". | RF-10, RF-11 |
| `DeliveryAddressForm` | Campos de endereço, máscara de CEP, status da consulta. | RF-08 |
| `PaymentMethodSelector` | Grupo de rádio estilizado (crédito/débito/dinheiro). | RF-09 |
| `OrderSuccess` | Endereço, previsão e pagamento do snapshot. | RF-12 |
| `EmptyState` | Mensagem + ação de retorno à Home. | RN-09 |

## 4. Tipos e interfaces de domínio

Implementado em `src/domain/types.ts`. As uniões são **derivadas das listas** de `constants.ts`, para que a lista e o tipo nunca divirjam e os schemas Zod (TASK-019) usem as mesmas listas:

```ts
export type CoffeeTag = (typeof COFFEE_TAGS)[number];         // 'traditional' | 'special' | 'with-milk' | 'alcoholic' | 'iced'
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]; // 'credit' | 'debit' | 'cash'
export type BrazilianState = (typeof BRAZILIAN_STATES)[number];

export interface Coffee {
  id: string;           // slug estável, ex.: 'expresso-tradicional'
  name: string;
  description: string;
  priceCents: number;   // inteiro
  tags: readonly CoffeeTag[];  // ao menos uma
  image: string;        // URL importada de src/assets/coffees
}

export interface CartItem {
  coffeeId: Coffee['id'];
  quantity: number;     // inteiro >= 1
}

export interface DeliveryAddress {
  postalCode: string;   // oito dígitos, sem máscara
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: BrazilianState;
}

export interface OrderItem {
  coffeeId: Coffee['id'];
  name: string;
  unitPriceCents: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;           // crypto.randomUUID()
  createdAt: string;    // ISO 8601
  items: readonly OrderItem[];
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
}
```

- `readonly` em `tags` e `items` impede mutação acidental (ex.: `push`) em dados do catálogo e do snapshot.
- Rótulos de exibição ficam em constantes (`COFFEE_TAG_LABELS`, `PAYMENT_METHOD_LABELS`), não no tipo; `satisfies Record<…, string>` faz o TypeScript acusar rótulo faltando.
- `CartItem` guarda só referência e quantidade; detalhes vêm do catálogo.
- `OrderItem` copia os dados para que mudanças futuras no catálogo não alterem um pedido confirmado.
- Nenhum dado de cartão é modelado.

### 4.1 Constantes (`src/domain/constants.ts`)
```ts
export const DELIVERY_FEE_CENTS = 350; // R$ 3,50, conforme Figma
export const DELIVERY_ESTIMATE = '20 min – 30 min';
export const COFFEE_TAGS = ['traditional', 'special', 'with-milk', 'alcoholic', 'iced'] as const;
export const COFFEE_TAG_LABELS = { traditional: 'Tradicional', /* ... */ } as const satisfies Record<CoffeeTag, string>;
export const PAYMENT_METHODS = ['credit', 'debit', 'cash'] as const;
export const PAYMENT_METHOD_LABELS = { credit: 'Cartão de crédito', debit: 'Cartão de débito', cash: 'Dinheiro' } as const;
export const BRAZILIAN_STATES = ['AC', 'AL', /* ... 27 UFs */ 'TO'] as const;
export const MIN_ITEM_QUANTITY = 1;   // RN-01
export const POSTAL_CODE_LENGTH = 8;  // RN-07
export const STORAGE_KEYS = {
  cart: 'coffee-delivery:cart:v1',
  theme: 'coffee-delivery:theme:v1',
  lastOrder: 'coffee-delivery:last-order:v1',
} as const;
```

## 5. Context API e `useReducer`

### 5.1 Estado e ações
```ts
export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { coffeeId: string; quantity: number } }
  | { type: 'INCREMENT_ITEM'; payload: { coffeeId: string } }
  | { type: 'DECREMENT_ITEM'; payload: { coffeeId: string } }
  | { type: 'REMOVE_ITEM'; payload: { coffeeId: string } }
  | { type: 'CLEAR_CART' };
```

### 5.2 Comportamento
| Ação | Regra | Métodos |
|---|---|---|
| `ADD_ITEM` | Ignora quantidade não inteira ou < 1 e `coffeeId` fora do catálogo; soma à linha existente ou cria nova. | `find`, `map`, spread |
| `INCREMENT_ITEM` | +1 na linha encontrada. | `map` |
| `DECREMENT_ITEM` | −1; se resultar 0, remove a linha (RN-01). | `map` + `filter` |
| `REMOVE_ITEM` | Remove apenas o café informado. | `filter` |
| `CLEAR_CART` | Retorna `{ items: [] }`. | — |

Ação inválida retorna o **mesmo** estado (referência), evitando re-render. O reducer é puro e não acessa `localStorage`.

### 5.3 Valor do contexto
- Estado: `items`, `detailedItems` (item + dados do café), `invalidItemIds`.
- Derivados (via `useMemo`): `totalUnits`, `subtotalCents`, `deliveryFeeCents`, `totalCents`.
- Ações: `addItem`, `incrementItem`, `decrementItem`, `removeItem`, `clearCart`.

`useCart()` lança erro descritivo se usado fora do `CartProvider`.

## 6. Hooks, efeitos e persistência

| Hook | Responsabilidade |
|---|---|
| `useCart()` | Acesso tipado ao contexto do carrinho. |
| `useTheme()` | `theme`, `toggleTheme()`. |
| `usePostalCodeLookup()` | Estado da consulta (`idle`/`loading`/`success`/`not-found`/`error`), cancelamento via `AbortController`. |

### 6.1 Persistência
- `lib/storage.ts` expõe `readJson(key, schema)` e `writeJson(key, value)`, com `try/catch` (quota, modo privado, JSON inválido).
- Os dados lidos são validados com schemas Zod; inválidos são descartados (chave removida) e o estado seguro é usado.
- Carrinho: hidratação **síncrona** no inicializador do `useReducer` (`useReducer(reducer, undefined, loadCart)`), evitando que o primeiro efeito sobrescreva os dados salvos; um `useEffect` persiste a cada mudança. Itens com `coffeeId` fora do catálogo são descartados na hidratação.
- Tema: `index.html` contém um script inline mínimo que aplica `data-theme` antes do primeiro paint (preferência salva → `prefers-color-scheme`), evitando flash; o `ThemeProvider` lê o mesmo valor e persiste alterações.
- Último pedido: gravado por `orderStorage.save()` antes de `clearCart()`.

## 7. Rotas

| Rota | Página | Responsabilidade |
|---|---|---|
| `/` | `HomePage` | Catálogo e inclusão no carrinho (RF-01 a RF-04). |
| `/checkout` | `CheckoutPage` | Revisão do carrinho, endereço, pagamento e confirmação (RF-05, RF-08 a RF-11). |
| `/success` | `SuccessPage` | Exibição do snapshot (RF-12, RF-13). |
| `*` | `Navigate` | Redireciona para `/`. |

- `react-router` v7 (pacote único que substitui `react-router-dom`): `createBrowserRouter` + `RouterProvider`, com `PageLayout` como rota pai. `routes` é exportado de `src/app/router.tsx` para os testes montarem as mesmas rotas com `createMemoryRouter` (`src/tests/renderWithRouter.tsx`).
- `PageLayout`: link "Pular para o conteúdo", `Header`, `<main id="conteudo">` e `ScrollRestoration`; `useDocumentTitle` define o título da aba por página (ajuda leitores de tela a perceber a navegação).
- Container: utility `app-container` em `index.css` (1120 px de área útil do Figma + margens de 16/32 px).
- Após confirmar: `navigate('/success', { replace: true })`, evitando voltar a um checkout já confirmado.
- `/success` sem snapshot válido exibe `EmptyState` (RN-09).
- Deploy: `vercel.json` com rewrite de todas as rotas para `index.html`.

## 8. Formulário, Zod e ViaCEP

### 8.1 Schema (`checkoutSchema.ts`)
| Campo | Regra |
|---|---|
| `postalCode` | Normalizado para dígitos; exatamente 8. |
| `street` | Obrigatório (trim). |
| `number` | Obrigatório (trim), até 10 caracteres. |
| `complement` | Opcional. |
| `district` | Obrigatório. |
| `city` | Obrigatório. |
| `state` | Maiúsculas; pertence a `BRAZILIAN_STATES`. |
| `paymentMethod` | `z.enum(['credit','debit','cash'])`; mensagem "Selecione uma forma de pagamento". |

O schema valida sintaxe; a existência do CEP é verificada pela API. O tipo do formulário é inferido com `z.infer`.

### 8.2 Serviço ViaCEP (`services/viacep.ts`)
```text
GET https://viacep.com.br/ws/{CEP}/json/
```

```ts
type PostalCodeLookupResult =
  | { status: 'success'; address: Pick<DeliveryAddress, 'postalCode' | 'street' | 'district' | 'city' | 'state'> }
  | { status: 'invalid' }      // não tem 8 dígitos (nenhuma requisição)
  | { status: 'not-found' }    // { erro: true } ou HTTP 400
  | { status: 'error'; reason: 'network' | 'timeout' | 'http' | 'invalid-response' };

lookupPostalCode(cep: string, signal?: AbortSignal): Promise<PostalCodeLookupResult>
```
- Normaliza para dígitos e exige 8 antes da chamada.
- `fetch` com timeout de 8 s (`AbortSignal.timeout` combinado ao sinal externo).
- Verifica `response.ok`; trata `erro: true`/`"true"` como não encontrado.
- Valida o JSON com schema Zod; formato inesperado → `invalid-response`.
- Mapeia `logradouro → street`, `bairro → district`, `localidade → city`, `uf → state`.
- Cancelamento pelo chamador (`AbortError`) não é tratado como erro exibido.

### 8.3 Comportamento no formulário
- Consulta disparada quando o CEP atinge 8 dígitos (e no blur, se ainda não consultado); consulta anterior é abortada.
- Sucesso: `setValue` em rua, bairro, cidade e UF (com `shouldValidate`), substituindo valores de CEP anterior; número/complemento intactos; foco movido para "Número".
- Falha/não encontrado: mensagem em região `aria-live="polite"`; campos editáveis para correção manual; nunca indicar "validado".
- Campos derivados permanecem editáveis (CEP genérico pode vir sem logradouro).
- A integração é real em execução; mocks de `fetch` somente em testes.

## 9. Cálculo e formatação monetária

```ts
export function calculateSubtotal(items: CartItem[], coffees: Coffee[]): number;
export function calculateDeliveryFee(items: CartItem[]): number;
export function calculateTotal(subtotalCents: number, deliveryFeeCents: number): number;
export function findInvalidItems(items: CartItem[], coffees: Coffee[]): string[];
export function calculateLineTotal(unitPriceCents: number, quantity: number): number;
export function countUnits(items: CartItem[]): number; // soma de unidades para o Header (RF-04)
```
- Subtotal: `reduce` de `priceCents * quantity` (inteiros).
- Frete: `DELIVERY_FEE_CENTS` se houver item; senão 0.
- Item sem correspondência no catálogo é reportado por `findInvalidItems` e bloqueia a confirmação (RN-10); não é ignorado silenciosamente.
- `formatCurrency(cents)` usa um único `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` com `cents / 100` apenas na exibição.
- `formatCurrencyParts(cents)` usa o mesmo formatador e separa `{ symbol, amount }` para o card do catálogo ("R$" pequeno + "9,90" grande).

## 10. Tema, tokens, breakpoints e acessibilidade

### 10.1 Tokens (`styles/tokens.css`)
Os tokens usam **os mesmos nomes do Style Guide do Figma** (ver [`docs/figma/README.md`](./figma/README.md)), facilitando a conferência design ↔ código. Valores light = Figma, salvo ajustes de acessibilidade (**AA**); valores dark são próprios (o Figma não tem dark mode). Utilities: `bg-<token>`, `text-<token>`, `border-<token>`.

| Token | Light | Dark | Uso |
|---|---|---|---|
| `yellow-dark` / `yellow` / `yellow-light` | `#C47F17` / `#DBAC2C` / `#F1E9C9` | `#C47F17` / `#DBAC2C` / `#3A2F17` | Ação primária, hover, badge, fundo de tag e carrinho |
| `yellow-ink` *(novo)* | `#8A5A12` | `#E8C063` | Texto/ícone sobre `yellow-light` (tag, ícone do carrinho) |
| `purple-dark` / `purple` / `purple-light` | `#4B2995` / `#8047F8` / `#EBE5F9` | `#5B34C0` / `#A27BFA` / `#2C2342` | Botão de adicionar, ícones, pagamento selecionado, chip de localização |
| `purple-ink` *(novo)* | `#4B2995` | `#CDB8FF` | Texto/ícone sobre `purple-light` |
| `base-title` / `base-subtitle` / `base-text` | `#272221` / `#403937` / `#574F4D` | `#F5F2F1` / `#E6E1DF` / `#D3CCCA` | Textos |
| `base-label` | `#6E6767` **AA** (Figma `#8D8686`) | `#A39C9A` | Descrições, placeholder, "Opcional" |
| `base-hover` / `base-button` / `base-input` / `base-card` | `#D7D5D5` / `#E6E5E5` / `#EDEDED` / `#F3F2F2` | `#4A4341` / `#38312F` / `#2A2625` / `#221F1E` | Superfícies e estados |
| `background` / `white` | `#FAFAFA` / `#FFFFFF` | `#161413` / `#FFFFFF` | Fundo da página; ícone sobre `purple-dark` |
| `on-yellow` *(novo, AA)* | `#272221` | `#272221` | Texto sobre `yellow`/`yellow-dark` (Figma usava branco: 2,1:1) |
| `focus` *(novo)* | `#8047F8` | `#A27BFA` | Anel de foco |
| `danger` *(novo)* | `#C0392B` | `#FF8A80` | Mensagens de erro |

**Regras de combinação** (verificadas por `src/styles/tokens.test.ts` nos dois temas, 20 pares):
- Texto sobre amarelo (`yellow`, `yellow-dark`) usa sempre `on-yellow`; texto sobre `yellow-light` usa `yellow-ink`; sobre `purple-light`, `purple-ink`.
- Texto ≥ 4,5:1; texto grande (título do sucesso) e componentes/foco ≥ 3:1.
- Ícones dentro dos círculos de benefícios da Home são decorativos (`aria-hidden`), pois o texto ao lado comunica a informação.

Implementação:
- `src/styles/tokens.css`: variáveis em `:root, [data-theme='light']` e `[data-theme='dark']`.
- `src/styles/index.css`: `@theme inline` mapeia as variáveis para utilities (a troca de tema não exige re-render); `--color-*: initial` remove a paleta padrão do Tailwind, impedindo cores fora dos tokens; `@custom-variant dark` usa `data-theme`.
- Raios: `rounded-sm` (6 px), `rounded-card` (`6px 36px`, catálogo e sucesso) e `rounded-cart` (`6px 44px`, carrinho).
- Tipografia: `text-title-xl|l|m|s|xs`, `text-l|m|s|xs`, `text-tag`, `text-button-g|m` (tamanho, line-height e peso do Figma); famílias `font-title` (Baloo 2) e `font-sans` (Roboto, padrão do `body`), carregadas do Google Fonts com `display=swap`.
- Base: foco visível global (`:focus-visible`), `::selection` e `prefers-reduced-motion`.

### 10.2 Breakpoints (padrão Tailwind)
`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 px. Mobile-first; verificação em 320, 375/390, 768 e 1280/1440 px.

### 10.3 Acessibilidade
- Labels explícitos, `aria-invalid`, `aria-describedby` em erros.
- Foco visível (`focus-visible:outline` com `--color-focus`) e ordem de tabulação lógica.
- Botões de quantidade: "Diminuir/Aumentar quantidade de {café}".
- Badge do carrinho com texto acessível ("Carrinho, 5 itens").
- Feedback de adição ao carrinho e da consulta de CEP em `aria-live`.
- Pagamento como `radiogroup` nativo (inputs `type="radio"` estilizados), com seleção indicada também por borda/ícone.
- Contraste WCAG 2.2 AA verificado nos dois temas.
- `prefers-reduced-motion` respeitado em transições.

## 11. Testes e qualidade

### 11.1 Ferramentas
`vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`. Setup em `src/tests/setup.ts`; ambiente `jsdom` configurado em `vite.config.ts`.

### 11.2 Unitários
- Reducer: adicionar, acumular, quantidade inválida, incrementar, decrementar até remover, remover, limpar, imutabilidade.
- Pricing: subtotal, frete com/sem itens, total, item inválido.
- `formatCurrency` (inclui `R$ 9,90`, zero e milhares).
- `postalCode`: normalização e máscara.
- Schema do checkout: casos válidos e cada campo inválido.
- ViaCEP: sucesso, inválido sem requisição, `erro: true`, HTTP não-ok, falha de rede, timeout, JSON inválido.
- Storage: JSON corrompido, versão/formato incompatível.
- `orderService`: snapshot independente do carrinho e do catálogo.

### 11.3 Componentes/integração
- `CoffeeCard` seleciona quantidade e adiciona.
- `Header` exibe soma de unidades.
- Carrinho atualiza valores após operações.
- Consulta de CEP preenche campos e preserva número/complemento; erros anunciados.
- Checkout bloqueia carrinho vazio e formulário inválido.
- Confirmação salva snapshot, limpa carrinho e `/success` exibe os dados.
- `/success` sem snapshot mostra estado vazio.
- Tema persiste após remontagem.

### 11.4 Manuais de aceite
- Fluxo completo em 320, 375/390, 768 e 1280/1440 px, nos dois temas.
- Refresh na Home, no Checkout e no Sucesso.
- CEP válido real, inválido, inexistente e API indisponível (DevTools offline).
- Acesso direto a `/checkout` vazio e a `/success` sem pedido.
- Navegação apenas por teclado.
- Console sem erros.

### 11.5 Scripts
```bash
npm install
npm run dev       # servidor local
npm run test      # vitest run
npm run test:watch # vitest em modo watch
npm run lint      # eslint .
npm run build     # tsc -b && vite build
npm run preview   # serve o build
```

## 12. Referência cruzada com o PRD

| Área técnica | Requisitos |
|---|---|
| Catálogo e `CoffeeCard` | RF-01, RF-02; RN-08 |
| Reducer e contexto do carrinho | RF-03, RF-04, RF-05; RN-01, RN-02 |
| Persistência | RF-06; RN-06 |
| Router e `PageLayout` | RF-07; RN-09, RN-10 |
| ViaCEP e formulário Zod | RF-08; RN-07 |
| Pagamento | RF-09; RN-05 |
| Cálculo em centavos | RF-10; RN-03, RN-04 |
| Bloqueio de confirmação | RF-11; RN-10 |
| Snapshot e sucesso | RF-12, RF-13; RN-06, RN-09 |
| Tema | RF-14 |
| Responsividade e acessibilidade | RF-15 |
| Logo e Branding com IA | RF-16 |

## 13. Riscos e decisões técnicas

| Risco | Mitigação |
|---|---|
| ViaCEP indisponível ou lenta | Timeout de 8 s, mensagem clara, preenchimento manual; nunca simular sucesso. |
| Dados antigos/corrompidos no `localStorage` | Chaves versionadas (`:v1`) e validação Zod na leitura. |
| Hidratação apagando o carrinho salvo | Inicialização síncrona do reducer. |
| Flash do tema errado | Script inline em `index.html`. |
| Produto removido do catálogo | Descartado na hidratação; `findInvalidItems` bloqueia confirmação. |
| Precisão monetária | Apenas centavos inteiros no domínio. |
| Rotas SPA no deploy (404) | Rewrite em `vercel.json`. |
| Imagens do Figma indisponíveis | Exports versionados em `src/assets/coffees`; placeholder documentado apenas temporariamente. |
| Escopo | Backend, pagamento real ou extras exigem aprovação e atualização do PRD. |
