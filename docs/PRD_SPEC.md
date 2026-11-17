# Coffee Delivery — Product Requirements Document (PRD)

**Versão:** 1.0.0  
**Status:** Aprovado para início do desenvolvimento  
**Última atualização:** 17/11/2026  
**Produto:** Coffee Delivery

## 1. Visão geral

### 1.1 Resumo do produto
Coffee Delivery é uma aplicação web de página única (SPA) para apresentar um catálogo de cafés e permitir que o usuário monte um carrinho, informe um endereço de entrega, escolha uma forma de pagamento fictícia e conclua um pedido demonstrativo.

A experiência deve ser simples, responsiva e acessível, com identidade visual própria, suporte a temas claro e escuro e persistência local do carrinho.

### 1.2 Problema
O usuário precisa de uma experiência direta para descobrir cafés, selecionar quantidades e simular uma compra sem etapas desnecessárias. A aplicação deve demonstrar um fluxo de e-commerce completo no front-end, sem depender de backend ou processamento financeiro.

### 1.3 Objetivos
- Exibir um catálogo de cafés com informações suficientes para a escolha.
- Permitir adicionar, alterar e remover produtos do carrinho.
- Manter o carrinho após atualização da página.
- Conduzir o usuário por um checkout com endereço validado via consulta pública de CEP.
- Calcular subtotal, frete e total de forma consistente.
- Registrar um pedido fictício e apresentar sua confirmação.
- Oferecer experiência consistente em desktop e dispositivos móveis.
- Disponibilizar temas claro e escuro.

### 1.4 Público-alvo
Pessoas que desejam navegar por um catálogo de cafés e simular uma compra em uma interface de e-commerce. O produto também tem finalidade educacional e demonstrativa, servindo como exercício de desenvolvimento front-end.

## 2. Escopo

### 2.1 Dentro do escopo
- Catálogo local e tipado de cafés.
- Seleção de quantidade e gerenciamento do carrinho.
- Contador de unidades no Header.
- Persistência do carrinho em `localStorage`.
- Rotas Home, Checkout e Confirmação com React Router.
- Formulário de endereço com validação e consulta obrigatória à API ViaCEP.
- Seleção de crédito, débito ou dinheiro, sem transação real.
- Cálculo de subtotal, taxa de entrega e total.
- Confirmação fictícia com snapshot do pedido.
- Tema claro/escuro persistido.
- Layout responsivo e acessível.
- Logo original gerada com auxílio de IA, integrada ao Header, favicon e documentação da marca.

### 2.2 Fora do escopo
- Backend, banco de dados, autenticação ou contas de usuário.
- Pagamentos reais, gateway financeiro ou armazenamento de dados bancários.
- Integração com estoque, ERP, logística ou rastreamento.
- Cadastro, edição ou exclusão de produtos por painel administrativo.
- Envio real do pedido para uma cafeteria.
- Cálculo de frete por transportadora ou distância.
- Histórico de pedidos entre sessões/dispositivos.
- Geolocalização automática do endereço.
- Internacionalização além de português brasileiro e moeda BRL, salvo decisão posterior registrada.

## 3. Fluxos de usuário

### 3.1 Fluxo principal
1. O usuário acessa a Home.
2. Visualiza os cafés, suas imagens, descrições, preços e categorias.
3. Escolhe uma quantidade inteira positiva e adiciona um café ao carrinho.
4. O Header atualiza o contador pela soma de unidades.
5. O usuário acessa o Checkout.
6. Confere os itens, altera quantidades ou remove produtos.
7. Informa o CEP; a aplicação consulta a API pública e preenche os campos disponíveis.
8. Informa número e, se necessário, complemento; revisa os demais campos.
9. Seleciona crédito, débito ou dinheiro.
10. Confere subtotal, frete e total.
11. Confirma o pedido.
12. A aplicação salva um snapshot independente do carrinho, limpa o carrinho e navega para Confirmação.
13. A tela de sucesso apresenta os dados do pedido, endereço e pagamento.

