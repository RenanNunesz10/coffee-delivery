# Coffee Delivery — Plano de Implementação (TASKS)

**Versão:** 1.3.0
**Última atualização:** 17/11/2026
**Documentos relacionados:** [`PRD_SPEC.md`](./PRD_SPEC.md) · [`TECH_SPEC.md`](./TECH_SPEC.md) · [`AGENTS.md`](../AGENTS.md)

## Histórico de versões

| Versão | Data | Alteração |
|---|---|---|
| 1.0.0 | 17/11/2026 | Versão inicial (30 tarefas). |
| 1.1.0 | 17/11/2026 | Reordenação (cálculos antes dos componentes do carrinho), tarefas de `AI_USAGE.md`, Branding com IA, screenshots; rota `/success`; nomes de componentes do enunciado. |
| 1.2.0 | 17/11/2026 | Fidelidade ao Figma: frete 350 centavos; Phosphor Icons; TASK-005 inclui ilustrações geradas com IA; preço da linha do carrinho. |
| 1.3.0 | 17/11/2026 | TASK-005 passa a criar assets provisórios em SVG; nova TASK-032 aplica a identidade final criada com IA (antes do deploy). Push para o GitHub somente ao final do projeto. |

## Como trabalhar com este checklist

- Executar as tarefas na ordem, respeitando dependências.
- Uma tarefa pequena por vez; não gerar a aplicação inteira de uma só vez.
- Antes de iniciar: conferir objetivo, requisitos e critério de pronto.
- Ao concluir: marcar `[x]`, atualizar o status, registrar o teste no **Registro de execução** e criar o commit semântico indicado.
- Interações relevantes com a IA são registradas em `docs/AI_USAGE.md` ao longo do projeto.
- Commits são locais durante o desenvolvimento; o push para o GitHub é feito somente ao final, antes do deploy.
- Status permitidos: `Pendente`, `Em andamento`, `Bloqueada`, `Concluída`.

## Checklist

### Fase 0 — Planejamento e fundação

- [x] **TASK-001 — Revisar especificações e diretrizes do agente**
  - **Objetivo:** alinhar PRD, TECH e TASKS ao enunciado; criar `AGENTS.md` e `CLAUDE.md`.
  - **Requisitos:** RF-01 a RF-16; RN-01 a RN-10.
  - **Arquivos:** `docs/PRD_SPEC.md`, `docs/TECH_SPEC.md`, `docs/TASKS_SPEC.md`, `AGENTS.md`, `CLAUDE.md`.
  - **Critério de pronto:** IDs, rotas, frete, viewports e escopo consistentes entre os documentos e o enunciado.
  - **Teste/validação:** revisão cruzada de IDs, rotas e critérios.
  - **Commit:** `docs: define product and technical specifications`
  - **Status:** Concluída

- [x] **TASK-002 — Ajustar projeto Vite inicial**
  - **Objetivo:** partindo do scaffold existente (commit `1e3f0b5`), mover `App` para `src/app/`, remover boilerplate do template (assets, CSS e conteúdo de demonstração), definir `lang="pt-BR"` e título.
  - **Requisitos:** base para RF-01 a RF-16.
  - **Arquivos:** `index.html`, `src/main.tsx`, `src/app/App.tsx`, remoção de `src/App.*`, `src/assets/{react,vite}.svg`, `src/assets/hero.png`, `public/icons.svg`, `src/index.css`; README do template substituído. O `public/favicon.svg` do Vite permanece até a TASK-005.
  - **Critério de pronto:** `npm run dev` e `npm run build` sem erros; nenhum resíduo do template.
  - **Teste/validação:** servidor local e `npm run build`.
  - **Commit:** `chore: clean up vite scaffold and app structure`
  - **Status:** Concluída

- [x] **TASK-003 — Configurar Tailwind, lint e testes**
  - **Objetivo:** instalar Tailwind CSS v4 (`@tailwindcss/vite`), Vitest, Testing Library e jsdom; criar script `test`.
  - **Requisitos:** RNF de qualidade (PRD 8.6).
  - **Arquivos:** `package.json`, `vite.config.ts`, `src/styles/index.css`, `src/tests/setup.ts`, teste inicial.
  - **Critério de pronto:** `dev`, `build`, `lint` e `test` executam com sucesso.
  - **Teste/validação:** rodar os quatro scripts.
  - **Commit:** `chore: configure styling lint and test tooling`
  - **Status:** Concluída

- [x] **TASK-004 — Criar registro de uso de IA**
  - **Objetivo:** criar `docs/AI_USAGE.md` com modelo de registro e as primeiras interações (revisão das SPECs, análise de arquitetura).
  - **Requisitos:** PRD seção 9.
  - **Arquivos:** `docs/AI_USAGE.md`.
  - **Critério de pronto:** modelo com prompt, objetivo, resposta resumida, decisão e evidência; ao menos uma entrada real.
  - **Teste/validação:** revisão do documento.
  - **Commit:** `docs: add ai usage log`
  - **Status:** Concluída

### Fase 1 — Identidade e fundação visual

