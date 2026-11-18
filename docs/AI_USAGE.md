# Registro de uso de IA — Coffee Delivery

**Ferramenta principal:** Claude Code (modelo Claude Opus 5.5), extensão do VS Code, com acesso ao repositório local.
**Diretrizes do assistente:** [`AGENTS.md`](../AGENTS.md) (importado por `CLAUDE.md`).
**Documentos relacionados:** [`PRD_SPEC.md`](./PRD_SPEC.md) · [`TECH_SPEC.md`](./TECH_SPEC.md) · [`TASKS_SPEC.md`](./TASKS_SPEC.md)

## Como registrar

Cada interação relevante recebe uma entrada com:

| Campo | Conteúdo |
|---|---|
| **Prompt** | O pedido feito à IA (literal ou resumido fielmente). |
| **Objetivo** | O que se queria obter. |
| **Resposta resumida** | O que a IA propôs ou produziu. |
| **Análise crítica** | O que foi aceito, ajustado ou rejeitado, e por quê. |
| **Decisão tomada** | O que entrou no projeto. |
| **Evidência** | Commit, arquivo ou captura que comprova. |

Princípios: a IA propõe, o aluno decide; nenhuma sugestão é aceita sem revisão; resultados de testes só são registrados se tiverem sido realmente executados.

## Interações

### IA-01 — Organizar e revisar as especificações
- **Data:** 17/11/2026 · **Tarefa:** TASK-001
- **Prompt:** "Abaixo te envio o escopo completo do projeto, vamos desenvolver pensando em versionamento utilizando commits no GitHub [...]. Te envio também as pastas Spec que gerei do projeto, organize elas no projeto." Em seguida: "Refaça as Spec".
- **Objetivo:** versionar PRD, TECH, TASKS e as diretrizes do agente e garantir que estivessem de acordo com o enunciado.
- **Resposta resumida:** a IA moveu os SPECs para `docs/` e comparou com o enunciado. Apontou 7 divergências: rota `/success` × `/confirmation`; ausência do `AGENTS.md`; justificativa insuficiente para usar Tailwind no lugar de styled-components; larguras de teste (320/375 px); falta de `AI_USAGE.md`, da seção Branding com IA e de screenshots; TASK-002 já parcialmente feita; e falta de acesso ao Figma. Na reescrita, também encontrou um erro de ordem no plano: a TASK-016 usava `pricing.ts` antes de a TASK-017 criá-lo.
- **Análise crítica:** as divergências foram conferidas no enunciado antes de aceitar. Mantive as decisões de produto que já eram minhas (frete fixo, remoção ao decrementar para zero). Algumas decisões novas da IA (localização no Header a partir do último pedido, previsão de entrega fixa) foram aceitas, mas ficaram registradas como decisões no PRD para revisão.
- **Decisão tomada:** SPECs reescritos na versão 1.1.0; `cloude.md` substituído por `AGENTS.md` + `CLAUDE.md` (que importa o `AGENTS.md`, evitando duplicação).
- **Evidência:** commits `8fd0755` e `41de0e1`; seção "Registro de execução" da TASKS_SPEC.

### IA-02 — Acesso ao Figma e análise do design
- **Data:** 17/11/2026 · **Tarefa:** apoio às TASK-005/006/009
- **Prompt:** envio do link do Figma; depois, "Analise os pdfs do Figma" com o PDF exportado e o Style Guide.
- **Objetivo:** transformar o protótipo em tokens, componentes e conteúdo implementáveis.
- **Resposta resumida:** a IA informou que não conseguia abrir o link (não havia integração com o Figma na sessão) e ofereceu três caminhos: MCP oficial do Figma, token da API ou export manual. Com o PDF, documentou as 16 cores, a escala tipográfica, os estados dos componentes, os 14 cafés e os textos fixos. Também extraiu as fotos dos cafés de dentro do PDF, identificou cada uma pela posição na grade da Home e otimizou as imagens para WebP (~12 KB cada).
- **Análise crítica:** a IA não inventou o layout quando não tinha acesso ao Figma; pediu a fonte. A correspondência foto ↔ café foi feita pela posição no PDF, e não "no olho", e foi conferida com o checkout (Expresso Tradicional e Latte). Divergências entre o Figma e os SPECs foram listadas em vez de resolvidas em silêncio.
- **Decisão tomada:** criado `docs/figma/README.md` como referência de design; imagens dos cafés versionadas em `src/assets/coffees/`.
- **Evidência:** commits `3381d0f` e `430b9b4`; `docs/figma/README.md`.

