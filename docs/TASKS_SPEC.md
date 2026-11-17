# Coffee Delivery — Plano de Implementação (TASKS)

**Versão:** 1.0.0  
**Status inicial:** Planejado  
**Última atualização:** 17/11/2026  
**Documentos relacionados:** [`PRD_SPEC.md`](./PRD_SPEC.md) · [`TECH_SPEC.md`](./TECH_SPEC.md)

## Como trabalhar com este checklist

- Executar as tarefas na ordem, respeitando dependências.
- Trabalhar em uma tarefa pequena por vez; não gerar a aplicação inteira em uma única etapa.
- Antes de iniciar, conferir os critérios de pronto e os requisitos relacionados.
- Ao concluir uma tarefa: marcar `[x]`, registrar o teste realizado e criar commit semântico.
- Se arquivos ou critérios mudarem, atualizar este documento e os SPEC correspondentes.
- Status permitidos: `Pendente`, `Em andamento`, `Bloqueada`, `Concluída`.

## Checklist

### Fase 0 — Planejamento e fundação

- [ ] **TASK-001 — Revisar especificações**
  - **Objetivo:** validar PRD, TECH e TASKS; registrar dúvidas e decisões.
  - **Requisitos relacionados:** RF-01 a RF-16; RN-01 a RN-10.
  - **Arquivos afetados:** `docs/PRD_SPEC.md`, `docs/TECH_SPEC.md`, `docs/TASKS_SPEC.md`.
  - **Critério de pronto:** IDs, regras, frete e escopo estão consistentes entre os três documentos.
  - **Teste/validação:** revisão cruzada dos IDs e critérios.
  - **Commit:** `docs: define product and technical specifications`
  - **Status:** Pendente

- [ ] **TASK-002 — Inicializar projeto Vite**
  - **Objetivo:** criar aplicação React + TypeScript com Vite.
  - **Requisitos relacionados:** base para RF-01 a RF-16.
  - **Arquivos afetados:** `package.json`, `index.html`, `src/main.tsx`, `src/app/App.tsx`, `tsconfig.json`, configuração Vite.
  - **Critério de pronto:** `npm run dev` inicia a aplicação sem erros.
  - **Teste/validação:** executar servidor local e `npm run build`.
  - **Commit:** `chore: initialize vite react typescript app`
  - **Status:** Pendente

- [ ] **TASK-003 — Configurar Tailwind, lint e testes**
  - **Objetivo:** instalar e configurar Tailwind CSS, ESLint, Vitest e Testing Library.
  - **Requisitos relacionados:** RNF de qualidade, acessibilidade e responsividade.
  - **Arquivos afetados:** `package.json`, configs do Tailwind/PostCSS, ESLint, Vitest, `src/styles/`.
  - **Critério de pronto:** scripts `dev`, `build`, `lint` e `test` executam.
  - **Teste/validação:** rodar lint, teste inicial e build.
  - **Commit:** `chore: configure styling lint and test tooling`
  - **Status:** Pendente

### Fase 1 — Identidade e fundação visual

- [ ] **TASK-004 — Criar identidade visual e logo**
  - **Objetivo:** desenvolver logo original com auxílio de IA e definir aplicações.
  - **Requisitos relacionados:** RF-16, RF-14.
  - **Arquivos afetados:** `public/brand/*`, `public/favicon.svg`, `docs/BRAND_GUIDE.md`.
  - **Critério de pronto:** logo principal e símbolo exportados; favicon legível; guia registra conceito, paleta, tipografia e variações light/dark.
  - **Teste/validação:** conferir legibilidade em tamanho pequeno e contraste nos dois temas.
  - **Commit:** `feat: add coffee delivery brand identity`
  - **Status:** Pendente

- [ ] **TASK-005 — Definir tokens e estilos globais**
  - **Objetivo:** criar tokens semânticos de cor, tipografia, espaçamento, bordas e sombras.
  - **Requisitos relacionados:** RF-14, RF-15, RF-16.
  - **Arquivos afetados:** `src/styles/tokens.css`, `src/styles/index.css`, configuração Tailwind.
  - **Critério de pronto:** estilos globais usam tokens e não dependem de cores duplicadas por componente.
  - **Teste/validação:** conferir contraste e renderização básica em light/dark.
  - **Commit:** `style: define design tokens and global styles`
  - **Status:** Pendente