- [x] **TASK-005 — Criar identidade visual provisória em SVG**
  - **Objetivo:** criar logo, símbolo/favicon, ilustração do hero e ilustração de sucesso em SVG **provisórios**, coerentes com a paleta do Figma, para permitir visualizar o projeto enquanto as imagens finais com IA não ficam prontas (substituídas na TASK-032).
  - **Requisitos:** RF-16 (parcial), RF-14.
  - **Arquivos:** `public/favicon.svg`, `src/assets/brand/*`, `src/assets/hero/*`, `src/assets/illustrations/*`, `docs/BRAND_GUIDE.md` (rascunho: paleta, tipografia, lista de assets provisórios).
  - **Critério de pronto:** SVGs com mesmos nomes/dimensões que os assets finais terão; logo com variação light/dark; favicon legível em 16–48 px; assets marcados como provisórios no `BRAND_GUIDE.md`.
  - **Teste/validação:** visualização dos SVGs em tamanho pequeno e nos dois temas; `npm run build`.
  - **Commit:** `feat: add provisional svg brand assets`
  - **Status:** Concluída

- [x] **TASK-006 — Definir tokens e estilos globais**
  - **Objetivo:** tokens semânticos de cor (light/dark), tipografia (Baloo 2, Roboto), raios e sombras; integração com `@theme`.
  - **Requisitos:** RF-14, RF-15, RF-16.
  - **Arquivos:** `src/styles/tokens.css`, `src/styles/index.css`, `index.html` (fontes).
  - **Critério de pronto:** estilos globais usam somente tokens; sem cores arbitrárias.
  - **Teste/validação:** contraste e renderização básica nos dois temas.
  - **Commit:** `style: define design tokens and global styles`
  - **Status:** Concluída

- [x] **TASK-007 — Implementar tema**
  - **Objetivo:** `ThemeProvider`, `useTheme`, `ThemeToggle`, persistência e script anti-flash.
  - **Requisitos:** RF-14.
  - **Arquivos:** `src/features/theme/*`, `src/components/ThemeToggle/*`, `src/app/providers.tsx`, `index.html`.
  - **Critério de pronto:** tema muda globalmente, respeita `prefers-color-scheme` na primeira visita, persiste após refresh, sem flash.
  - **Teste/validação:** teste unitário da persistência; verificação manual.
  - **Commit:** `feat: implement persistent light and dark themes`
  - **Status:** Concluída

### Fase 2 — Domínio, catálogo e navegação

- [x] **TASK-008 — Definir tipos e constantes de domínio**
  - **Objetivo:** tipos `Coffee`, `CoffeeTag`, `CartItem`, `DeliveryAddress`, `PaymentMethod`, `OrderItem`, `Order`; constantes (frete, UFs, chaves de storage, rótulos).
  - **Requisitos:** RF-01 a RF-13; RN-01 a RN-10.
  - **Arquivos:** `src/domain/types.ts`, `src/domain/constants.ts`.
  - **Critério de pronto:** tipos e constantes compilando em modo `strict`.
  - **Teste/validação:** `tsc` sem erros.
  - **Commit:** `feat: define coffee delivery domain types`
  - **Status:** Concluída

- [x] **TASK-009 — Criar catálogo local tipado**
  - **Objetivo:** cadastrar os cafés do Figma com imagens, descrição, preço em centavos e tags.
  - **Requisitos:** RF-01; RN-08.
  - **Arquivos:** `src/features/catalog/data/coffees.ts`, `src/assets/coffees/*`.
  - **Critério de pronto:** IDs únicos, preços inteiros, ao menos uma tag por café, imagens existentes.
  - **Teste/validação:** teste de integridade do catálogo.
  - **Commit:** `feat: add typed coffee catalog`
  - **Status:** Concluída

- [x] **TASK-010 — Implementar cálculos e formatação monetária**
  - **Objetivo:** `pricing.ts` (subtotal, frete, total, itens inválidos) e `formatCurrency`.
  - **Requisitos:** RF-10; RN-03, RN-04, RN-10.
  - **Arquivos:** `src/domain/pricing.ts`, `src/lib/formatCurrency.ts`, testes.
  - **Critério de pronto:** frete 0 sem itens e 350 com itens; sem float acumulado; item inexistente detectado.
  - **Teste/validação:** testes unitários de carrinho vazio, múltiplos itens e item inválido.
  - **Commit:** `feat: centralize monetary calculations and delivery fee`
  - **Status:** Concluída

- [x] **TASK-011 — Configurar React Router e PageLayout**
  - **Objetivo:** rotas `/`, `/checkout`, `/success` e `*`, com `PageLayout`.
  - **Requisitos:** RF-07; RN-09.
  - **Arquivos:** `src/app/router.tsx`, `src/app/App.tsx`, `src/components/PageLayout/*`, páginas placeholder.
  - **Critério de pronto:** navegação sem reload; URL direta funciona; rota desconhecida redireciona para `/`.
  - **Teste/validação:** teste de navegação e acesso direto.
  - **Commit:** `feat: configure application routes`
  - **Status:** Concluída

- [x] **TASK-012 — Criar Header responsivo**
  - **Objetivo:** logo, indicador de localização, `ThemeToggle` e link do carrinho com `CartBadge`.
  - **Requisitos:** RF-04, RF-14, RF-15, RF-16.
  - **Arquivos:** `src/components/Header/*`.
  - **Critério de pronto:** Header fiel ao Figma, adaptado a 320 px; badge oculto quando zero.
  - **Teste/validação:** teste do badge com valores; verificação responsiva.
  - **Commit:** `feat: add responsive application header`
  - **Status:** Concluída

