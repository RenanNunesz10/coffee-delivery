# Coffee Delivery — Technical Specification

**Versão:** 1.0.0  
**Status:** Base técnica para implementação  
**Última atualização:** 17/11/2026  
**Documento relacionado:** [`PRD_SPEC.md`](./PRD_SPEC.md)

## 1. Stack e justificativas

| Tecnologia | Uso | Justificativa |
|---|---|---|
| React | Interface | Componentização e estado declarativo. |
| TypeScript | Tipagem | Segurança de tipos e contratos explícitos. |
| Vite | Build/dev server | Inicialização rápida e configuração simples. |
| Tailwind CSS | Estilização | Tokens/utilitários e implementação responsiva. |
| React Router DOM | Rotas | Navegação SPA entre Home, Checkout e Confirmação (RF-07). |
| Context API + `useReducer` | Estado global | Centralizar carrinho e operações previsíveis (RF-03 a RF-06). |
| React Hook Form | Formulários | Controle eficiente do formulário de checkout. |
| Zod | Validação | Schemas reutilizáveis e integração com formulários (RF-08, RF-09, RF-11). |
| `@hookform/resolvers` | Integração | Resolver Zod para React Hook Form. |
| Lucide React | Ícones | Ícones consistentes e acessíveis. |
| Vitest + Testing Library | Testes | Testes unitários e de componentes. |
| ESLint | Qualidade | Identificação de problemas estáticos. |

As versões devem ser compatíveis entre si e registradas no lockfile. Evitar adicionar bibliotecas sem necessidade demonstrável.

## 2. Arquitetura da SPA

Arquitetura em camadas leves, orientada a funcionalidades:

1. **Presentation:** páginas e componentes React; não contém regras de negócio complexas.
2. **Application/state:** Context API, reducer e hooks que orquestram ações.
3. **Domain:** tipos, constantes e funções puras de carrinho, preço, frete e pedido.
4. **Infrastructure:** `localStorage`, cliente ViaCEP e adaptadores externos.

### 2.1 Fluxo de dados
- `products.ts` fornece catálogo tipado.
- Componentes disparam ações do contexto.
- `cartReducer` produz novo estado sem mutação.
- Provider persiste o carrinho após alterações.
- Checkout valida dados com Zod e consulta ViaCEP por serviço isolado.
- Funções puras calculam valores em centavos.
- A confirmação cria e persiste `Order` como snapshot antes de limpar o carrinho.
- A rota de confirmação lê o snapshot, nunca reconstrói o pedido a partir do carrinho.

### 2.2 Diagrama de alto nível

```text
App
├── Router
│   ├── HomePage ── ProductCard ── CartContext
│   ├── CheckoutPage ── AddressForm ── ViaCEP service
│   │                 └── OrderSummary
│   └── ConfirmationPage ── Order snapshot
├── CartProvider
│   ├── cartReducer
│   └── localStorage adapter
└── ThemeProvider
    └── theme localStorage adapter
```

## 3. Estrutura de diretórios

```text
coffee-delivery/
├── public/
│   ├── favicon.svg
│   └── brand/
│       ├── coffee-delivery-logo.svg
│       └── coffee-delivery-symbol.svg
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── assets/
│   ├── components/
│   │   ├── Header/
│   │   ├── ThemeToggle/
│   │   ├── QuantityControl/
│   │   ├── ProductCard/
│   │   ├── CartItem/
│   │   ├── OrderSummary/
│   │   └── EmptyState/
│   ├── features/
│   │   ├── catalog/
│   │   │   ├── data/products.ts
│   │   │   ├── components/
│   │   │   └── pages/HomePage.tsx
│   │   ├── cart/
│   │   │   ├── CartContext.tsx
│   │   │   ├── cartReducer.ts
│   │   │   ├── cartStorage.ts
│   │   │   └── cartTypes.ts
│   │   ├── checkout/
│   │   │   ├── components/AddressForm.tsx
│   │   │   ├── schemas/checkoutSchema.ts
│   │   │   ├── services/viacep.ts
│   │   │   └── pages/CheckoutPage.tsx
│   │   └── orders/
│   │       ├── orderStorage.ts
│   │       ├── orderService.ts
│   │       └── pages/ConfirmationPage.tsx
│   ├── hooks/
│   ├── lib/
│   │   ├── formatCurrency.ts
│   │   └── storage.ts
│   ├── domain/
│   │   ├── types.ts
│   │   ├── pricing.ts
│   │   └── constants.ts
│   ├── styles/
│   │   ├── index.css
│   │   └── tokens.css
│   └── main.tsx
├── docs/
│   ├── PRD_SPEC.md
│   ├── TECH_SPEC.md
│   ├── TASKS_SPEC.md
│   └── BRAND_GUIDE.md
├── tests/
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

A estrutura pode ser ajustada durante a implementação, desde que as responsabilidades permaneçam claras e a alteração seja registrada.

## 4. Tipos e interfaces de domínio

Os exemplos abaixo são contratos de referência; manter nomes e campos consistentes em todo o projeto.

```ts
export type CoffeeCategory =
  | 'traditional'
  | 'special'
  | 'with-milk'
  | 'alcoholic'
  | 'iced';

