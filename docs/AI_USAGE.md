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

## Próximos registros previstos
- Explicação de Context API + `useReducer` aplicada ao carrinho (TASK-015/016).
- Integração ViaCEP e tratamento de erros (TASK-020/021).
- Geração da logo e das ilustrações com IA (TASK-032), com ferramenta, prompt e curadoria.
- Depuração de defeitos encontrados nos testes integrados (TASK-029).