- [x] **TASK-013 — Implementar QuantityInput e CoffeeCard**
  - **Objetivo:** card do café e controle de quantidade acessível.
  - **Requisitos:** RF-01, RF-02, RF-15.
  - **Arquivos:** `src/components/QuantityInput/*`, `src/features/catalog/components/CoffeeCard.tsx`.
  - **Critério de pronto:** dados do café exibidos; quantidade ≥ 1; operável por mouse e teclado.
  - **Teste/validação:** testes de incremento/decremento, limite e rótulos acessíveis.
  - **Commit:** `feat: build coffee cards and quantity input`
  - **Status:** Concluída

- [x] **TASK-014 — Montar Home**
  - **Objetivo:** Hero e `CoffeeCatalog` conforme Figma.
  - **Requisitos:** RF-01, RF-02, RF-15.
  - **Arquivos:** `src/features/catalog/pages/HomePage.tsx`, `src/features/catalog/components/*`.
  - **Critério de pronto:** catálogo completo e grid responsivo.
  - **Teste/validação:** inspeção em 320, 375, 768 e 1280 px.
  - **Commit:** `feat: implement coffee catalog home page`
  - **Status:** Concluída

### Fase 3 — Carrinho

- [x] **TASK-015 — Implementar reducer do carrinho**
  - **Objetivo:** ações `ADD_ITEM`, `INCREMENT_ITEM`, `DECREMENT_ITEM`, `REMOVE_ITEM`, `CLEAR_CART`.
  - **Requisitos:** RF-03, RF-05; RN-01, RN-02.
  - **Arquivos:** `src/features/cart/cartReducer.ts`, `src/features/cart/cartTypes.ts`.
  - **Critério de pronto:** reducer puro e imutável; sem linhas duplicadas; remove ao decrementar de 1.
  - **Teste/validação:** testes unitários de todas as ações e limites.
  - **Commit:** `feat: implement cart reducer and actions`
  - **Status:** Concluída

- [x] **TASK-016 — Criar CartProvider e persistência**
  - **Objetivo:** Context, `useCart`, valores derivados e sincronização com `localStorage`.
  - **Requisitos:** RF-03 a RF-06; RN-06.
  - **Arquivos:** `src/features/cart/CartContext.tsx`, `useCart.ts`, `cartStorage.ts`, `src/lib/storage.ts`, `src/app/providers.tsx`.
  - **Critério de pronto:** hidrata e persiste; dados corrompidos ou itens inexistentes não quebram a aplicação.
  - **Teste/validação:** testes de storage e refresh manual.
  - **Commit:** `feat: add persistent cart context`
  - **Status:** Concluída

- [x] **TASK-017 — Integrar adicionar ao carrinho e contador**
  - **Objetivo:** conectar `CoffeeCard` ao contexto e `CartBadge` a `totalUnits`; feedback acessível ao adicionar.
  - **Requisitos:** RF-02, RF-03, RF-04; RN-02.
  - **Arquivos:** `CoffeeCard`, `Header`, `useCart`.
  - **Critério de pronto:** adicionar o mesmo café acumula; contador soma unidades.
  - **Teste/validação:** teste de integração com itens iguais e diferentes.
  - **Commit:** `feat: connect catalog to cart state`
  - **Status:** Concluída

- [x] **TASK-018 — Criar componentes de revisão do carrinho**
  - **Objetivo:** `CartItem`, `CartSummary` e `EmptyState`.
  - **Requisitos:** RF-05, RF-10, RF-15; RN-01, RN-03, RN-04, RN-09.
  - **Arquivos:** `src/features/cart/components/*`, `src/components/EmptyState/*`.
  - **Critério de pronto:** alterações atualizam valores imediatamente; cada linha exibe `preço unitário × quantidade`; moeda em BRL; estado vazio com retorno à Home.
  - **Teste/validação:** incrementar, decrementar até remover, remover e conferir valores.
  - **Commit:** `feat: add cart item management and order summary`
  - **Status:** Concluída

### Fase 4 — Checkout

- [x] **TASK-019 — Definir schema do checkout**
  - **Objetivo:** schema Zod de endereço e pagamento; utilitário de CEP.
  - **Requisitos:** RF-08, RF-09, RF-11; RN-07, RN-10.
  - **Arquivos:** `src/features/checkout/schemas/checkoutSchema.ts`, `src/lib/postalCode.ts`.
  - **Critério de pronto:** obrigatórios, CEP, UF e pagamento validados; complemento opcional.
  - **Teste/validação:** testes de schema válidos e inválidos.
  - **Commit:** `feat: add checkout form validation schemas`
  - **Status:** Concluída

- [x] **TASK-020 — Integrar consulta ViaCEP**
  - **Objetivo:** `lookupPostalCode` com timeout, validação de resposta e resultados discriminados.
  - **Requisitos:** RF-08; RN-07.
  - **Arquivos:** `src/features/checkout/services/viacep.ts`, testes.
  - **Critério de pronto:** CEP válido retorna endereço normalizado; erros diferenciados.
  - **Teste/validação:** testes de sucesso, inválido, não encontrado, rede, timeout e JSON inválido.
  - **Commit:** `feat: integrate viacep postal code lookup`
  - **Status:** Concluída