- [ ] **TASK-006 — Implementar tema**
  - **Objetivo:** criar ThemeProvider/hook, alternância e persistência.
  - **Requisitos relacionados:** RF-14.
  - **Arquivos afetados:** `src/app/providers.tsx`, `src/hooks/useTheme.ts`, `src/components/ThemeToggle/*`, `src/styles/*`.
  - **Critério de pronto:** tema muda globalmente, respeita preferência do sistema na primeira visita e persiste após refresh.
  - **Teste/validação:** teste unitário da persistência e verificação manual em todas as rotas disponíveis.
  - **Commit:** `feat: implement persistent light and dark themes`
  - **Status:** Pendente

### Fase 2 — Domínio, catálogo e navegação

- [ ] **TASK-007 — Definir tipos e constantes de domínio**
  - **Objetivo:** criar interfaces, enums/unions e constantes centrais.
  - **Requisitos relacionados:** RF-01 a RF-13; RN-01 a RN-10.
  - **Arquivos afetados:** `src/domain/types.ts`, `src/domain/constants.ts`.
  - **Critério de pronto:** tipos `Coffee`, `CartItem`, `DeliveryAddress`, `PaymentMethod`, `Order` definidos e compilando.
  - **Teste/validação:** TypeScript strict sem erros.
  - **Commit:** `feat: define coffee delivery domain types`
  - **Status:** Pendente

- [ ] **TASK-008 — Criar catálogo local tipado**
  - **Objetivo:** cadastrar dados demonstrativos de cafés com imagem, descrição, preço em centavos, categoria e tags.
  - **Requisitos relacionados:** RF-01, RN-08.
  - **Arquivos afetados:** `src/features/catalog/data/products.ts`.
  - **Critério de pronto:** catálogo exporta coleção tipada, IDs únicos e preços inteiros em centavos.
  - **Teste/validação:** teste de integridade de IDs e campos obrigatórios.
  - **Commit:** `feat: add typed coffee catalog`
  - **Status:** Pendente

- [ ] **TASK-009 — Configurar React Router**
  - **Objetivo:** criar rotas Home, Checkout e Confirmação.
  - **Requisitos relacionados:** RF-07, RN-09, RN-10.
  - **Arquivos afetados:** `src/app/router.tsx`, `src/app/App.tsx`, páginas iniciais.
  - **Critério de pronto:** navegação entre rotas sem reload; rotas ainda não implementadas exibem placeholders coerentes.
  - **Teste/validação:** testar navegação e URL direta.
  - **Commit:** `feat: configure application routes`
  - **Status:** Pendente

- [ ] **TASK-010 — Criar Header responsivo**
  - **Objetivo:** implementar marca, navegação, indicador de localização se aplicável, contador e alternância de tema.
  - **Requisitos relacionados:** RF-04, RF-14, RF-15, RF-16.
  - **Arquivos afetados:** `src/components/Header/*`, `src/components/ThemeToggle/*`.
  - **Critério de pronto:** Header apresenta logo e contador de unidades; adapta-se a telas pequenas.
  - **Teste/validação:** teste do contador com múltiplas quantidades e verificação responsiva.
  - **Commit:** `feat: add responsive application header`
  - **Status:** Pendente

- [ ] **TASK-011 — Implementar ProductCard e controle de quantidade**
  - **Objetivo:** apresentar dados do café e permitir selecionar quantidade positiva.
  - **Requisitos relacionados:** RF-01, RF-02, RF-15.
  - **Arquivos afetados:** `src/features/catalog/components/*`, `src/components/QuantityControl/*`.
  - **Critério de pronto:** imagem, nome, descrição, preço, tag e controles funcionam por mouse e teclado.
  - **Teste/validação:** testes de incremento/decremento e acessibilidade dos botões.
  - **Commit:** `feat: build coffee product cards and quantity controls`
  - **Status:** Pendente

