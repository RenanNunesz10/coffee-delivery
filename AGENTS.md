# AGENTS.md — Diretrizes do assistente de IA

> Instruções operacionais para qualquer assistente de IA que atue no projeto Coffee Delivery. O `CLAUDE.md` importa este arquivo; mantenha as diretrizes **apenas aqui**.

## 1. Contexto do projeto

Coffee Delivery é a SPA do projeto final da disciplina Single Page Application: um e-commerce demonstrativo de cafés. O usuário navega pelo catálogo, seleciona quantidades, gerencia o carrinho, informa o endereço com consulta real à ViaCEP, escolhe um pagamento fictício e vê a confirmação do pedido.

A interface reproduz o Figma *Coffee Delivery / Projeto Final React* em celular, tablet e desktop:
- Home — frame `2:1550`
- Checkout — frame `217:511`
- Sucesso — frame `222:824`
- Style Guide — amarelo/roxo, Baloo 2 (títulos) e Roboto (textos)

O Figma é a referência visual primária. Se não tiver acesso ao arquivo, **peça ao usuário exports/screenshots** (ou consulte `docs/figma/`) em vez de inventar layout.

O aluno precisa entender e explicar todo o código. Explique as decisões, prefira soluções simples e didáticas e responda em **português brasileiro**.

## 2. Leitura obrigatória antes de codificar

Antes de escrever ou alterar código, leia:
1. `docs/PRD_SPEC.md`
2. `docs/TECH_SPEC.md`
3. `docs/TASKS_SPEC.md`

Se existirem, leia também `docs/BRAND_GUIDE.md`, `docs/AI_USAGE.md`, `README.md` e os assets do Figma.

Se faltar algum SPEC, não implemente: proponha criá-lo primeiro.

Em caso de conflito:
- O **PRD** define comportamento e escopo.
- A **TECH_SPEC** define arquitetura e decisões técnicas.
- A **TASKS_SPEC** define a ordem de execução.
- O **Figma/Brand Guide** define a apresentação visual.
- Não resolva conflitos em silêncio: explique-os e atualize os documentos antes de implementar.

## 3. Stack

- React + TypeScript (`strict`) + Vite.
- Tailwind CSS v4 (decisão justificada na TECH_SPEC 1.1).
- React Router: rotas `/`, `/checkout` e `/success`.
- Context API + `useReducer` para o carrinho.
- React Hook Form + Zod.
- ViaCEP para consulta de CEP.
- `localStorage` para carrinho, tema e último pedido.
- Vitest + Testing Library.
- ESLint.

Respeite o lockfile. Não troque bibliotecas nem adicione dependências sem justificar e registrar na TECH_SPEC.

## 4. Regras de implementação

### 4.1 Tarefas pequenas
- Trabalhe em **uma tarefa da TASKS_SPEC por vez**, na ordem.
- Antes de começar, informe ID, objetivo, requisitos, arquivos previstos e critério de pronto.
- Não gere a aplicação inteira de uma vez.
- Não avance para tarefa dependente sem concluir a anterior ou justificar o bloqueio.
- Ao terminar, pare e aguarde a validação do usuário antes da próxima tarefa.
- Peça confirmação para decisões que alterem escopo, UX ou arquitetura.

### 4.2 Rastreabilidade
- Todo comportamento novo está associado a um RF/RN do PRD.
- Atualize a TECH_SPEC ao mudar arquitetura, tipos, contratos, dependências ou persistência.
- Atualize a TASKS_SPEC ao mudar ordem, arquivos, critérios ou status.
- Não renomeie nem remova IDs sem atualizar todas as referências.

### 4.3 TypeScript e qualidade
- Sem `any`; use `unknown` com narrowing.
- Sem `@ts-ignore` ou casts inseguros.
- Componentes pequenos e com responsabilidade clara.
- Regras de negócio em funções puras/módulos de domínio, fora do JSX.
- Sem constantes ou cálculos duplicados.
- Nunca mutar estado, arrays ou objetos (`map`, `filter`, `find`, `reduce`, spread).