- [x] **TASK-021 — Construir DeliveryAddressForm**
  - **Objetivo:** campos, máscara de CEP, `usePostalCodeLookup`, loading, feedback e preenchimento automático.
  - **Requisitos:** RF-08, RF-11, RF-15; RN-07.
  - **Arquivos:** `src/features/checkout/components/DeliveryAddressForm.tsx`, `src/features/checkout/hooks/usePostalCodeLookup.ts`.
  - **Critério de pronto:** rua, bairro, cidade e UF preenchidos; número/complemento preservados; erro permite correção manual.
  - **Teste/validação:** teste de integração com `fetch` mockado e uso por teclado; consulta real manual.
  - **Commit:** `feat: build address form with viacep autofill`
  - **Status:** Concluída

- [x] **TASK-022 — Implementar PaymentMethodSelector**
  - **Objetivo:** grupo de rádio para crédito, débito e dinheiro.
  - **Requisitos:** RF-09, RF-11; RN-05.
  - **Arquivos:** `src/features/checkout/components/PaymentMethodSelector.tsx`.
  - **Critério de pronto:** seleção obrigatória; sem campos de cartão; seleção visível sem depender só de cor.
  - **Teste/validação:** ausência de seleção e cada uma das três opções; navegação por setas.
  - **Commit:** `feat: add checkout payment method selection`
  - **Status:** Concluída

- [x] **TASK-023 — Montar CheckoutPage**
  - **Objetivo:** integrar formulário, pagamento, carrinho, resumo e estado vazio.
  - **Requisitos:** RF-05, RF-08 a RF-11, RF-15.
  - **Arquivos:** `src/features/checkout/pages/CheckoutPage.tsx`.
  - **Critério de pronto:** layout em coluna no celular e duas colunas no desktop; estado vazio; confirmação inválida bloqueada.
  - **Teste/validação:** fluxo válido, carrinho vazio e formulário inválido.
  - **Commit:** `feat: implement checkout page`
  - **Status:** Concluída

### Fase 5 — Pedido e sucesso

- [x] **TASK-024 — Criar serviço e persistência do pedido**
  - **Objetivo:** `createOrder` (snapshot) e `orderStorage` (salvar/ler com validação).
  - **Requisitos:** RF-12, RF-13; RN-06, RN-10.
  - **Arquivos:** `src/features/orders/orderService.ts`, `src/features/orders/orderStorage.ts`.
  - **Critério de pronto:** pedido copia itens, endereço, pagamento e valores; independente do carrinho e do catálogo.
  - **Teste/validação:** testes de snapshot e leitura válida/inválida.
  - **Commit:** `feat: create independent order snapshot`
  - **Status:** Concluída

- [x] **TASK-025 — Implementar confirmação do pedido**
  - **Objetivo:** revalidar, salvar snapshot, limpar carrinho e navegar para `/success`.
  - **Requisitos:** RF-11, RF-12, RF-13; RN-06, RN-10.
  - **Arquivos:** `CheckoutPage`, `orderService`, `CartContext`.
  - **Critério de pronto:** somente pedido válido é salvo; snapshot gravado antes da limpeza.
  - **Teste/validação:** pedido válido, carrinho vazio e produto inexistente.
  - **Commit:** `feat: confirm valid orders and clear cart`
  - **Status:** Concluída

- [x] **TASK-026 — Criar SuccessPage**
  - **Objetivo:** `OrderSuccess` com endereço, previsão e pagamento; estado vazio sem pedido.
  - **Requisitos:** RF-12, RF-13; RN-06, RN-09.
  - **Arquivos:** `src/features/orders/pages/SuccessPage.tsx`, `src/features/orders/components/OrderSuccess.tsx`.
  - **Critério de pronto:** dados corretos com carrinho vazio e após refresh; acesso sem pedido mostra estado vazio.
  - **Teste/validação:** com e sem snapshot, inclusive após refresh.
  - **Commit:** `feat: add order success page`
  - **Status:** Concluída

### Fase 6 — Responsividade, acessibilidade, qualidade e entrega

- [ ] **TASK-027 — Revisar responsividade ponta a ponta**
  - **Objetivo:** ajustar todas as telas para celular, tablet e desktop.
  - **Requisitos:** RF-15.
  - **Arquivos:** componentes e estilos de todas as páginas.
  - **Critério de pronto:** fluxo completo em 320, 375/390, 768 e 1280/1440 px, sem overflow horizontal.
  - **Teste/validação:** inspeção manual nos viewports, nos dois temas.
  - **Commit:** `style: refine responsive layouts across the app`
  - **Status:** Pendente

- [ ] **TASK-028 — Revisar acessibilidade**
  - **Objetivo:** labels, foco, teclado, anúncios e contraste.
  - **Requisitos:** RF-08, RF-11, RF-14, RF-15.
  - **Arquivos:** componentes de formulário, botões, estados e estilos.
  - **Critério de pronto:** fluxo completo por teclado; erros e loading anunciados; contraste AA.
  - **Teste/validação:** checklist manual e Lighthouse/axe.
  - **Commit:** `fix: improve keyboard and screen reader accessibility`
  - **Status:** Pendente