### 3.2 Fluxo de carrinho vazio
- Se o usuário acessar o Checkout sem itens, a aplicação apresenta estado vazio e uma ação para voltar à Home.
- Não deve ser possível finalizar um pedido vazio.

### 3.3 Fluxo de confirmação sem pedido
- Se a rota de confirmação for acessada sem um pedido válido disponível, apresentar mensagem de estado vazio/inválido e uma ação para voltar à Home.
- Não exibir dados fictícios como se fossem um pedido concluído.

### 3.4 Fluxo de erro de CEP
- CEP incompleto ou malformado: apresentar validação sem iniciar consulta.
- CEP válido sintaticamente, mas não encontrado: informar que o CEP não foi localizado.
- Falha ou indisponibilidade da API: informar que não foi possível consultar no momento e permitir preenchimento/correção manual dos campos.
- Durante a consulta, apresentar estado de carregamento e impedir consultas concorrentes desnecessárias.

## 4. Requisitos funcionais

Os IDs abaixo são identificadores estáveis e devem ser referenciados na TECH_SPEC e TASKS_SPEC.

| ID | Requisito | Critério de aceite verificável |
|---|---|---|
| RF-01 | Exibir catálogo de cafés com imagem, nome, descrição, preço e categoria/tag. | Os produtos do catálogo tipado aparecem corretamente na Home. |
| RF-02 | Selecionar quantidade antes de adicionar um café. | Controles permitem apenas quantidades inteiras positivas; incremento e decremento funcionam. |
| RF-03 | Adicionar cafés ao carrinho e acumular quantidades repetidas. | Adicionar o mesmo produto novamente atualiza a linha existente, sem duplicá-la. |
| RF-04 | Exibir contador de unidades no Header. | O contador corresponde à soma de todas as quantidades do carrinho. |
| RF-05 | Aumentar, diminuir e remover itens individualmente. | Alterações atualizam imediatamente itens, subtotal, total e contador; quantidade zero remove o item ou é bloqueada conforme RN-01. |
| RF-06 | Persistir carrinho em `localStorage`. | Após refresh, os itens e quantidades válidos são recuperados. |
| RF-07 | Navegar entre Home, Checkout e Confirmação com React Router. | A navegação ocorre sem recarregamento completo da página. |
| RF-08 | Preencher e validar endereço, consultando obrigatoriamente API pública de CEP. | CEP válido preenche logradouro, bairro, cidade e UF quando retornados; número e complemento são manuais. Erros de formato, não encontrado e indisponibilidade são comunicados. |
| RF-09 | Selecionar crédito, débito ou dinheiro. | Uma forma de pagamento válida é obrigatória para concluir. |
| RF-10 | Exibir subtotal, taxa de entrega e total geral. | Valores seguem RN-03 e são apresentados em BRL com duas casas decimais. |
| RF-11 | Impedir finalização com carrinho vazio ou formulário inválido. | A ação de concluir é bloqueada e erros acessíveis são apresentados. |
| RF-12 | Confirmar pedido fictício e mostrar endereço e pagamento. | A tela de sucesso apresenta os dados exatos do snapshot confirmado. |
| RF-13 | Limpar carrinho após confirmação, preservando pedido concluído. | Carrinho fica vazio, mas a confirmação continua exibindo o snapshot correto. |
| RF-14 | Alternar light mode e dark mode. | Tema afeta todas as telas e permanece após refresh. |
| RF-15 | Adaptar layout, componentes, formulário e carrinho para dispositivos móveis. | Fluxo completo pode ser utilizado em telas pequenas sem perda de conteúdo ou ações. |
| RF-16 | Aplicar logo original desenvolvida com auxílio de IA. | Logo aparece no Header, favicon e documentação da marca; versões e contraste são adequados aos dois temas. |

## 5. Regras de negócio

### RN-01 — Quantidades
- Quantidade deve ser um número inteiro maior ou igual a 1 em qualquer operação de adição.
- No carrinho, decrementar de 1 para 0 remove o item.
- Entradas inválidas não podem produzir estado inconsistente.