### 4.4 Carrinho e dinheiro
- Quantidades inteiras ≥ 1; decrementar de 1 para 0 remove o item.
- Produto repetido acumula na mesma linha.
- O contador do Header soma unidades.
- Valores em centavos inteiros; frete `DELIVERY_FEE_CENTS = 500` para pedido não vazio, 0 para vazio.
- Formatação BRL centralizada em `formatCurrency`.
- Item inexistente no catálogo bloqueia a confirmação.

### 4.5 CEP e endereço
- Consulta real à ViaCEP é obrigatória; nada de endereço hardcoded ou mock fora dos testes.
- Normalizar para 8 dígitos antes de consultar.
- Mapear logradouro, bairro, cidade e UF; nunca sobrescrever número/complemento.
- Tratar loading, CEP malformado, não encontrado, erro HTTP, rede, timeout e resposta inválida.
- Em falha, comunicar e permitir preenchimento manual, sem afirmar que o endereço foi validado.

### 4.6 Pedido e pagamento
- Pagamento informativo: crédito, débito ou dinheiro. Nunca pedir dados de cartão nem implementar gateway.
- Revalidar no handler, salvar o snapshot **antes** de limpar o carrinho e navegar para `/success`.
- `/success` usa somente o snapshot; sem pedido válido, mostra estado vazio.

### 4.7 Tema, responsividade e acessibilidade
- Tema claro/escuro em todas as telas, com tokens semânticos centralizados; sem cores arbitrárias.
- Persistir o tema; sem escolha salva, usar `prefers-color-scheme`.
- Mobile-first; verificar 320, 375/390, 768 e 1280/1440 px; sem overflow horizontal.
- WCAG 2.2 AA: labels, foco visível, teclado, `aria-live`, contraste, nada comunicado só por cor.

## 5. Design e marca

- Consulte o Figma antes de criar ou alterar componentes visuais.
- Reproduza hierarquia, espaçamento, tipografia, cores e dimensões.
- Estado não especificado no Figma: use tokens e padrões existentes e registre a decisão.
- A logo é original, criada com auxílio de IA, e aparece no Header, favicon e `BRAND_GUIDE.md`.
- Não distorça nem recolora a logo fora do Brand Guide.

## 6. Limites de escopo

Não implemente sem aprovação explícita e atualização do PRD:
- Backend, banco de dados ou autenticação.
- Pagamento real ou gateway.
- Estoque, logística ou rastreamento.
- Painel administrativo, contas ou histórico remoto.
- Extras opcionais (busca, cupom, histórico, E2E, animações) antes de concluir o escopo obrigatório.

## 7. Testes e verificação

Antes de declarar uma tarefa concluída:
- Rode os testes relacionados (`npm run test`).
- Rode `npm run lint` e `npm run build`.
- Verifique manualmente o comportamento alterado quando houver UI.
- Registre na TASKS_SPEC o teste **realmente executado** e o resultado.
- Nunca afirme que algo passou sem ter executado.

Coberturas prioritárias: reducer, cálculos em centavos e frete, persistência, ViaCEP (válido, inválido, não encontrado, indisponível), validação de endereço/pagamento, bloqueio de pedido inválido, snapshot após limpar o carrinho, tema persistente, responsividade e teclado.

## 8. Commits

Um commit por tarefa, em Conventional Commits, usando a mensagem indicada na TASKS_SPEC:
`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `style:`, `chore:`.

Proibido: mensagens vagas (`update`, `changes`, `final`). Push para o GitHub apenas quando o usuário pedir.

## 9. Registro de uso de IA

Interações relevantes (planejamento, explicação de conceitos, revisão, depuração, testes) devem ser registradas em `docs/AI_USAGE.md` com: prompt, objetivo, resposta resumida, decisão tomada e evidência. Meta mínima: três registros.

## 10. Comunicação por tarefa

**Ao iniciar:** tarefa e requisitos; abordagem e arquivos; ambiguidades e dependências.

**Ao concluir:** o que foi implementado; arquivos alterados; testes executados e resultados reais; commit criado; status atualizado; próxima tarefa (sem executá-la).

## 11. Regra final

**A especificação é o contrato do projeto.** Não sacrifique requisitos, acessibilidade, consistência monetária ou fidelidade ao Figma por velocidade. Mudanças pequenas, verificáveis e documentadas.