- [ ] **TASK-029 — Executar testes integrados e corrigir defeitos**
  - **Objetivo:** cobrir cenários de aceitação e corrigir regressões.
  - **Requisitos:** RF-01 a RF-16; RN-01 a RN-10.
  - **Arquivos:** testes e código corrigido.
  - **Critério de pronto:** test, lint e build passam; console limpo no fluxo principal.
  - **Teste/validação:** `npm run test`, `npm run lint`, `npm run build` e fluxo manual completo.
  - **Commit:** `test: cover coffee delivery purchase flow`
  - **Status:** Pendente

- [ ] **TASK-032 — Substituir assets provisórios pela identidade criada com IA** *(executar antes da TASK-030)*
  - **Objetivo:** aplicar a logo e as ilustrações finais geradas com IA pelo aluno (logo, favicon, hero sem a logo original, ilustração de sucesso) no lugar dos SVGs provisórios da TASK-005.
  - **Requisitos:** RF-16, RF-14.
  - **Arquivos:** `public/favicon.svg`, `public/brand/*`, `src/assets/brand/*`, `src/assets/hero/*`, `src/assets/illustrations/*`, `docs/BRAND_GUIDE.md`.
  - **Critério de pronto:** nenhum asset provisório restante; logo light/dark e favicon legíveis; `BRAND_GUIDE.md` com conceito final e seção **Branding com IA** (ferramenta, prompt, resultado, motivos, termos de uso) cobrindo logo e ilustrações.
  - **Teste/validação:** legibilidade em 16–48 px, contraste nos dois temas, ausência de imagens quebradas, `npm run build`.
  - **Commit:** `feat: apply ai generated brand identity`
  - **Status:** Pendente

- [ ] **TASK-030 — Preparar deploy**
  - **Objetivo:** publicar em hospedagem estática com rewrite SPA.
  - **Requisitos:** RF-07, RF-15.
  - **Arquivos:** `vercel.json` (ou `netlify.toml`), `README.md`.
  - **Critério de pronto:** build publicado; URLs diretas funcionam; ViaCEP funciona no domínio publicado.
  - **Teste/validação:** smoke test de `/`, `/checkout` e `/success` no ambiente publicado.
  - **Commit:** `chore: prepare production deployment`
  - **Status:** Pendente

- [ ] **TASK-031 — Finalizar documentação e evidências**
  - **Objetivo:** README completo, screenshots, `AI_USAGE.md` com ≥ 3 interações e SPECs refletindo a implementação real.
  - **Requisitos:** RF-16; RN-08; PRD seções 9 e 10.
  - **Arquivos:** `README.md`, `docs/screenshots/*`, `docs/AI_USAGE.md`, `docs/BRAND_GUIDE.md`, SPECs.
  - **Critério de pronto:** README com objetivos, stack, instalação, scripts, decisões, Figma, branding, IA, deploy e screenshots (Home, Checkout, Sucesso e Dark Mode em mobile; desktop); instalação reproduzível.
  - **Teste/validação:** seguir o README em clone limpo.
  - **Commit:** `docs: document setup brand and implementation decisions`
  - **Status:** Pendente

## Registro de execução