### RN-02 — Produto único
- A identidade do produto é seu `id`.
- Um `CartItem` por `coffeeId` deve existir no carrinho.
- Adicionar novamente o mesmo café soma a quantidade à linha existente.

### RN-03 — Cálculo e frete
- `subtotalCents = Σ(unitPriceCents × quantity)`.
- `totalCents = subtotalCents + deliveryFeeCents`.
- Taxa de entrega fictícia e centralizada: **R$ 5,00 (500 centavos) por pedido com pelo menos um item**.
- Carrinho vazio tem subtotal, frete e total iguais a zero.
- A taxa não deve ser repetida como literal em componentes diferentes.

### RN-04 — Valores monetários
- Valores são armazenados e calculados em centavos inteiros.
- Exibição usa `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.
- Não utilizar ponto flutuante para acumular valores monetários.

### RN-05 — Pagamento
- Opções: `credit`, `debit` e `cash`.
- A seleção é exclusivamente informativa.
- Não solicitar número de cartão, CVV ou qualquer dado bancário.
- Nenhuma transação financeira real é realizada.

### RN-06 — Persistência e snapshot
- Carrinho é persistido em `localStorage`.
- Ao confirmar, criar um objeto `Order` imutável/independente contendo itens, endereço, pagamento, valores e data/identificador do pedido.
- O pedido concluído não pode depender do estado do carrinho, que será limpo.
- Persistência do último pedido pode usar uma chave separada em `localStorage` para permitir refresh na tela de confirmação.

### RN-07 — Endereço
- CEP deve conter oito dígitos após remover caracteres não numéricos.
- A consulta ViaCEP é obrigatória e deve ocorrer para CEP completo e válido.
- Preencher automaticamente logradouro, bairro, cidade e UF conforme os dados disponíveis.
- Número é obrigatório e manual; complemento é opcional.
- Logradouro, bairro, cidade e UF são obrigatórios para finalizar.
- Tratar `erro: true`, resposta inválida, timeout/falha de rede e estados de carregamento.
- Em indisponibilidade, permitir correção/preenchimento manual, mantendo indicação clara de que a consulta falhou.
- UF deve ser uma sigla brasileira válida de duas letras.

### RN-08 — Dados
- Catálogo pode ser mantido em arquivo local tipado.
- Backend e API própria não são necessários.
- ViaCEP (ou serviço público equivalente documentado) é a única integração externa obrigatória.

### RN-09 — Estados vazios
- Carrinho vazio deve ter mensagem clara e caminho de retorno à Home.
- Confirmação sem pedido válido deve explicar que não há pedido para exibir e oferecer retorno à Home.

### RN-10 — Navegação e integridade
- Não permitir confirmar se o carrinho estiver vazio, houver produto inexistente no catálogo, endereço inválido ou pagamento não selecionado.
- A rota de confirmação deve validar a existência de snapshot válido.
- Não confiar apenas em desabilitar visualmente o botão: validar novamente no handler de confirmação.

## 6. Requisitos não funcionais

### 6.1 Acessibilidade
- HTML semântico e hierarquia correta de títulos.
- Todos os controles operáveis por teclado e com foco visível.
- Labels associados aos campos; mensagens de erro ligadas aos respectivos inputs.
- Estados de carregamento e feedback anunciáveis por leitores de tela (`aria-live` quando apropriado).
- Contraste adequado nos dois temas.
- Não usar apenas cor para comunicar erro, sucesso ou seleção.
- Botões com nomes acessíveis e áreas de toque confortáveis.

### 6.2 Responsividade
- Abordagem mobile-first.
- Layout sem rolagem horizontal indevida.
- Catálogo, resumo do pedido, formulários e navegação devem se adaptar a telas estreitas.
- Testar, no mínimo, larguras de 360 px, 768 px e 1280 px.

### 6.3 Desempenho
- Evitar renderizações desnecessárias e dependências sem justificativa.
- Otimizar dimensões/formato das imagens e utilizar carregamento apropriado.
- A aplicação deve permanecer utilizável mesmo quando a API de CEP estiver indisponível.

### 6.4 Persistência e robustez
- Tratar JSON inválido ou versão incompatível no `localStorage` sem quebrar a aplicação.
- Validar dados recuperados antes de utilizá-los.
- Não persistir informações financeiras sensíveis.
- O fluxo de confirmação deve manter snapshot independente do carrinho.

### 6.5 Compatibilidade
- Suporte às versões atuais dos principais navegadores: Chrome, Edge, Firefox e Safari.
- Utilizar APIs web amplamente suportadas ou documentar eventual limitação.

### 6.6 Qualidade
- TypeScript em modo estrito.
- ESLint e formatação consistente.
- Testes para reducer, cálculos, validação de endereço/CEP e fluxo de pedido.
- Nenhum erro crítico no console durante o fluxo principal.

## 7. Marca, logo e temas

### 7.1 Identidade visual
- Nome do produto: **Coffee Delivery**.
- A marca deve comunicar café, praticidade, acolhimento e entrega.
- Criar logo original com auxílio de IA; não copiar marcas existentes.
- Preferir símbolo simples e legível em tamanhos pequenos, acompanhado de logotipo tipográfico.
- Exportar em SVG quando possível e PNG para usos que exigirem imagem raster.
- Registrar conceito, paleta, tipografia, variações e usos no documento `docs/BRAND_GUIDE.md` (a ser criado durante a tarefa de identidade).

### 7.2 Aplicação da logo
- Header: versão principal adequada ao tema.
- Favicon: símbolo simplificado legível em 16–48 px.
- Documentação: incluir arquivos/visualização da marca e orientações de uso.
- Garantir espaçamento e proporção consistentes; não distorcer a logo.

### 7.3 Light/dark mode
- Disponibilizar alternância de tema em local consistente.
- Centralizar cores em tokens CSS ou configuração equivalente.
- Persistir preferência em `localStorage`.
- Aplicar o tema globalmente, inclusive formulários, cards, estados vazios, Header e checkout.
- Respeitar `prefers-color-scheme` como valor inicial quando não houver preferência salva.

## 8. Critérios de aceite gerais
- [ ] Todos os RF-01 a RF-16 implementados e verificados.
- [ ] RN-01 a RN-10 respeitadas.
- [ ] Fluxo Home → Checkout → Confirmação concluído sem reload.
- [ ] Carrinho persiste após refresh e contador soma unidades.
- [ ] Consulta real à API ViaCEP executada com sucesso em CEP válido.
- [ ] Erros de CEP inválido, não encontrado e indisponibilidade tratados.
- [ ] Pedido mantém snapshot correto após limpeza do carrinho.
- [ ] Nenhum pedido pode ser concluído com carrinho vazio ou dados inválidos.
- [ ] Light/dark mode persiste e cobre todas as telas.
- [ ] Layout testado em 360 px, 768 px e 1280 px.
- [ ] Testes, lint e build executam sem erros.
- [ ] Logo aplicada no Header, favicon e documentação.

## 9. Decisões de produto
| Decisão | Definição |
|---|---|
| Nome | Coffee Delivery |
| Tipo | SPA demonstrativa de e-commerce |
| Idioma e moeda | Português brasileiro; BRL |
| Catálogo | Arquivo local tipado |
| Frete | Fixo fictício de R$ 5,00 por pedido não vazio |
| Pagamento | Crédito, débito ou dinheiro; sem transação |
| CEP | ViaCEP como integração pública padrão |
| Carrinho | `localStorage` |
| Pedido | Snapshot separado do carrinho, persistido para a tela de confirmação |
| Decremento | Ao chegar a zero, remover o item |
| Backend | Não será desenvolvido nesta entrega |
| Rotas | `/`, `/checkout`, `/confirmation` |
