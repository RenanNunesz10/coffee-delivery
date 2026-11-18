# Brand Guide — Coffee Delivery

**Status:** rascunho com **assets provisórios** (TASK-005). A identidade final será criada com IA e aplicada na TASK-032, quando este guia será completado com a seção Branding com IA.
**Última atualização:** 17/11/2026
**Referências:** [`PRD_SPEC.md` §7](./PRD_SPEC.md) · [Análise do Figma](./figma/README.md)

## 1. Conceito

A marca une **café** e **entrega**: um copo para viagem, que é o produto pronto para sair, acompanhado de linhas de movimento, que indicam rapidez. O tom é acolhedor (amarelo, cor do café com leite e da luz da manhã) e confiável (roxo, cor de destaque e de ação).

> Conceito provisório, usado para guiar os SVGs da TASK-005. Pode ser revisto na criação com IA.

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
| Títulos e logotipo | **Baloo 2** (Google Fonts) | 700, 800 |
| Textos e botões | **Roboto** (Google Fonts) | 400, 700 |

A escala completa está na [análise do Figma](./figma/README.md#3-tipografia).

## 4. Assets

| Arquivo | Uso | Variação | Status |
|---|---|---|---|
| `src/assets/brand/logo-light.svg` | Header no tema claro | Texto `purple-dark` | Provisório |
| `src/assets/brand/logo-dark.svg` | Header no tema escuro | Texto `purple-light`, tampa clareada | Provisório |
| `src/assets/brand/symbol.svg` | Símbolo isolado | Fundo transparente | Provisório |
| `public/favicon.svg` | Favicon | Símbolo sobre `yellow-light` com cantos arredondados, legível em fundos claros e escuros | Provisório |
| `src/assets/hero/hero-coffee.webp` | Hero da Home | Imagem original do Figma (copo com a logo do desafio), 952 px para telas 2× | Definitivo (decisão do aluno) |
| `src/assets/illustrations/delivery-success.svg` | Tela de sucesso | Entregador em scooter `purple` | Provisório |
| `src/assets/coffees/*.webp` | Fotos do catálogo | 14 imagens extraídas do Figma | Definitivo |
| `src/assets/hero/hero-background.webp` | Fundo desfocado do hero | Extraído do Figma | Definitivo (pode virar gradiente CSS) |

Todos os SVGs provisórios têm o comentário `PROVISÓRIO (TASK-005)` no código-fonte, o que facilita encontrá-los com `grep`.

## 5. Regras de uso

- Altura mínima da logo: 32 px. Abaixo disso, usar apenas o símbolo.
- Área de respiro: no mínimo metade da altura do símbolo em volta da logo.
- Não distorcer, rotacionar, recolorir fora da paleta ou aplicar sombras.
- Fundo claro: `logo-light.svg`. Fundo escuro: `logo-dark.svg`.
- O texto da logo usa Baloo 2 com fontes alternativas. Na versão final, o texto deve ser convertido em curvas para não depender da fonte instalada.

## 6. Verificações realizadas

| Verificação | Resultado |
|---|---|
| Favicon renderizado em 16 px e 96 px | Silhueta do copo reconhecível nos dois tamanhos. |
| Logo sobre `#FAFAFA` e sobre fundo escuro `#1E1B1A` | Legível nas duas variações. |
| Ilustrações renderizadas em PNG para revisão | Sem cortes ou elementos fora da área visível. |

## 7. Branding com IA

*A completar na TASK-032*, com ferramenta utilizada, prompt(s), resultado(s), curadoria e ajustes manuais, motivos da escolha e verificação dos termos de uso.