| Data | Tarefa | Resultado/teste realizado | Commit |
|---|---|---|---|
| 17/11/2026 | TASK-001 | Revisão cruzada PRD × TECH × TASKS × enunciado: IDs RF-01–RF-16 e RN-01–RN-10 consistentes; rota alterada para `/success`; viewports 320–1440 px; justificativa Tailwind registrada; ordem de tarefas corrigida (cálculos antes do carrinho); `AGENTS.md` e `CLAUDE.md` criados. | `docs: define product and technical specifications` |
| 17/11/2026 | TASK-002 | Boilerplate do Vite removido; `App` em `src/app/`; `lang="pt-BR"` e título. `npm run build` OK (15 módulos, 219,65 kB JS); `npm run lint` sem erros; `vite` servindo `/` com HTTP 200, `lang="pt-BR"` e `<title>Coffee Delivery</title>`. | `chore: clean up vite scaffold and app structure` |
| 17/11/2026 | TASK-003 | Instalados Tailwind CSS 4.3.5 (`@tailwindcss/vite`), Vitest 5.1.0, jsdom 29, Testing Library (react 16, user-event 14, jest-dom 7); `strict: true` explícito nos tsconfig; scripts `test`/`test:watch`. `npm run test`: 1 arquivo, 1 teste passou; `npm run lint` sem erros; `npm run build` OK (CSS 7,30 kB com classes Tailwind geradas); `vite` HTTP 200. `npm audit`: 0 vulnerabilidades em produção; 12 altas apenas em dependências de desenvolvimento (`picomatch`), sem correção não-breaking. | `chore: configure styling lint and test tooling` |
| 17/11/2026 | TASK-004 | `docs/AI_USAGE.md` criado com modelo (prompt, objetivo, resposta, análise crítica, decisão, evidência) e 5 interações reais (IA-01 a IA-05) com commits de evidência conferidos em `git log`. | `docs: add ai usage log` |
| 17/11/2026 | TASK-005 | Criados SVGs provisórios: símbolo, logo light/dark, favicon, ilustração do hero (substitui a foto com a logo original) e ilustração de sucesso; `BRAND_GUIDE.md` em rascunho. SVGs renderizados em PNG para revisão: favicon reconhecível em 16 e 96 px; logo legível em fundo claro e escuro; ilustrações sem cortes. `npm run build` OK, `npm run lint` sem erros, `npm run test` 1/1. | `feat: add provisional svg brand assets` |
| 17/11/2026 | TASK-006 | Tokens light/dark com nomes do Figma em `tokens.css`; `@theme inline` sem paleta padrão do Tailwind; tipografia, raios, foco, `prefers-reduced-motion`; fontes Baloo 2/Roboto. Contraste: 4 combinações do Figma reprovavam AA e foram ajustadas (D10). `npm run test`: 42/42 (20 pares × 2 temas + paridade + App); `lint` sem erros; `build` OK (CSS 9,83 kB, sem `--color-red-500`, com `[data-theme=dark]`). Página de amostra renderizada no Chrome headless nos dois temas: fontes carregadas, cantos assimétricos e textos legíveis. | `style: define design tokens and global styles` |
| 17/11/2026 | TASK-007 | ThemeProvider + `useTheme` + `ThemeToggle` (Phosphor), persistência em `coffee-delivery:theme:v1`, fallback para `prefers-color-scheme` (acompanha mudanças do sistema até haver escolha), script anti-flash em `index.html`. `npm run test`: 55/55 (storage, toggle, teclado, remontagem, sistema, chave do script); `lint` sem erros; `build` OK. Navegador (Chrome headless via `vite preview`): sistema escuro → `dark`; sistema claro → `light`; Tab+Enter alterna e grava; reload mantém `dark`; com o bundle JS bloqueado o script inline já aplica `dark` (sem flash); console sem erros. | `feat: implement persistent light and dark themes` |
| 18/11/2026 | TASK-008 | `types.ts` (Coffee, CoffeeTag, CartItem, DeliveryAddress, BrazilianState, PaymentMethod, OrderItem, Order; uniões derivadas das listas `as const`) e `constants.ts` (frete 350, previsão, tags, pagamentos, 27 UFs, rótulos com `satisfies`, quantidade mínima, tamanho do CEP, chaves de storage). `tsc -b` sem erros; `npm run test`: 60/60 (5 novos de integridade das constantes); `lint` sem erros; `build` OK. | `feat: define coffee delivery domain types` |
| 18/11/2026 | TASK-009 | `coffees.ts` com os 14 cafés do Figma (textos, tags, 990 centavos, imagens WebP) e helpers `findCoffee`/`isKnownCoffee`. `npm run test`: 78/78 (18 novos: quantidade, IDs únicos em slug, campos obrigatórios por café, imagem própria por café, busca por ID); `lint` sem erros; `build` OK. | `feat: add typed coffee catalog` |
| 18/11/2026 | TASK-010 | `pricing.ts` (linha, subtotal, frete, total, itens inválidos, contagem de unidades) e `formatCurrency`/`formatCurrencyParts`. `npm run test`: 92/92 (14 novos: soma em centavos, 0,10 × 3 sem erro de float, frete 0/350, carrinho vazio, exemplo do Figma R$ 33,20, item inexistente reportado, unidades × tipos, formatos BRL incl. milhar); `lint` sem erros; `build` OK. | `feat: centralize monetary calculations and delivery fee` |
| 18/11/2026 | TASK-011 | `react-router` 7.18 instalado; rotas `/`, `/checkout`, `/success` e `*` → `/` com `PageLayout` (skip link, Header provisório, `main#conteudo`, `ScrollRestoration`), páginas placeholder e `useDocumentTitle`; utility `app-container`. `npm run test`: 121/121 (rotas: acesso direto às 3 URLs com título da aba, redirecionamento de rota desconhecida, navegação por link mantendo o mesmo Header montado, skip link); `lint` sem erros; `build` OK. | `feat: configure application routes` |
| 18/11/2026 | TASK-012 | Header do Figma com logo por tema, `LocationChip` (só ícone abaixo de 640 px), `ThemeToggle` e `CartLink` com badge (oculto em zero, nome acessível "Carrinho, N itens"); Header fixo (decisão D11). `npm run test`: 127/127 (6 novos: link da logo, badge oculto/1/5 com singular e plural, localização condicional, troca de logo por tema); `lint` sem erros; `build` OK. Navegador: 320 e 1280 px nos dois temas sem overflow horizontal e sem erros de console. | `feat: add responsive application header` |
| 18/11/2026 | TASK-013 | `QuantityInput` (−/+ rotulados "Diminuir/Aumentar quantidade de {café}", `output` com `aria-live`, diminuir desabilitável, só inteiros) e `CoffeeCard` (imagem, tags, nome, descrição, preço com `formatCurrencyParts`, quantidade inicial 1 sem descer abaixo de 1, botão "Adicionar N {café} ao carrinho", anúncio em `role=status` e ícone de confirmação por 2 s). `npx vitest` nos componentes: 7/7 (rótulos, clique, limite, teclado Enter/Espaço, dados do card, adicionar com reset para 1); `tsc` e `lint` sem erros. | `feat: build coffee cards and quantity input` |
| 18/11/2026 | TASK-014 | Home com `Hero` (título, subtítulo, 4 benefícios com ícones decorativos, ilustração provisória, fundo desfocado do Figma com máscara) e `CoffeeCatalog` (grade `auto-fill` de 16 rem: 1/2/4 colunas). `npm run test`: 129/129 (Home: hero e benefícios; 14 cafés renderizados; rotas atualizadas para o novo h1); `lint` sem erros; `build` OK. Navegador: 320, 768 e 1440 px nos dois temas sem overflow horizontal e sem erros de console; desktop confere com o Figma (4 colunas, hero em 2 colunas). | `feat: implement coffee catalog home page` |
| 18/11/2026 | TASK-015 | `cartReducer` puro e imutável com `ADD_ITEM` (acumula na mesma linha; ignora quantidade não inteira/< 1 e café fora do catálogo), `INCREMENT_ITEM`, `DECREMENT_ITEM` (remove ao chegar a 0), `REMOVE_ITEM` e `CLEAR_CART`; ações sem efeito devolvem a mesma referência. `npx vitest run src/features/cart`: 16/16, com estados congelados (`Object.freeze`) provando a imutabilidade; `tsc` e `lint` sem erros. | `feat: implement cart reducer and actions` |
| 18/11/2026 | TASK-016 | `CartProvider` (useReducer com hidratação síncrona via `loadCart`, persistência em efeito, `useMemo` com `detailedItems`, `invalidItemIds`, `totalUnits`, subtotal, frete e total; ações estáveis com `useCallback`), `useCart`, `lib/storage.ts` (`readJson` com Zod, `writeJson`, `removeKey`, sem exceções) e `cartStorage.ts` (valida item a item, descarta café inexistente e junta duplicados). Instalados zod 4.6, react-hook-form 7.92 e @hookform/resolvers 7.0 (os dois últimos usados a partir da TASK-019); `npm audit`: 0 vulnerabilidades. `npm run test`: 142/142 (13 novos: storage vazio/válido/JSON corrompido/formato incompatível/itens parcialmente válidos/duplicados/storage bloqueado; Provider: valores derivados, ações, persistência a cada mudança, hidratação sem sobrescrever, erro fora do Provider); `lint` sem erros; `build` OK. | `feat: add persistent cart context` |
| 18/11/2026 | TASK-017 | `HomePage` usa `addItem` do contexto e `PageLayout` passa `totalUnits` ao Header. `npm run test`: 144/144 (integração com rotas reais: 2 Latte + 1 Latte + 1 Cubano → uma linha de Latte com 3, badge "Carrinho, 4 itens" e storage correto; carrinho salvo aparece no Header ao montar); `lint` sem erros; `build` OK. | `feat: connect catalog to cart state` |
| 18/11/2026 | TASK-018 | `CartItem` (imagem, nome, `QuantityInput` pequeno, "Remover" com nome acessível, valor da linha), `CartSummary` (`dl` com total de itens, entrega e total; botão submit "Confirmar pedido") e `EmptyState` reutilizável. `npm run test`: 149/149 (5 novos: exemplo do Figma 9,90 + 19,80 → R$ 29,70 / 3,50 / 33,20; incremento e decremento atualizam o total na hora; decremento de 1 remove e zera o frete; Remover direto; estado vazio com link para a Home); `lint` sem erros; `build` OK. | `feat: add cart item management and order summary` |
| 18/11/2026 | TASK-019 | `checkoutSchema` (Zod 4) com CEP normalizado para 8 dígitos, rua/número/bairro/cidade obrigatórios, complemento opcional, UF em maiúsculas validada contra `BRAZILIAN_STATES` e `paymentMethod` contra `PAYMENT_METHODS`; tipos `CheckoutFormInput`/`CheckoutFormData` inferidos; `toDeliveryAddress`; `lib/postalCode.ts` (normalizar, validar completo, máscara progressiva). `npx vitest`: 30/30 (válido do Figma, complemento, 4 CEPs malformados, 4 obrigatórios, UF minúscula, 4 UFs inválidas, 3 pagamentos válidos, 3 ausentes/inválidos, máscara); `tsc`, `lint` e `build` OK. | `feat: add checkout form validation schemas` |
| 18/11/2026 | TASK-020 | `lookupPostalCode` com resultados discriminados (`success`, `invalid` sem requisição, `not-found` para `erro` true/"true" ou HTTP 400, `error` network/timeout/http/invalid-response, `aborted`), timeout de 8 s com `AbortController` único, validação da resposta com Zod e mapeamento logradouro/bairro/localidade/uf. `npx vitest`: 19/19 (URL normalizada, mapeamento do CEP do Figma, CEP geral com campos vazios, 4 malformados sem fetch, `erro` booleano e string, HTTP 400 e 503, rede, JSON inválido, 3 respostas fora do contrato, timeout com timers falsos, cancelamento antes e durante). API real via curl: 90250440 → Rua João Daniel Martinelli/Farrapos/Porto Alegre/RS; 99999999 → `{"erro":"true"}`; 1234 → HTTP 400 (primeira tentativa sem resposta em 10 s, confirmando a necessidade do timeout). `tsc`, `lint` e `build` OK. | `feat: integrate viacep postal code lookup` |
| 18/11/2026 | TASK-021 | `TextField` acessível (label associado, `aria-invalid`, `aria-describedby`, selo "Opcional", adorno de carregamento), `usePostalCodeLookup` (status, cancelamento da consulta anterior e ao desmontar, descarte de resposta antiga) e `DeliveryAddressForm` (máscara 00000-000, consulta ao completar 8 dígitos e no blur, preenche rua/bairro/cidade/UF sem tocar número/complemento, limpa endereço do CEP anterior, foco no Número, status em `aria-live`, preenchimento manual após falha). Decisão D12 registrada. `npm run test`: todos passando (7 novos de integração com fetch simulado: autofill, preservação de número/complemento, troca de CEP, CEP não encontrado limpa dados antigos, falha de rede + preenchimento manual + envio, CEP incompleto sem consulta e erros acessíveis, anúncio de carregamento); `build` OK. **Correção:** o commit inicial foi feito com 1 erro de lint (`react-hooks/refs`: callback com refs passado a `register()` durante a renderização), corrigido no commit seguinte movendo os handlers do CEP para props de evento; depois disso `lint` sem erros e 47/47 testes do checkout. | `feat: build address form with viacep autofill` + `fix: avoid ref access during render in address form` |
| 18/11/2026 | TASK-022 | `PaymentMethodSelector` com rádios nativos estilizados (borda `purple` + fundo `purple-light` quando selecionado, anel de foco no cartão, ícones Phosphor do Figma), `fieldset`/`legend` e erro ligado por `aria-describedby`. `npm run test`: todos passando (7 novos: três opções sem seleção inicial, obrigatoriedade com descrição acessível, aceite de crédito/débito/dinheiro, setas do teclado, nenhum campo de cartão); `lint` sem erros; `build` OK, variantes `has-checked`/`has-focus-visible` presentes no CSS gerado. | `feat: add checkout payment method selection` |
| 18/11/2026 | TASK-023 | `CheckoutPage` com `FormProvider` envolvendo endereço, pagamento, itens (`CartItem`) e `CartSummary`; layout em 2 colunas (40 rem + 28 rem) no desktop e empilhado no celular; estado vazio com h1 "Seu carrinho está vazio"; alerta `role=alert` e foco no primeiro campo inválido ao enviar com erros. `npm run test`: todos passando (4 novos: estado vazio e link para a Home, seções e total R$ 33,20 do Figma, bloqueio com formulário inválido mantendo a rota e descrevendo erros, remoção do último item volta ao estado vazio; teste de rota atualizado); `lint` sem erros; `build` OK. Navegador com carrinho do Figma: 375 e 1440 px nos dois temas, sem overflow horizontal e sem erros de console; desktop confere com o frame de Checkout. | `feat: implement checkout page` |
| 18/11/2026 | TASK-024 | `orderSchema` (Zod: itens, endereço, pagamento, ISO datetime e consistência subtotal/total), `createOrder` (revalida carrinho vazio, café inexistente e quantidade inválida; copia nome/preço/imagem; congela pedido, itens e endereço; ID por `crypto.randomUUID`) e `orderStorage` (`saveLastOrder`/`readLastOrder` em `coffee-delivery:last-order:v1`). `npm run test`: todos passando (17 novos: snapshot completo com R$ 33,20; independência após mutar carrinho e catálogo; congelamento; carrinho vazio; café inexistente; quantidade 0; endereço inválido; IDs únicos; salvar/ler; chave separada; ausência; JSON corrompido; totais adulterados; 4 valores inválidos em `parseOrder`); `lint` sem erros; `build` OK. | `feat: create independent order snapshot` |
| 18/11/2026 | TASK-025 | `CheckoutPage.handleConfirm`: revalida via `createOrder` (carrinho vazio, café inexistente, quantidade, endereço), exibe erro `role=alert` se falhar, grava o snapshot com `saveLastOrder` ANTES de `clearCart` e navega para `/success` com `replace` e o pedido no estado da navegação. `npm run test`: todos passando (4 novos de integração com ViaCEP simulada: fluxo válido salva pedido R$ 33,20 com endereço do Figma, esvazia carrinho e badge e navega; ordem das gravações no storage (pedido antes do carrinho); confirmação com storage indisponível segue com o snapshot no estado; formulário inválido não grava pedido nem limpa carrinho). Carrinho vazio e café inexistente cobertos nos testes unitários de `createOrder` (a interface não permite chegar a esses estados). `lint` sem erros; `build` OK. | `feat: confirm valid orders and clear cart` |
| 18/11/2026 | TASK-026 | `SuccessPage` (snapshot do estado da navegação validado por `parseOrder`, com fallback para `readLastOrder` após refresh; estado vazio sem pedido válido) e `OrderSuccess` (título, card com utility `border-gradient`, endereço com complemento, previsão `DELIVERY_ESTIMATE`, rótulo do pagamento, ilustração provisória); `PageLayout` passa ao Header a cidade/UF do último pedido. `npm run test`: todos passando (6 novos: dados do snapshot após refresh, complemento, independência do carrinho vazio, localização no Header, estado vazio com título da aba, snapshot corrompido rejeitado; teste de rota atualizado); `lint` sem erros; `build` OK. Navegador com pedido salvo: 375 e 1440 px nos dois temas sem overflow e sem erros de console; confere com o frame de Sucesso (traços escuros da ilustração provisória perdem contraste no dark mode — será resolvido na TASK-032). | `feat: add order success page` |

## Definition of Done (global)

Uma tarefa só é concluída quando:
1. O critério de pronto foi atendido.
2. O teste descrito foi executado e o resultado registrado acima.
3. Não há erros de TypeScript, lint ou build introduzidos.
4. A documentação relacionada foi atualizada.
5. O commit semântico correspondente foi criado.