### IA-03 — Resolver divergências entre Figma e SPECs
- **Data:** 17/11/2026 · **Tarefa:** revisão das SPECs
- **Prompt:** "Siga o figma e as fotos pode gerar usando IA".
- **Objetivo:** decidir frete, ícones e assets que faltavam.
- **Resposta resumida:** frete alterado de R$ 5,00 para **R$ 3,50** (valor do Figma) em todos os documentos; ícones trocados de Lucide para **Phosphor** (indicado no Style Guide); tokens renomeados com os nomes do Figma; preço da linha do carrinho definido como unitário × quantidade (o Figma tinha um valor inconsistente). A IA explicou que não gera fotos, mas pode desenhar SVGs, e sugeriu usar um gerador de imagens para o hero.
- **Análise crítica:** a regra de "não repetir o valor do frete" do PRD facilitou a mudança: apenas uma constante foi alterada. Conferi por busca que não sobrou nenhuma ocorrência de `500`/`R$ 5,00`.
- **Decisão tomada:** SPECs na versão 1.2.0.
- **Evidência:** commit `b49aa4b`.

### IA-04 — Assets provisórios e estratégia de versionamento
- **Data:** 17/11/2026 · **Tarefa:** replanejamento da TASK-005
- **Prompt:** "as imagens eu faço depois, coloque o SVG por enquanto para ficar mais fácil de visualizar como está o projeto. Vamos deixar o push para o último momento só".
- **Objetivo:** visualizar o projeto antes de ter a identidade final criada com IA.
- **Resposta resumida:** a TASK-005 foi dividida: SVGs provisórios agora e a nova TASK-032 para aplicar a identidade final antes do deploy. O push passou a ser feito somente no final, com commits locais por tarefa.
- **Análise crítica:** a divisão mantém o requisito RF-16 rastreável. Os SVGs provisórios não podem ser apresentados como a logo final feita com IA.
- **Decisão tomada:** TASKS_SPEC na versão 1.3.0.
- **Evidência:** commit `4a301e6`.

### IA-05 — Configuração do projeto e ferramentas
- **Data:** 17/11/2026 · **Tarefas:** TASK-002 e TASK-003
- **Prompt:** "continue" (execução das tarefas conforme a TASKS_SPEC).
- **Objetivo:** limpar o template do Vite e configurar Tailwind, Vitest e Testing Library.
- **Resposta resumida:** boilerplate removido; `App` movido para `src/app/`; `lang="pt-BR"`. Tailwind 4 instalado via plugin do Vite; Vitest 5 com jsdom; primeiro teste criado. A IA percebeu que o `tsconfig` não declarava `strict: true` (o TypeScript 6 já ativa por padrão) e o tornou explícito, como exige a TECH_SPEC. Também analisou o `npm audit`: as 12 vulnerabilidades altas estão apenas em dependências de desenvolvimento (`picomatch`), e o build de produção não tem nenhuma.
- **Análise crítica:** os resultados foram verificados com os comandos reais (`test`, `lint`, `build` e servidor local), e não apenas declarados. Não usei `npm audit fix --force`, porque ele traria mudanças incompatíveis sem benefício para o app publicado.
- **Decisão tomada:** TASK-002 e TASK-003 concluídas.
- **Evidência:** commits `9f0d7d2` e `880d060`; registro de execução da TASKS_SPEC.

