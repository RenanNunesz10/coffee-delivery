# Brand Guide — Coffee Delivery

**Status:** identidade **definitiva**, aprovada pelo aluno em 18/11/2026.
**Última atualização:** 18/11/2026
**Referências:** [`PRD_SPEC.md` §7](./PRD_SPEC.md) · [Análise do Figma](./figma/README.md) · [Registro de uso de IA](./AI_USAGE.md)

## 1. Conceito

A marca une **café** e **entrega**: um copo para viagem, que é o produto pronto para sair, acompanhado de linhas de movimento, que indicam rapidez. O tom é acolhedor (amarelo, cor do café com leite e da luz da manhã) e confiável (roxo, cor de destaque e de ação). O símbolo é simples o bastante para continuar reconhecível em 16 px.

## 2. Paleta

A paleta vem do Style Guide do Figma. Os nomes são os mesmos dos tokens CSS (TECH_SPEC §10.1).

| Papel | Token | Hex |
|---|---|---|
| Ação primária | `yellow` / `yellow-dark` / `yellow-light` | `#DBAC2C` / `#C47F17` / `#F1E9C9` |
| Destaque e marca | `purple` / `purple-dark` / `purple-light` | `#8047F8` / `#4B2995` / `#EBE5F9` |
| Texto | `base-title` / `base-subtitle` / `base-text` / `base-label` | `#272221` / `#403937` / `#574F4D` / `#6E6767` (Figma: `#8D8686`) |
| Superfícies | `base-card` / `base-input` / `base-button` / `base-hover` | `#F3F2F2` / `#EDEDED` / `#E6E5E5` / `#D7D5D5` |
| Fundo | `background` / `white` | `#FAFAFA` / `#FFFFFF` |

Na TASK-006 foram definidos a **paleta do dark mode** (tons de café escuro, mesmos nomes de token) e **ajustes de acessibilidade** no tema claro: texto escuro sobre amarelo, `base-label` mais escuro (`#6E6767`) e os tokens `yellow-ink`/`purple-ink`. Valores completos e regras de combinação: [TECH_SPEC §10.1](./TECH_SPEC.md#101-tokens-stylestokenscss).

## 3. Tipografia

| Uso | Fonte | Pesos |
|---|---|---|
| Títulos e logotipo | **Baloo 2** (Google Fonts, licença SIL OFL 1.1) | 600 ("Delivery"), 700, 800 ("Coffee" e títulos) |
| Textos e botões | **Roboto** (Google Fonts, licença Apache 2.0) | 400, 700 |

No logotipo, o texto está **convertido em curvas**: a logo é exibida igual em qualquer navegador, sem depender da fonte carregada. A escala completa está na [análise do Figma](./figma/README.md#3-tipografia).

## 4. Assets

| Arquivo | Uso | Variação | Origem |
|---|---|---|---|
| `src/assets/brand/logo-light.svg` | Header no tema claro | Símbolo + "Coffee Delivery" em `purple-dark` | Criado com IA (Claude) |
| `src/assets/brand/logo-dark.svg` | Header no tema escuro | Texto `purple-light`, tampa do copo clareada | Criado com IA (Claude) |
| `src/assets/brand/symbol.svg` | Símbolo isolado | Fundo transparente | Criado com IA (Claude) |
| `public/favicon.svg` | Favicon | Símbolo sobre `yellow-light` com cantos arredondados, legível em abas claras e escuras | Criado com IA (Claude) |
| `src/assets/illustrations/delivery-success.svg` | Tela de sucesso | Entregador em scooter `purple`, legível nos dois temas | Criado com IA (Claude) |
| `src/assets/hero/hero-coffee.webp` | Hero da Home | Imagem original do Figma (copo com a logo do desafio), 952 px para telas 2× | Figma (decisão do aluno) |
| `src/assets/hero/hero-background.webp` | Fundo desfocado do hero | Extraído do Figma | Figma |
| `src/assets/coffees/*.webp` | Fotos do catálogo | 14 imagens, 256 px | Figma |

## 5. Regras de uso

- Altura mínima da logo: 32 px. Abaixo disso, usar apenas o símbolo.
- Área de respiro: no mínimo metade da altura do símbolo em volta da logo.
- Não distorcer, rotacionar, recolorir fora da paleta ou aplicar sombras.
- Fundo claro: `logo-light.svg`. Fundo escuro: `logo-dark.svg`. O Header troca a versão automaticamente conforme o tema.

## 6. Verificações realizadas

| Verificação | Resultado |
|---|---|
| Favicon renderizado em 16, 32 e 96 px | Silhueta do copo reconhecível em todos os tamanhos. |
| Logo sobre `#FAFAFA` (claro) e `#161413` (escuro) | Legível nas duas variações; texto em Baloo 2 real após a conversão em curvas. |
| Ilustração de sucesso nos dois temas | Pneus, banco, guidão e capacete visíveis também no fundo escuro. |
| Auditoria axe-core (TASK-028) | Sem violações; as imagens decorativas usam `alt=""`. |

## 7. Branding com IA

| Item | Registro |
|---|---|
| **Ferramenta** | Claude Code (modelo Claude Opus 5.5), assistente de IA usado no desenvolvimento. A IA gerou os assets diretamente como código SVG. |
| **Pedido do aluno** | "as imagens eu faço depois, coloque o SVG por enquanto para ficar mais fácil de visualizar como está o projeto" (17/11/2026). Depois, "as imagens que estão já estão muito bom!" (18/11/2026), aprovando os SVGs como definitivos. |
| **Briefing usado pela IA** | Criar logo, símbolo/favicon e ilustração da tela de sucesso **originais**, sem copiar a marca do desafio, usando a paleta amarelo/roxo e a tipografia Baloo 2 do Style Guide do Figma. A marca deve comunicar café + entrega e funcionar em 16 px e nos temas claro e escuro. |
| **Resultado** | Símbolo de copo para viagem (corpo `purple`, faixa `yellow`, tampa `purple-dark`) com três linhas de movimento em `yellow`; logotipo "Coffee" (Baloo 2 ExtraBold) / "Delivery" (Baloo 2 SemiBold); favicon com fundo `yellow-light`; ilustração vetorial de entregador em scooter. |
| **Curadoria e ajustes** | Os SVGs foram renderizados em PNG e revisados a cada etapa. Ajustes: linha de movimento cortada na borda da logo (TASK-005); versão escura da logo com tampa clareada; texto convertido em curvas com a Baloo 2 para não depender de fonte; traços escuros da ilustração clareados para o dark mode (18/11/2026). |
| **Motivos da escolha** | Vetor nítido em qualquer densidade de tela e arquivos leves (de 0,4 KB no favicon a 10 KB na logo com o texto em curvas); coerência total com os tokens do Figma; variação clara/escura simples de manter; símbolo legível em tamanho de favicon; aprovação do aluno após ver a aplicação completa. |
| **Direitos de uso** | Os SVGs foram escritos pela IA especificamente para este projeto, sem imagens de terceiros nem trechos de outras marcas. A Baloo 2, usada nas curvas do logotipo, tem licença SIL Open Font License 1.1, que permite uso em logotipos. O hero e as fotos dos cafés vêm do Figma fornecido na disciplina, para uso educacional. |