- [ ] **TASK-012 — Montar Home e catálogo**
  - **Objetivo:** compor a página inicial com apresentação e listagem de cafés.
  - **Requisitos relacionados:** RF-01, RF-02, RF-15.
  - **Arquivos afetados:** `src/features/catalog/pages/HomePage.tsx`, componentes de catálogo.
  - **Critério de pronto:** catálogo aparece com todos os dados e layout responsivo.
  - **Teste/validação:** conferir conteúdo em 360 px, 768 px e 1280 px.
  - **Commit:** `feat: implement coffee catalog home page`
  - **Status:** Pendente

### Fase 3 — Carrinho

- [ ] **TASK-013 — Implementar reducer do carrinho**
  - **Objetivo:** implementar ações de adicionar, incrementar, decrementar, remover e limpar.
  - **Requisitos relacionados:** RF-03, RF-05; RN-01, RN-02.
  - **Arquivos afetados:** `src/features/cart/cartReducer.ts`, `src/features/cart/cartTypes.ts`.
  - **Critério de pronto:** reducer puro, imutável, sem linhas duplicadas e com remoção ao decrementar de 1.
  - **Teste/validação:** testes unitários para todas as ações e limites.
  - **Commit:** `feat: implement cart reducer and actions`
  - **Status:** Pendente

- [ ] **TASK-014 — Criar CartProvider e persistência**
  - **Objetivo:** expor estado/ações por Context API e sincronizar com localStorage.
  - **Requisitos relacionados:** RF-03, RF-04, RF-05, RF-06; RN-06.
  - **Arquivos afetados:** `src/features/cart/CartContext.tsx`, `src/features/cart/cartStorage.ts`, `src/app/providers.tsx`.
  - **Critério de pronto:** carrinho hidrata e persiste; dados corrompidos não quebram a aplicação.
  - **Teste/validação:** testes de storage e refresh manual.
  - **Commit:** `feat: add persistent cart context`
  - **Status:** Pendente

- [ ] **TASK-015 — Integrar adicionar ao carrinho e contador**
  - **Objetivo:** conectar ProductCard ao contexto e Header ao total de unidades.
  - **Requisitos relacionados:** RF-02, RF-03, RF-04; RN-02.
  - **Arquivos afetados:** ProductCard, HomePage, Header, `useCart`.
  - **Critério de pronto:** adicionar o mesmo produto acumula quantidade e contador soma unidades totais.
  - **Teste/validação:** adicionar itens de tipos iguais e diferentes; conferir contador.
  - **Commit:** `feat: connect catalog to cart state`
  - **Status:** Pendente

- [ ] **TASK-016 — Criar componentes de revisão do carrinho**
  - **Objetivo:** exibir linhas de itens, controles de quantidade, remoção e resumo.
  - **Requisitos relacionados:** RF-05, RF-10, RF-15; RN-01 a RN-04.
  - **Arquivos afetados:** `src/components/CartItem/*`, `src/components/OrderSummary/*`, `src/domain/pricing.ts`.
  - **Critério de pronto:** alterações atualizam valores imediatamente e moeda é formatada em BRL.
  - **Teste/validação:** testar incrementar, decrementar até remover, remover diretamente e cálculos.
  - **Commit:** `feat: add cart item management and order summary`
  - **Status:** Pendente

### Fase 4 — Checkout

- [ ] **TASK-017 — Implementar cálculo de preços e frete**
  - **Objetivo:** centralizar subtotal, taxa de R$ 5,00 e total em centavos.
  - **Requisitos relacionados:** RF-10; RN-03, RN-04.
  - **Arquivos afetados:** `src/domain/pricing.ts`, `src/domain/constants.ts`, testes.
  - **Critério de pronto:** frete é zero sem itens e 500 centavos com itens; cálculos não usam float.
  - **Teste/validação:** testes unitários de casos vazios e múltiplos itens.
  - **Commit:** `feat: centralize monetary calculations and delivery fee`
  - **Status:** Pendente

- [ ] **TASK-018 — Configurar React Hook Form e Zod**
  - **Objetivo:** definir schemas para endereço e pagamento.
  - **Requisitos relacionados:** RF-08, RF-09, RF-11; RN-07, RN-10.
  - **Arquivos afetados:** `src/features/checkout/schemas/checkoutSchema.ts`.
  - **Critério de pronto:** campos obrigatórios, CEP, UF e pagamento são validados; complemento é opcional.
  - **Teste/validação:** testes de schema para casos válidos e inválidos.
  - **Commit:** `feat: add checkout form validation schemas`
  - **Status:** Pendente