### IA-06 — Contraste do Figma e acessibilidade dos tokens
- **Data:** 17/11/2026 · **Tarefa:** TASK-006
- **Prompt:** "Continue!" (execução da TASK-006: tokens e estilos globais).
- **Objetivo:** transformar o Style Guide em tokens claros e escuros que atendam ao WCAG AA.
- **Resposta resumida:** a IA calculou o contraste de cada combinação usada no Figma e encontrou 4 que reprovam o AA: texto branco no botão amarelo (2,1:1), descrição cinza (3,2:1), texto da tag (2,7:1) e número do badge (3,3:1). Propôs ajustes mínimos (texto escuro sobre amarelo, `base-label` mais escuro, tokens `yellow-ink`/`purple-ink`), criou uma paleta escura própria e um teste automatizado de contraste.
- **Análise crítica:** a mudança altera o visual do Figma, então foi apresentada como decisão explícita, com um único token (`--on-yellow`) para reverter, em vez de ser aplicada em silêncio. O teste impede que um ajuste futuro de cor quebre o contraste sem ninguém perceber.
- **Decisão tomada:** ajustes aceitos e registrados como divergência D10.
- **Evidência:** commit `aa643d3`; `src/styles/tokens.test.ts`; `docs/figma/README.md`.

### IA-07 — Context API + useReducer no carrinho
- **Data:** 18/11/2026 · **Tarefas:** TASK-015 a TASK-017
- **Prompt:** "Continue o restante do projeto e vá fazendo os commits".
- **Objetivo:** implementar e entender o estado global do carrinho.
- **Resposta resumida:** a IA separou as responsabilidades: o reducer puro decide como o estado muda, o Provider expõe ações e valores derivados e salva no `localStorage`, e o hook `useCart` dá acesso tipado. Explicou por que o carrinho é lido de forma **síncrona** no inicializador do `useReducer`: se fosse lido em um efeito, o primeiro salvamento gravaria o carrinho vazio por cima dos dados salvos. Os testes congelam o estado (`Object.freeze`) para provar que o reducer não o altera.
- **Análise crítica:** conferi que ações inválidas devolvem o mesmo objeto (sem re-render) e que a leitura do storage aproveita os itens válidos em vez de descartar o carrinho inteiro.
- **Decisão tomada:** arquitetura mantida como descrita na TECH_SPEC §5 e no README ("Fluxo do estado do carrinho").
- **Evidência:** commits `c656570`, `b04122c` e `5ac4124`; `src/features/cart/*`.

### IA-08 — Integração real com a ViaCEP
- **Data:** 18/11/2026 · **Tarefas:** TASK-020 e TASK-021
- **Prompt:** execução das tarefas de CEP conforme a TASKS_SPEC.
- **Objetivo:** consulta real e robusta, com todos os casos de erro tratados.
- **Resposta resumida:** a IA modelou o resultado como uma união com `success`, `invalid`, `not-found`, `error` (rede, timeout, HTTP, resposta inválida) e `aborted`, e validou a resposta com Zod. Antes de concluir, **conferiu o contrato na API real**: CEP inexistente responde HTTP 200 com `{"erro": "true"}` (string, não booleano) e CEP malformado responde HTTP 400 em HTML. A primeira requisição real não respondeu em 10 s, o que confirmou na prática a necessidade do timeout.
- **Análise crítica:** o detalhe `"true"` como string não estava na especificação; sem a checagem real, CEPs inexistentes seriam tratados como "resposta inválida". O formulário ignora respostas atrasadas de um CEP antigo e limpa o endereço anterior ao trocar de CEP.
- **Decisão tomada:** serviço e formulário aceitos; o contrato real foi registrado na TECH_SPEC §8.2.
- **Evidência:** commits `71f3fb8` e `98859a4`; `src/features/checkout/services/viacep.test.ts`.