export interface Coffee {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  category: CoffeeCategory;
  image: string;
  tags: string[];
}

export interface CartItem {
  coffeeId: Coffee['id'];
  quantity: number;
}

export interface DeliveryAddress {
  postalCode: string; // oito dígitos, sem máscara no domínio
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string; // UF
}

export type PaymentMethod = 'credit' | 'debit' | 'cash';

export interface OrderItem {
  coffeeId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string; // ISO 8601
  items: OrderItem[];
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
}
```

Regras:
- Preço sempre em centavos inteiros.
- `CartItem` guarda a referência do café e quantidade; detalhes são resolvidos pelo catálogo.
- `OrderItem` copia os dados necessários para que mudanças futuras no catálogo não alterem um pedido já confirmado.
- `complement` pode ser omitido ou string vazia.
- Não armazenar dados de cartão.

## 5. Context API e useReducer

### 5.1 Estado
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

### 5.2 Comportamento das ações
- `ADD_ITEM`: rejeitar quantidade não inteira ou menor que 1; se existir, somar à linha atual; caso contrário, criar linha.
- `INCREMENT_ITEM`: somar uma unidade à linha encontrada.
- `DECREMENT_ITEM`: subtrair uma unidade; se a quantidade resultante for zero, remover a linha (RN-01).
- `REMOVE_ITEM`: remover somente o café informado.
- `CLEAR_CART`: retornar `{ items: [] }`.

O reducer deve ser puro, imutável e coberto por testes. Validar existência do `coffeeId` no catálogo antes de permitir operação e novamente antes de confirmar (RN-10).

### 5.3 Contexto
Expor pelo contexto:
- `items`
- `totalUnits`
- `subtotalCents`
- `deliveryFeeCents`
- `totalCents`
- `addItem`, `incrementItem`, `decrementItem`, `removeItem`, `clearCart`

Evitar colocar lógica de apresentação no reducer.

## 6. Hooks, eventos, efeitos e persistência

Hooks sugeridos:
- `useCart()`: acesso tipado ao contexto.
- `useTheme()`: tema e alternância.
- `useDebounce()` (opcional): evitar consultas repetidas durante digitação, caso a consulta seja disparada automaticamente.
- `useCheckout()` (opcional): orquestração de consulta de CEP se isso não ficar claro na página.

Persistência:
- Chave do carrinho: `coffee-delivery:cart:v1`.
- Chave do tema: `coffee-delivery:theme:v1`.
- Chave do último pedido: `coffee-delivery:last-order:v1`.
- Ler com tratamento de exceção; validar e normalizar dados antes de hidratar.
- Persistir carrinho e tema em efeitos após mudanças.
- Não sobrescrever estado inicial antes de concluir a hidratação, para evitar apagar dados persistidos.
- Se JSON estiver corrompido, iniciar com estado seguro e tratar a chave inválida sem derrubar a aplicação.
- O snapshot de pedido deve ser gravado antes de limpar o carrinho.

## 7. Rotas

| Rota | Página | Responsabilidade |
|---|---|---|
| `/` | `HomePage` | Catálogo e inclusão no carrinho (RF-01 a RF-04). |
| `/checkout` | `CheckoutPage` | Revisão do carrinho, endereço, pagamento e confirmação (RF-05, RF-08 a RF-11). |
| `/confirmation` | `ConfirmationPage` | Exibição do snapshot do pedido (RF-12 e RF-13). |

- Usar `BrowserRouter`, `Routes`, `Route` e `Navigate` conforme necessário.
- Navegação deve ocorrer sem reload (RF-07).
- A rota `/confirmation` deve apresentar estado vazio se não houver snapshot válido (RN-09).
- Após confirmar, navegar para `/confirmation`.
- Não permitir confirmação por acesso direto sem validação dos dados.

## 8. Formulário, Zod e integração ViaCEP

### 8.1 Schema
Criar schema Zod para:
- `postalCode`: exatamente oito dígitos após normalização.
- `street`: obrigatório.
- `number`: obrigatório.
- `complement`: opcional.
- `district`: obrigatório.
- `city`: obrigatório.
- `state`: duas letras e pertencente à lista de UFs brasileiras.
- `paymentMethod`: enum `credit | debit | cash`.

A validação do CEP no schema é sintática; existência do CEP é verificada pela API.

### 8.2 Serviço ViaCEP
Endpoint padrão:
```text
GET https://viacep.com.br/ws/{CEP}/json/
```

Contrato esperado:
```ts
interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
```

Implementar `lookupPostalCode(cep: string)` em módulo isolado:
- Normalizar para dígitos.
- Exigir oito dígitos antes da chamada.
- Usar `fetch` e tratar `response.ok`.
- Tratar `erro === true` como CEP não encontrado.
- Tratar falha de rede, JSON inválido e timeout.
- Mapear `logradouro` → `street`, `bairro` → `district`, `localidade` → `city`, `uf` → `state`.
- Não sobrescrever número ou complemento.
- Limpar ou atualizar campos derivados ao consultar um CEP diferente, evitando manter endereço antigo incorretamente.
- Apresentar loading, sucesso e erro.
- Permitir edição manual em caso de indisponibilidade.
- Usar `AbortController` se houver risco de consultas concorrentes.

A integração deve ser real durante a execução; mocks são permitidos somente nos testes.

## 9. Cálculo e formatação monetária

Constantes centralizadas:
```ts
export const DELIVERY_FEE_CENTS = 500;
```

Funções puras:
```ts
export function calculateSubtotal(
  items: CartItem[],
  coffees: Coffee[],
): number;

