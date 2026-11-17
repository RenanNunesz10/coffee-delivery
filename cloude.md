# CLOUDE.md — Diretrizes do assistente de IA

> Este arquivo contém as instruções operacionais do assistente de IA para o projeto Coffee Delivery. O nome do arquivo foi mantido como solicitado (`cloude.md`). Se a ferramenta utilizada exigir convenção específica, copie estas diretrizes para o nome esperado por ela.

## 1. Contexto do projeto

Coffee Delivery é uma SPA demonstrativa de e-commerce de cafés. O usuário pode navegar pelo catálogo, selecionar quantidades, gerenciar o carrinho, informar endereço com consulta real a uma API pública de CEP, escolher pagamento fictício e visualizar a confirmação do pedido.

A interface deve reproduzir fielmente o Figma fornecido pelo usuário em desktop e mobile. O Figma é a referência visual primária: não inventar uma direção visual alternativa quando houver layout, componentes, cores ou espaçamentos definidos no arquivo de design.

## 2. Leitura obrigatória antes de codificar

**Antes de escrever, alterar ou gerar qualquer código, leia integralmente:**
1. `docs/PRD_SPEC.md`
2. `docs/TECH_SPEC.md`
3. `docs/TASKS_SPEC.md`

Se existir, leia também:
4. `docs/BRAND_GUIDE.md`
5. `README.md`
6. O Figma e os assets fornecidos pelo usuário.

Não comece a implementação se os SPECs estiverem ausentes. Nesse caso, solicite que sejam criados ou proponha a criação/atualização da documentação primeiro.

Em caso de conflito:
- O PRD define o comportamento e o escopo do produto.
- A TECH_SPEC define a arquitetura e as decisões técnicas.
- A TASKS_SPEC define a ordem de execução.
- O Figma/Brand Guide define a apresentação visual.
- Não resolva conflitos silenciosamente: explique o conflito e atualize os documentos antes de implementar a mudança.

## 3. Stack e padrões

- React + TypeScript + Vite.
- Tailwind CSS para estilização.
- React Router DOM para navegação SPA.
- Context API + `useReducer` para estado do carrinho.
- React Hook Form + Zod para formulários e validação.
- ViaCEP (ou serviço público equivalente aprovado e documentado) para consulta real de CEP.
- `localStorage` para persistência local de carrinho, tema e snapshot do último pedido.
- Vitest + Testing Library para testes.
- ESLint para qualidade estática.

Respeite o lockfile e as versões já instaladas. Não substitua bibliotecas ou introduza dependências sem justificar o benefício.

## 4. Regras de implementação

### 4.1 Trabalho por tarefas pequenas
- Trabalhe em **uma tarefa da TASKS_SPEC por vez**.
- Antes de começar, informe o ID, objetivo, arquivos previstos e critério de pronto.
- Não gere a aplicação inteira de uma só vez.
- Não avance para uma tarefa dependente sem concluir ou justificar o bloqueio da anterior.
- Ao finalizar, execute os testes aplicáveis, atualize o checklist e registre o resultado.
- Solicite confirmação quando uma decisão alterar escopo, experiência de usuário ou arquitetura definida.

### 4.2 Rastreabilidade
- Todo comportamento novo deve estar associado a um RF/RN do `PRD_SPEC.md`.
- Atualize `TECH_SPEC.md` quando mudar arquitetura, tipos, contratos, dependências ou persistência.
- Atualize `TASKS_SPEC.md` quando mudar ordem, arquivos, critérios ou status.
- Não renomeie nem remova IDs de requisitos sem atualizar todas as referências.

### 4.3 TypeScript e qualidade
- Manter `strict` habilitado.
- Evitar `any`; preferir tipos explícitos e `unknown` com narrowing.
- Não usar `@ts-ignore` ou casts inseguros para esconder problemas.
- Componentes devem ter responsabilidade clara e tamanho razoável.
- Extrair regras de negócio para funções puras ou módulos de domínio.
- Não duplicar constantes ou regras de cálculo.
- Evitar lógica de negócio complexa dentro do JSX.
- Não mutar estado, arrays ou objetos.
- Manter imports organizados e nomes descritivos.

### 4.4 Carrinho e dinheiro
- Quantidades são inteiros positivos.
- Adicionar produto repetido acumula quantidade na mesma linha.
- Decrementar de 1 para 0 remove o item.
- O contador do Header soma unidades, não tipos de produtos.
- Preços e cálculos devem usar centavos inteiros.
- Frete é R$ 5,00 (500 centavos) por pedido não vazio, centralizado em uma constante.
- Carrinho vazio tem frete zero.
- Formatar valores em BRL com `Intl.NumberFormat`.
- Não permitir confirmar pedido com item inexistente no catálogo.