- [ ] **TASK-019 — Integrar consulta ViaCEP**
  - **Objetivo:** implementar serviço real de consulta e mapeamento dos campos.
  - **Requisitos relacionados:** RF-08; RN-07.
  - **Arquivos afetados:** `src/features/checkout/services/viacep.ts`, testes.
  - **Critério de pronto:** CEP válido chama ViaCEP e retorna endereço normalizado; erros são diferenciados.
  - **Teste/validação:** testar CEP válido, malformado, não encontrado, falha de rede e JSON inválido.
  - **Commit:** `feat: integrate viacep postal code lookup`
  - **Status:** Pendente

- [ ] **TASK-020 — Construir formulário de endereço**
  - **Objetivo:** criar campos, máscara/normalização de CEP, loading, feedback e preenchimento automático.
  - **Requisitos relacionados:** RF-08, RF-11, RF-15; RN-07.
  - **Arquivos afetados:** `src/features/checkout/components/AddressForm.tsx`, hooks e componentes de formulário.
  - **Critério de pronto:** logradouro, bairro, cidade e UF são preenchidos quando disponíveis; número/complemento permanecem manuais; erro permite correção.
  - **Teste/validação:** testes de integração e uso por teclado.
  - **Commit:** `feat: build address form with viacep autofill`
  - **Status:** Pendente

- [ ] **TASK-021 — Implementar seleção de pagamento**
  - **Objetivo:** permitir escolher crédito, débito ou dinheiro.
  - **Requisitos relacionados:** RF-09, RF-11; RN-05.
  - **Arquivos afetados:** checkout components e schema.
  - **Critério de pronto:** uma opção é obrigatória; nenhuma informação de cartão é solicitada.
  - **Teste/validação:** validar ausência de seleção e cada uma das três opções.
  - **Commit:** `feat: add checkout payment method selection`
  - **Status:** Pendente

- [ ] **TASK-022 — Montar página Checkout**
  - **Objetivo:** integrar carrinho, endereço, pagamento, resumo e ação de confirmação.
  - **Requisitos relacionados:** RF-05, RF-08, RF-09, RF-10, RF-11, RF-15.
  - **Arquivos afetados:** `src/features/checkout/pages/CheckoutPage.tsx`, componentes de checkout.
  - **Critério de pronto:** checkout apresenta estado vazio; bloqueia confirmação inválida; resumo sempre consistente.
  - **Teste/validação:** fluxo válido e cenários de carrinho vazio/formulário inválido.
  - **Commit:** `feat: implement checkout page`
  - **Status:** Pendente

### Fase 5 — Pedido e confirmação

- [ ] **TASK-023 — Criar serviço e persistência do pedido**
  - **Objetivo:** criar snapshot independente do carrinho e persistir último pedido.
  - **Requisitos relacionados:** RF-12, RF-13; RN-06, RN-10.
  - **Arquivos afetados:** `src/features/orders/orderService.ts`, `orderStorage.ts`, tipos.
  - **Critério de pronto:** pedido copia dados dos itens, endereço, pagamento e valores; não depende do carrinho.
  - **Teste/validação:** teste de snapshot e leitura após refresh.
  - **Commit:** `feat: create independent order snapshot`
  - **Status:** Pendente

- [ ] **TASK-024 — Implementar confirmação transacional no front-end**
  - **Objetivo:** validar novamente, salvar snapshot, limpar carrinho e navegar para confirmação.
  - **Requisitos relacionados:** RF-11, RF-12, RF-13; RN-06, RN-10.
  - **Arquivos afetados:** CheckoutPage, orderService, CartContext.
  - **Critério de pronto:** somente pedido válido é salvo; snapshot é persistido antes da limpeza do carrinho.
  - **Teste/validação:** simular pedido válido, carrinho vazio e produto inexistente.
  - **Commit:** `feat: confirm valid orders and clear cart`
  - **Status:** Pendente