export function calculateDeliveryFee(items: CartItem[]): number;

export function calculateTotal(
  subtotalCents: number,
  deliveryFeeCents: number,
): number;
```

- Subtotal: soma de `priceCents * quantity`.
- Frete: 500 centavos quando houver ao menos um item; caso contrário, zero.
- Total: subtotal + frete.
- Item sem correspondência no catálogo deve ser tratado como inválido, não ignorado silenciosamente.
- Formatação centralizada com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.

## 10. Estratégia de tema, tokens e acessibilidade

### 10.1 Tema
- Definir `data-theme="light"` ou `data-theme="dark"` no elemento raiz.
- Tokens semânticos em CSS: `--color-background`, `--color-surface`, `--color-text`, `--color-muted`, `--color-primary`, `--color-border`, `--color-danger`, `--color-success`.
- Tailwind deve consumir os tokens, evitando cores arbitrárias espalhadas.
- Inicializar com preferência salva; se ausente, consultar `prefers-color-scheme`.
- Persistir alternância (RF-14).

### 10.2 Breakpoints
Usar breakpoints coerentes com Tailwind:
- `sm`: 640 px
- `md`: 768 px
- `lg`: 1024 px
- `xl`: 1280 px

Projetar mobile-first e verificar larguras mínimas de 360 px (RF-15).

### 10.3 Acessibilidade
- Labels explícitos, `aria-invalid`, `aria-describedby` e mensagens de erro.
- Foco visível e ordem de tabulação lógica.
- Botões de quantidade com nomes como “Aumentar quantidade de [café]”.
- Feedback de adição e consulta de CEP com `aria-live`.
- Contraste WCAG AA como meta.
- Não depender exclusivamente de cor para estados.

## 11. Testes e qualidade

### 11.1 Testes unitários
- Reducer: adicionar, acumular, incrementar, decrementar, remover, limpar.
- Cálculo: subtotal, frete com/sem itens, total e centavos.
- Formatação BRL.
- Normalização e validação de CEP.
- Mapeamento da resposta ViaCEP e tratamento de erro.
- Criação de snapshot de pedido.

### 11.2 Testes de componentes/integração
- ProductCard seleciona quantidade e adiciona.
- Header exibe soma de unidades.
- Carrinho atualiza valores após operações.
- Checkout bloqueia dados inválidos.
- Consulta CEP preenche os campos corretos e preserva número/complemento.
- Erros de CEP são anunciados e permitem correção.
- Confirmação exibe snapshot após carrinho limpo.
- Tema persiste após refresh.

### 11.3 Testes manuais de aceite
- Fluxo completo em viewport 360 px, 768 px e 1280 px.
- Refresh na Home com itens no carrinho.
- CEP válido, inválido, não encontrado e API indisponível.
- Acesso direto a `/checkout` com carrinho vazio.
- Acesso direto a `/confirmation` sem pedido.
- Navegação por teclado e conferência de foco.
- Alternância de tema em todas as rotas.

### 11.4 Comandos esperados
Ajustar scripts conforme `package.json`:
```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
```

## 12. Referência cruzada com PRD

| Área técnica | Requisitos relacionados |
|---|---|
| Catálogo e componentes de produto | RF-01, RF-02 |
| Reducer e contexto do carrinho | RF-03, RF-04, RF-05; RN-01, RN-02 |
| Persistência | RF-06; RN-06 |
| Router | RF-07; RN-09, RN-10 |
| ViaCEP e formulário Zod | RF-08; RN-07 |
| Pagamento | RF-09; RN-05 |
| Cálculo em centavos | RF-10; RN-03, RN-04 |
| Bloqueio de confirmação | RF-11; RN-10 |
| Snapshot e sucesso | RF-12, RF-13; RN-06, RN-09 |
| Tema | RF-14 |
| Responsividade/acessibilidade | RF-15 |
| Logo e documentação da marca | RF-16 |
| Catálogo local tipado | RN-08 |

## 13. Riscos e decisões técnicas
- **Indisponibilidade ViaCEP:** exibir erro e permitir preenchimento manual; não simular consulta bem-sucedida.
- **Dados antigos no localStorage:** versionar chaves e validar conteúdo.
- **Pedido após refresh:** persistir snapshot separado do carrinho.
- **Produto removido do catálogo:** invalidar item e impedir confirmação até correção/remoção.
- **Precisão monetária:** usar exclusivamente centavos inteiros no domínio.
- **Escopo:** não introduzir backend ou pagamento real sem aprovação e atualização do PRD.