### 4.5 CEP e endereço
- A consulta pública de CEP é obrigatória; não substituí-la por dados hardcoded ou mocks em produção.
- Normalizar CEP para oito dígitos antes da consulta.
- Consultar ViaCEP e mapear logradouro, bairro, cidade e UF quando disponíveis.
- Número e complemento são preenchidos manualmente; complemento é opcional.
- Tratar loading, CEP malformado, CEP não encontrado, erro de API, falha de rede e resposta inválida.
- Em indisponibilidade, comunicar a falha e permitir correção/preenchimento manual.
- Não afirmar que o endereço foi validado pela API se a consulta falhou.

### 4.6 Pedido e pagamento
- Pagamento é apenas informativo: crédito, débito ou dinheiro.
- Nunca implementar gateway, transação real ou solicitar dados de cartão sem mudança formal do escopo.
- Criar snapshot independente do carrinho antes de limpar o estado.
- A tela de confirmação deve usar o snapshot salvo, nunca depender do carrinho.
- Acesso à confirmação sem pedido válido deve exibir estado vazio.

### 4.7 Tema e responsividade
- Tema claro/escuro deve cobrir todas as páginas e estados.
- Usar tokens semânticos centralizados.
- Persistir tema e respeitar preferência do sistema quando não houver escolha salva.
- Projetar mobile-first e testar 360 px, 768 px e 1280 px.
- Não introduzir overflow horizontal.
- Preservar acessibilidade, foco visível e navegação por teclado.

## 5. Design, Figma e marca

- Inspecione o Figma antes de construir ou alterar componentes visuais.
- Reproduza hierarquia, alinhamento, espaçamento, tipografia, cores, dimensões e comportamento responsivo definidos.
- Se o Figma não especificar um estado, use os tokens e padrões do projeto; registre a decisão quando relevante.
- Não invente conteúdo de produto que conflite com os dados definidos.
- A logo deve ser original, desenvolvida com auxílio de IA e aplicada no Header, favicon e documentação da marca.
- Não distorça, recolora ou altere proporções da logo sem respeitar o Brand Guide.
- Verifique legibilidade e contraste nos dois temas.

## 6. Limites de escopo

Não implementar sem aprovação explícita:
- Backend, banco de dados ou autenticação.
- Pagamento real ou gateway.
- Integração com estoque, logística ou rastreamento.
- Painel administrativo.
- Contas de usuário ou histórico remoto de pedidos.
- Funcionalidades não descritas nos SPECs.

O catálogo pode ser local e tipado. Não criar API própria. A integração externa obrigatória é a consulta pública de CEP.

## 7. Testes e verificação

Antes de declarar uma tarefa concluída:
- Execute os testes unitários/integração relacionados.
- Execute `npm run lint`.
- Execute `npm run build`.
- Teste manualmente o comportamento visual ou funcional alterado.
- Registre no `TASKS_SPEC.md` o teste realmente executado e seu resultado.
- Não alegue que testes passaram se não foram executados.

Coberturas prioritárias:
- Reducer do carrinho e soma de quantidades.
- Cálculos em centavos e frete.
- Persistência após refresh.
- Consulta ViaCEP: válido, inválido, não encontrado e indisponível.
- Validação de endereço e pagamento.
- Bloqueio de pedido inválido/vazio.
- Snapshot preservado após limpar carrinho.
- Tema persistente.
- Responsividade e navegação por teclado.

## 8. Commits

Ao concluir cada tarefa, criar commit semântico, seguindo Conventional Commits:
- `feat:` funcionalidade nova.
- `fix:` correção.
- `docs:` documentação.
- `test:` testes.
- `refactor:` refatoração sem mudança de comportamento.
- `style:` ajustes visuais/formatação sem mudança lógica.
- `chore:` configuração e manutenção.

Exemplos:
- `feat: implement persistent cart context`
- `fix: handle viacep network errors`
- `docs: update checkout technical decisions`
- `test: cover cart reducer edge cases`

Não criar commits com mensagens vagas como `update`, `changes` ou `final`.

## 9. Comunicação e entrega de cada tarefa

Ao iniciar:
1. Indique a tarefa e requisitos relacionados.
2. Resuma a abordagem e os arquivos que serão alterados.
3. Aponte ambiguidades ou dependências antes de codificar.

Ao concluir:
1. Liste o que foi implementado.
2. Informe arquivos alterados.
3. Informe testes executados e resultados reais.
4. Informe o commit criado (ou explique se não houver acesso ao Git).
5. Atualize o status da tarefa e o registro de execução.
6. Indique a próxima tarefa, sem executá-la automaticamente.

## 10. Regra final

**A especificação é o contrato do projeto.** Não sacrifique requisitos funcionais, acessibilidade, consistência monetária ou fidelidade ao Figma por velocidade. Faça mudanças pequenas, verificáveis e documentadas.