- [ ] **TASK-025 — Criar tela de confirmação**
  - **Objetivo:** exibir confirmação, endereço, pagamento, itens e valores do snapshot.
  - **Requisitos relacionados:** RF-12, RF-13, RN-06, RN-09.
  - **Arquivos afetados:** `src/features/orders/pages/ConfirmationPage.tsx`.
  - **Critério de pronto:** dados corretos aparecem mesmo com carrinho vazio; acesso sem pedido mostra estado vazio.
  - **Teste/validação:** testar com snapshot e sem snapshot, inclusive após refresh.
  - **Commit:** `feat: add order confirmation page`
  - **Status:** Pendente

### Fase 6 — Responsividade, acessibilidade e qualidade

- [ ] **TASK-026 — Revisar responsividade ponta a ponta**
  - **Objetivo:** ajustar catálogo, Header, carrinho, formulário e confirmação para mobile/tablet/desktop.
  - **Requisitos relacionados:** RF-15.
  - **Arquivos afetados:** componentes e estilos de todas as páginas.
  - **Critério de pronto:** fluxo completo utilizável em 360 px, 768 px e 1280 px, sem overflow horizontal.
  - **Teste/validação:** inspeção manual nos três viewports.
  - **Commit:** `style: refine responsive layouts across the app`
  - **Status:** Pendente

- [ ] **TASK-027 — Revisar acessibilidade**
  - **Objetivo:** corrigir labels, foco, teclado, mensagens e contraste.
  - **Requisitos relacionados:** RF-08, RF-11, RF-14, RF-15.
  - **Arquivos afetados:** componentes de formulário, botões, estados e estilos.
  - **Critério de pronto:** navegação por teclado completa; erros e loading anunciados; contraste adequado.
  - **Teste/validação:** checklist manual e ferramenta automatizada de acessibilidade, se disponível.
  - **Commit:** `fix: improve keyboard and screen reader accessibility`
  - **Status:** Pendente

- [ ] **TASK-028 — Executar testes integrados e corrigir defeitos**
  - **Objetivo:** cobrir os principais cenários de aceitação e corrigir regressões.
  - **Requisitos relacionados:** RF-01 a RF-16; RN-01 a RN-10.
  - **Arquivos afetados:** `tests/`, arquivos de teste próximos aos módulos e código corrigido.
  - **Critério de pronto:** testes, lint e build passam; nenhum defeito crítico no fluxo principal.
  - **Teste/validação:** `npm run test`, `npm run lint`, `npm run build` e fluxo manual completo.
  - **Commit:** `test: cover coffee delivery purchase flow`
  - **Status:** Pendente

- [ ] **TASK-029 — Atualizar documentação e instruções de execução**
  - **Objetivo:** documentar instalação, scripts, decisões, marca e limitações.
  - **Requisitos relacionados:** RF-16; RN-08.
  - **Arquivos afetados:** `README.md`, `docs/BRAND_GUIDE.md`, SPECs.
  - **Critério de pronto:** uma pessoa consegue instalar, executar e testar o projeto seguindo o README; documentos refletem a implementação real.
  - **Teste/validação:** seguir README em ambiente limpo.
  - **Commit:** `docs: document setup brand and implementation decisions`
  - **Status:** Pendente

- [ ] **TASK-030 — Preparar deploy**
  - **Objetivo:** configurar build de produção e publicar em hospedagem estática escolhida.
  - **Requisitos relacionados:** RF-07, RF-15.
  - **Arquivos afetados:** configuração de deploy, `README.md`, eventualmente `vite.config.ts`.
  - **Critério de pronto:** build publicado; rotas SPA funcionam ao acessar URL diretamente; consulta ViaCEP funciona no domínio publicado.
  - **Teste/validação:** smoke test de Home, Checkout e Confirmação no ambiente publicado.
  - **Commit:** `chore: prepare production deployment`
  - **Status:** Pendente

## Registro de execução

Adicionar uma entrada por tarefa concluída:

| Data | Tarefa | Resultado/teste realizado | Commit |
|---|---|---|---|
| — | — | — | — |

## Definition of Done (global)

Uma tarefa só pode ser marcada como concluída quando:
1. O critério de pronto foi atendido.
2. O teste descrito foi executado e o resultado foi registrado.
3. Não há erros de TypeScript, lint ou build introduzidos pela tarefa.
4. A documentação relacionada foi atualizada, se necessário.
5. Foi criado commit semântico correspondente.
