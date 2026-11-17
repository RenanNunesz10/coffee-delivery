# Coffee Delivery — Product Requirements Document (PRD)

**Versão:** 1.1.0
**Status:** Aprovado para início do desenvolvimento
**Última atualização:** 17/11/2026
**Documentos relacionados:** [`TECH_SPEC.md`](./TECH_SPEC.md) · [`TASKS_SPEC.md`](./TASKS_SPEC.md) · [`AGENTS.md`](../AGENTS.md)

## Histórico de versões

| Versão | Data | Alteração |
|---|---|---|
| 1.0.0 | 17/11/2026 | Versão inicial. |
| 1.1.0 | 17/11/2026 | Alinhamento ao enunciado do projeto final: rota `/success`, viewports 320–1440 px, WCAG 2.2 AA, referências do Figma, Branding com IA, registro de uso de IA e entregáveis. |

## 1. Visão geral

### 1.1 Resumo do produto
Coffee Delivery é uma aplicação web de página única (SPA) para apresentar um catálogo de cafés e permitir que o usuário monte um carrinho, informe um endereço de entrega (com consulta pública de CEP), escolha uma forma de pagamento fictícia e conclua um pedido demonstrativo.

A experiência deve ser simples, responsiva e acessível, com identidade visual própria criada com auxílio de IA, suporte a temas claro e escuro e persistência local do carrinho.

### 1.2 Contexto
Projeto final da disciplina **Single Page Application (SPA)**, adaptado do desafio Coffee Delivery da formação React 2022. Consolida React, TypeScript, componentes, Props, Hooks, Context API, `useReducer`, imutabilidade, rotas, formulários, persistência local, estilização, testes, documentação e uso crítico de assistente de IA.

### 1.3 Problema
O usuário precisa de uma experiência direta para descobrir cafés, selecionar quantidades e simular uma compra sem etapas desnecessárias. A aplicação deve demonstrar um fluxo de e-commerce completo no front-end, sem depender de backend ou processamento financeiro.

### 1.4 Objetivos
- Exibir um catálogo de cafés com informações suficientes para a escolha.
- Permitir adicionar, alterar e remover produtos do carrinho.
- Manter o carrinho após atualização da página.
- Conduzir o usuário por um checkout com endereço preenchido via consulta pública de CEP.
- Calcular subtotal, frete e total de forma consistente, em centavos.
- Registrar um pedido fictício e apresentar sua confirmação a partir de um snapshot.
- Oferecer experiência consistente em celular, tablet e desktop.
- Disponibilizar temas claro e escuro persistidos.

### 1.5 Público-alvo
Pessoas que desejam navegar por um catálogo de cafés e simular uma compra. O produto tem finalidade educacional e demonstrativa; o avaliador (professor) é também público direto da documentação e do repositório.

## 2. Referências