### IA-09 — Erro da própria IA detectado pelo lint
- **Data:** 18/11/2026 · **Tarefa:** TASK-021
- **Prompt:** execução da TASK-021.
- **Objetivo:** concluir o formulário de endereço sem erros de qualidade.
- **Resposta resumida:** a IA fez o commit da TASK-021 com **1 erro de lint** (`react-hooks/refs`: um callback que lia refs era passado ao `register()` durante a renderização). O comando de verificação continuou mesmo com a falha, e o registro da tarefa dizia "lint sem erros". Ao notar o erro, a IA o relatou, corrigiu o código (handlers do CEP como props de evento), **corrigiu o registro na TASKS_SPEC** e criou um script que impede o commit quando teste, lint ou build falham.
- **Análise crítica:** mostra por que não se aceita "passou" sem evidência: o resultado real do comando precisa ser conferido. A correção foi registrada com transparência, em vez de ser escondida em um commit amend.
- **Decisão tomada:** correção aceita; todos os commits seguintes passaram pelo script de verificação.
- **Evidência:** commits `98859a4` (com o erro) e `f3e2b34` (correção); linha da TASK-021 no registro de execução.

### IA-10 — Revisão de responsividade, acessibilidade e desempenho
- **Data:** 18/11/2026 · **Tarefas:** TASK-027 a TASK-029
- **Prompt:** "continue de onde paramos".
- **Objetivo:** verificar o produto como o usuário o usa, além dos testes unitários.
- **Resposta resumida:** a IA automatizou o Chrome sobre o build de produção. Mediu a rolagem horizontal em 6 larguras, rodou o axe-core (WCAG 2.2 AA) em todas as telas e estados, percorreu o fluxo inteiro só com teclado usando a ViaCEP real e simulou a ViaCEP fora do ar. Encontrou e corrigiu: o nome do café encostando no preço em 320 px; a falta de gestão de foco ao trocar de rota (agora o foco vai para o conteúdo); e o aviso de bundle acima de 500 kB, resolvido com carregamento sob demanda das rotas de Checkout e Sucesso.
- **Análise crítica:** o defeito de 320 px só apareceu com um carrinho de valores altos; testes com dados "bonitos" não o revelariam. Antes de otimizar, a IA mediu o que pesava no bundle e confirmou que os ícones não eram a causa.
- **Decisão tomada:** correções aceitas; o axe-core e os scripts do navegador ficam fora do projeto (não são dependências), e os resultados estão no registro de execução.
- **Evidência:** commits `77fee29`, `c13c83b`, `9771502` e `4971f02`.

### IA-11 — Identidade visual criada com IA aprovada como definitiva
- **Data:** 18/11/2026 · **Tarefa:** TASK-032
- **Prompt:** "a task 32 não é mais necessária, as imagens que estão já estão muito bom! e a task 30 já vou fazer no Vercel".
- **Objetivo:** encerrar a identidade visual com os SVGs criados pela IA, cumprindo o RF-16 (logo original desenvolvida com auxílio de IA).
- **Resposta resumida:** a IA observou que os SVGs eram provisórios em três pontos e fez o acabamento: removeu os comentários de provisório, converteu o texto da logo em curvas com a fonte Baloo 2 (antes, dentro de um `<img>`, o texto aparecia numa fonte substituta) e clareou os traços da ilustração que sumiam no dark mode. Também escreveu a seção Branding com IA do Brand Guide, com ferramenta, pedido, briefing, resultado, curadoria, motivos e direitos de uso, incluindo a licença SIL OFL da Baloo 2.
- **Análise crítica:** a logo foi criada por um assistente de IA gerando código SVG, e não por um gerador de imagens; isso está registrado com transparência. Antes, eu considerava substituí-la; depois de ver o app completo, a aprovei. Mantive o hero do Figma ciente de que ele exibe a logo original do desafio.
- **Decisão tomada:** identidade definitiva; TASK-032 concluída com escopo revisado; publicação na Vercel feita pelo aluno (TASK-030).
- **Evidência:** `docs/BRAND_GUIDE.md` §7; commit `feat: finalize ai created brand identity`.

## Próximos registros previstos
- Publicação na Vercel e smoke test no domínio publicado (TASK-030).