| Referência | Uso |
|---|---|
| [Figma — *Coffee Delivery • Projeto Final React (cópia)*](https://www.figma.com/design/DBM8Ky5Qy7ZUOP2pUR5SrJ/Coffee-Delivery-%E2%80%A2-Projeto-Final-React--c%C3%B3pia-?node-id=0-1) | Referência visual primária. |
| Frame `2:1550` — Home | Header, hero e catálogo. |
| Frame `217:511` — Checkout | Formulário, pagamento e carrinho (vazio e preenchido). |
| Frame `222:824` — Sucesso | Tela de pedido confirmado. |
| Style Guide do Figma | Paleta amarelo/roxo, tipografia **Baloo 2** (títulos) e **Roboto** (textos), componentes. |

A marca pode ser personalizada (ver seção 7), desde que o fluxo funcional e a clareza visual sejam preservados. Exports dos frames e das imagens dos cafés devem ser versionados em `docs/figma/` (referência) e `src/assets/` (uso na aplicação).

## 3. Escopo

### 3.1 Dentro do escopo
- Catálogo local e tipado de cafés.
- Seleção de quantidade e gerenciamento do carrinho.
- Contador de unidades no Header.
- Persistência do carrinho em `localStorage`.
- Rotas `/`, `/checkout` e `/success` com React Router.
- Formulário de endereço com validação (Zod) e consulta obrigatória à API ViaCEP.
- Seleção de crédito, débito ou dinheiro, sem transação real.
- Cálculo de subtotal, taxa de entrega e total.
- Tela de sucesso a partir de snapshot do pedido.
- Tema claro/escuro persistido, com fallback para `prefers-color-scheme`.
- Layout mobile-first, responsivo e acessível (WCAG 2.2 AA como referência).
- Logo original criada com auxílio de IA, aplicada no Header, favicon e documentação da marca.
- Documentação: PRD, TECH, TASKS, `AGENTS.md`, `BRAND_GUIDE.md`, `AI_USAGE.md` e README.
- Deploy em hospedagem estática (Vercel ou Netlify).

### 3.2 Fora do escopo
- Backend, banco de dados, autenticação ou contas de usuário.
- Pagamentos reais, gateway financeiro ou coleta de dados bancários.
- Integração com estoque, ERP, logística ou rastreamento.
- Painel administrativo de produtos.
- Envio real do pedido para uma cafeteria.
- Cálculo de frete por transportadora ou distância.
- Histórico de pedidos (apenas o último pedido é mantido para a tela de sucesso).
- Geolocalização automática.
- Chatbot dentro da aplicação.
- Internacionalização além de pt-BR e BRL.

### 3.3 Extras opcionais (somente após o escopo obrigatório e com aprovação registrada)
Busca/filtro por categoria, histórico local de pedidos, cupom de desconto, testes E2E com Playwright + GitHub Actions, animações respeitando `prefers-reduced-motion`, página de detalhes do produto.

## 4. Fluxos de usuário

### 4.1 Fluxo principal
1. O usuário acessa a Home (`/`).
2. Visualiza os cafés com imagem, tags, nome, descrição e preço.
3. Escolhe uma quantidade inteira positiva e adiciona o café ao carrinho.
4. O Header atualiza o contador pela soma de unidades.
5. O usuário acessa o Checkout (`/checkout`) pelo ícone do carrinho.
6. Confere os itens, altera quantidades ou remove produtos.
7. Informa o CEP; a aplicação consulta a ViaCEP e preenche rua, bairro, cidade e UF disponíveis.
8. Informa número e, se necessário, complemento; revisa os demais campos.
9. Seleciona crédito, débito ou dinheiro.
10. Confere subtotal, frete e total.
11. Confirma o pedido.
12. A aplicação revalida os dados, salva um snapshot independente, limpa o carrinho e navega para `/success`.
13. A tela de sucesso apresenta endereço, previsão de entrega e forma de pagamento do snapshot.

### 4.2 Carrinho vazio
- No Checkout sem itens, exibir estado vazio com ação para voltar à Home.
- Não é possível finalizar pedido vazio.

### 4.3 Sucesso sem pedido
- Acesso a `/success` sem snapshot válido exibe estado vazio explicativo e ação para voltar à Home.
- Nunca exibir dados fictícios como se fossem um pedido concluído.

### 4.4 Erros de CEP
- CEP incompleto/malformado: validação local, sem consulta.
- CEP com 8 dígitos, mas não encontrado: mensagem "CEP não encontrado".
- Falha de rede, timeout, resposta inválida ou indisponibilidade: mensagem de falha na consulta e liberação de preenchimento/correção manual.
- Durante a consulta: indicador de carregamento anunciado a leitores de tela; consultas anteriores em andamento são canceladas.

## 5. Requisitos funcionais

IDs estáveis, referenciados na TECH_SPEC e na TASKS_SPEC.

| ID | Requisito | Critério de aceite verificável |
|---|---|---|
| RF-01 | Exibir catálogo de cafés com imagem, nome, descrição, preço e tag(s). | Todos os produtos do catálogo tipado aparecem na Home com esses dados e sem imagens quebradas. |
| RF-02 | Selecionar quantidade antes de adicionar um café. | Controle inicia em 1, não desce abaixo de 1 e aceita apenas inteiros; incremento e decremento funcionam por mouse, toque e teclado. |
| RF-03 | Adicionar cafés ao carrinho e acumular quantidades repetidas. | Adicionar o mesmo café novamente soma a quantidade na linha existente, sem duplicá-la. |
| RF-04 | Exibir contador de unidades no Header. | O contador é a soma das quantidades (ex.: 2 Expressos + 3 Lattes = 5), oculto quando zero. |
| RF-05 | Aumentar, diminuir e remover itens no carrinho. | Alterações atualizam imediatamente itens, subtotal, total e contador; decrementar de 1 remove o item (RN-01). |
| RF-06 | Persistir carrinho em `localStorage`. | Após refresh, itens e quantidades válidos são recuperados; dados corrompidos não quebram a aplicação. |
| RF-07 | Navegar entre `/`, `/checkout` e `/success` com React Router. | A troca de telas ocorre sem recarregamento completo; acesso direto a cada URL funciona (inclusive no deploy). |
| RF-08 | Preencher e validar endereço consultando obrigatoriamente a API pública de CEP. | CEP válido preenche rua, bairro, cidade e UF retornados; número e complemento são manuais; erros de formato, não encontrado e falha da consulta são comunicados e permitem correção. |
| RF-09 | Selecionar crédito, débito ou dinheiro. | Uma opção é obrigatória; nenhuma informação de cartão é solicitada. |
| RF-10 | Exibir subtotal, taxa de entrega e total. | Valores seguem RN-03/RN-04 e aparecem em BRL com duas casas decimais. |
| RF-11 | Impedir finalização com carrinho vazio ou formulário inválido. | A confirmação é bloqueada e erros acessíveis são apresentados e associados aos campos. |
| RF-12 | Confirmar pedido fictício e mostrar endereço e pagamento. | A tela de sucesso apresenta os dados exatos do snapshot confirmado. |
| RF-13 | Limpar carrinho após confirmação, preservando o pedido concluído. | Carrinho e contador zeram; a tela de sucesso continua correta, inclusive após refresh. |
| RF-14 | Alternar light mode e dark mode. | Tema afeta todas as telas, cards, formulários, estados vazios e sucesso; persiste após refresh; sem "flash" do tema errado. |
| RF-15 | Adaptar layout, componentes, formulário e carrinho para dispositivos móveis. | Fluxo completo utilizável em 320, 375/390, 768 e 1280/1440 px sem overflow horizontal. |
| RF-16 | Aplicar logo original desenvolvida com auxílio de IA. | Logo no Header (variações para os dois temas), favicon legível e `BRAND_GUIDE.md` com a seção Branding com IA. |

## 6. Regras de negócio

### RN-01 — Quantidades
- Quantidade é inteiro ≥ 1 em qualquer operação de adição.
- O seletor da Home não desce abaixo de 1.
- **Decisão:** no carrinho, decrementar de 1 para 0 **remove** o item.
- Entradas inválidas não produzem estado inconsistente.

### RN-02 — Produto único
- A identidade do produto é seu `id`.
- Existe no máximo um `CartItem` por `coffeeId`.
- Adicionar novamente o mesmo café soma a quantidade à linha existente.

### RN-03 — Cálculo e frete
- `subtotalCents = Σ(priceCents × quantity)`.
- `totalCents = subtotalCents + deliveryFeeCents`.
- **Taxa de entrega fictícia fixa: R$ 5,00 (500 centavos) por pedido com ao menos um item.**
- Carrinho vazio: subtotal, frete e total iguais a zero.
- A taxa existe em uma única constante; não é repetida como literal.

### RN-04 — Valores monetários
- Armazenados e calculados em centavos inteiros.
- Exibição com `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.
- Proibido acumular valores com ponto flutuante.

### RN-05 — Pagamento
- Opções: `credit` (Cartão de crédito), `debit` (Cartão de débito), `cash` (Dinheiro).
- Escolha exclusivamente informativa; nenhuma transação é realizada.
- Não solicitar número de cartão, CVV ou qualquer dado bancário.

### RN-06 — Persistência e snapshot
- Carrinho persistido em `localStorage`.
- Ao confirmar, criar um `Order` independente com itens copiados (nome, preço, quantidade, imagem), endereço, pagamento, valores, `id` e `createdAt`.
- O pedido não depende do carrinho, que é limpo após a gravação do snapshot.
- O último pedido é persistido em chave separada para sobreviver a refresh na tela de sucesso.

### RN-07 — Endereço
- CEP: oito dígitos após remover caracteres não numéricos; exibido com máscara `00000-000`.
- Consulta à ViaCEP obrigatória ao completar um CEP sintaticamente válido.
- Preencher rua, bairro, cidade e UF com os dados disponíveis; ao consultar outro CEP, substituir esses campos para não manter endereço antigo.
- Número obrigatório e manual; complemento opcional e manual; nunca sobrescritos pela consulta.
- Rua, bairro, cidade e UF obrigatórios para finalizar.
- UF: sigla válida entre as 27 unidades federativas.
- Tratar `erro: true`, resposta inválida, timeout/falha de rede e carregamento.
- Em indisponibilidade, permitir preenchimento manual sem afirmar que o endereço foi validado pela API.

### RN-08 — Dados
- Catálogo em arquivo local tipado.
- Sem backend ou API própria.
- ViaCEP é a única integração externa obrigatória.

### RN-09 — Estados vazios
- Carrinho vazio: mensagem clara e caminho de retorno à Home.
- Sucesso sem pedido válido: explicação e retorno à Home.

### RN-10 — Integridade da confirmação
- Bloquear confirmação com carrinho vazio, item inexistente no catálogo, endereço inválido ou pagamento ausente.
- Revalidar no handler de confirmação; não confiar apenas no botão desabilitado.
- `/success` valida a existência e o formato do snapshot antes de exibir.

## 7. Marca, logo e temas

### 7.1 Identidade visual
- Nome comercial: **Coffee Delivery**.
- A marca comunica café, praticidade, acolhimento e entrega.
- Paleta e tipografia partem do Style Guide do Figma (amarelo/roxo; Baloo 2 e Roboto) e podem ser personalizadas, mantendo coerência nos dois temas.
- Símbolo simples e legível em tamanhos pequenos, acompanhado de logotipo tipográfico.
- Arquivos em SVG (preferencial) e PNG quando necessário.

### 7.2 Branding com IA (obrigatório)
1. Gerar ao menos uma proposta de logo original com ferramenta de IA.
2. Definir conceito, paleta, tipografia e variações para fundo claro e escuro.
3. Registrar em `docs/BRAND_GUIDE.md`, seção **Branding com IA**: ferramenta utilizada, prompt(s), resultado(s), curadoria/ajustes manuais, motivos da escolha e verificação dos termos de uso do material gerado.
4. Verificar legibilidade em 16–48 px e contraste nos dois temas.

### 7.3 Aplicação da logo
- Header: versão adequada ao tema ativo.
- Favicon: símbolo simplificado.
- Documentação: `BRAND_GUIDE.md` e README.
- Não distorcer, recolorir fora do guia ou alterar proporções.

### 7.4 Light/dark mode
- Botão de alternância acessível no Header.
- Tokens semânticos para fundo, superfície, texto, bordas, botões, feedback e estados.
- Persistência em `localStorage`; sem escolha salva, usar `prefers-color-scheme`.
- Botões, links, foco, erros e seleção distinguíveis nos dois temas.

## 8. Requisitos não funcionais

### 8.1 Acessibilidade (referência WCAG 2.2 AA)
- HTML semântico e hierarquia de títulos correta.
- Todos os controles operáveis por teclado, com foco visível.
- Labels associados; erros ligados aos campos (`aria-describedby`, `aria-invalid`).
- Carregamento e feedback anunciados (`aria-live`).
- Contraste mínimo AA nos dois temas.
- Não comunicar erro, sucesso ou seleção apenas por cor.
- Alvos de toque com no mínimo 24 × 24 px (meta: 44 × 44 px).

### 8.2 Responsividade
- Mobile-first, sem rolagem horizontal involuntária, sobreposição de textos ou imagens deformadas.
- Grid de produtos com colunas proporcionais à largura.
- No Checkout, formulário e resumo empilhados em coluna no celular.
- Larguras de verificação: **320, 375/390, 768 e 1280/1440 px**.

### 8.3 Desempenho
- Sem renderizações ou dependências desnecessárias.
- Imagens otimizadas, com dimensões definidas e `loading="lazy"` abaixo da dobra.
- Aplicação utilizável com a ViaCEP indisponível.

### 8.4 Persistência e robustez
- JSON inválido ou versão incompatível no `localStorage` não quebra a aplicação.
- Dados recuperados são validados antes do uso.
- Nenhuma informação financeira sensível é persistida.

### 8.5 Compatibilidade
- Versões atuais de Chrome, Edge, Firefox e Safari (desktop e mobile).

### 8.6 Qualidade
- TypeScript `strict`, sem `any`.
- ESLint sem erros.
- Testes de reducer, cálculos, validação, ViaCEP e fluxo de pedido.
- Nenhum erro no console durante o fluxo principal.

## 9. Uso de assistente de IA no desenvolvimento

- O desenvolvimento é apoiado por assistente de IA (Claude Code), conforme diretrizes em `AGENTS.md`.
- Registrar em `docs/AI_USAGE.md` **pelo menos três interações relevantes**, cada uma com: prompt, objetivo, resposta resumida, decisão tomada e evidência (commit, arquivo ou print).
- Decisões sugeridas pela IA são revisadas antes de serem aceitas; o aluno deve conseguir explicar o código.

## 10. Entregáveis

- Repositório GitHub público, sem `node_modules`, secrets ou `.env` reais.
- Aplicação publicada (Vercel ou Netlify).
- `docs/PRD_SPEC.md`, `docs/TECH_SPEC.md`, `docs/TASKS_SPEC.md`, `docs/BRAND_GUIDE.md`, `docs/AI_USAGE.md`, `AGENTS.md`.
- README com objetivos, stack, instalação, scripts, decisões, link do Figma, branding, evidências de IA, link do deploy e screenshots (Home, Checkout, Sucesso e Dark Mode em mobile; desktop).
- Demonstração breve do fluxo de compra.

## 11. Critérios de aceite gerais
- [ ] RF-01 a RF-16 implementados e verificados.
- [ ] RN-01 a RN-10 respeitadas.
- [ ] Fluxo `/` → `/checkout` → `/success` concluído sem reload.
- [ ] Carrinho persiste após refresh e o contador soma unidades.
- [ ] Consulta real à ViaCEP preenche os campos em CEP válido.
- [ ] CEP inválido, não encontrado e indisponibilidade tratados.
- [ ] Snapshot correto após limpeza do carrinho e após refresh.
- [ ] Nenhum pedido concluído com carrinho vazio ou dados inválidos.
- [ ] Light/dark mode persiste e cobre todas as telas.
- [ ] Layout verificado em 320, 375/390, 768 e 1280/1440 px.
- [ ] `npm run test`, `npm run lint` e `npm run build` sem erros.
- [ ] Logo no Header, favicon e documentação; seção Branding com IA completa.
- [ ] `AI_USAGE.md` com ao menos três interações.
- [ ] Deploy publicado com rotas SPA funcionando por URL direta.

## 12. Decisões de produto

| Decisão | Definição |
|---|---|
| Nome | Coffee Delivery |
| Tipo | SPA demonstrativa de e-commerce |
| Idioma e moeda | pt-BR; BRL |
| Catálogo | Arquivo local tipado, conteúdo conforme Figma |
| Frete | Fixo fictício de R$ 5,00 por pedido não vazio |
| Previsão de entrega | Texto fixo informativo "20 min – 30 min" (conforme Figma) |
| Pagamento | Crédito, débito ou dinheiro; sem transação |
| CEP | ViaCEP |
| Carrinho | `localStorage` |
| Pedido | Último pedido como snapshot separado em `localStorage` |
| Decremento no carrinho | Ao chegar a zero, remove o item |
| Indicador de localização no Header | Exibe cidade/UF do último pedido; oculto se não houver pedido |
| Backend | Não será desenvolvido |
| Rotas | `/`, `/checkout`, `/success`; rotas desconhecidas redirecionam para `/` |
