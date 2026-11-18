# Análise do Figma — Coffee Delivery

**Fonte:** [arquivo Figma](https://www.figma.com/design/DBM8Ky5Qy7ZUOP2pUR5SrJ/Coffee-Delivery-%E2%80%A2-Projeto-Final-React--c%C3%B3pia-?node-id=0-1) · export em PDF (`coffee-delivery-figma.pdf`) · Style Guide (`style-guide.png`)
**Data da análise:** 17/11/2026

Este documento traduz o Figma em decisões de implementação. Os tokens daqui alimentam a TASK-006 e os componentes das TASK-012 a TASK-026.

## 1. Telas

O Figma contém 4 telas, todas **desktop (1440 px)**. **Não há frames mobile nem dark mode**: essas variações são decisões nossas (ver seção 7).

| Tela | Conteúdo |
|---|---|
| Home | Header, hero com 4 benefícios e imagem, título "Nossos cafés", grade 4 colunas com 14 cards. |
| Checkout vazio | "Complete seu pedido" (endereço + pagamento) à esquerda; "Cafés selecionados" à direita. |
| Checkout preenchido | Mesmo layout, com CEP `90250-440`, endereço preenchido e "Cartão de crédito" selecionado. |
| Sucesso | "Uhu! Pedido confirmado", card com endereço, previsão e pagamento; ilustração de entregador em scooter. |

## 2. Cores (Style Guide)

| Grupo | Nome no Figma | Hex | Uso observado |
|---|---|---|---|
| Produto | yellow-dark | `#C47F17` | Hover do botão primário, ícone e badge do carrinho, título do sucesso, borda do input ativo. |
| Produto | yellow | `#DBAC2C` | Botão primário ("Confirmar pedido"), ícones de benefícios. |
| Produto | yellow-light | `#F1E9C9` | Fundo do botão do carrinho, fundo das tags. |
| Produto | purple-dark | `#4B2995` | Botão de adicionar ao carrinho, texto do chip de localização. |
| Produto | purple | `#8047F8` | Hover do botão de carrinho, ícones `+`/`−`, ícones de pagamento, borda do pagamento selecionado. |
| Produto | purple-light | `#EBE5F9` | Fundo do chip de localização e do pagamento selecionado. |
| Base | base-title | `#272221` | Títulos. |
| Base | base-subtitle | `#403937` | Subtítulos e títulos de seção. |
| Base | base-text | `#574F4D` | Texto corrido. |
| Base | base-label | `#8D8686` | Placeholders e "Opcional". |
| Base | base-hover | `#D7D5D5` | Hover de botões secundários e do seletor de pagamento. |
| Base | base-button | `#E6E5E5` | Botões secundários, "Remover", seletor de pagamento. |
| Base | base-input | `#EDEDED` | Fundo dos inputs. |
| Base | base-card | `#F3F2F2` | Cards de café, formulário e carrinho. |
| Base | background | `#FAFAFA` | Fundo da página. |
| Base | white | `#FFFFFF` | Texto sobre botões e badges. |

## 3. Tipografia

| Token | Família | Tamanho | Line-height | Peso |
|---|---|---|---|---|
| Title XL | Baloo 2 | 48 px | 130% | ExtraBold (800) |
| Title L | Baloo 2 | 32 px | 130% | ExtraBold |
| Title M | Baloo 2 | 24 px | 130% | ExtraBold |
| Title S | Baloo 2 | 20 px | 130% | Bold (700) |
| Title XS | Baloo 2 | 18 px | 130% | Bold |
| Text L | Roboto | 20 px | 130% | Regular / Bold |
| Text M | Roboto | 16 px | 130% | Regular / Bold |
| Text S | Roboto | 14 px | 130% | Regular |
| Text XS | Roboto | 12 px | 130% | Bold |
| Tag | Roboto | 10 px | 130% | Bold, MAIÚSCULAS |
| Button G | Roboto | 14 px | 160% | Bold, MAIÚSCULAS |
| Button M | Roboto | 12 px | 160% | Regular, MAIÚSCULAS |

Ambas as fontes são do Google Fonts.

## 4. Ícones

O Style Guide indica **Phosphor Icons**: map-pin (preenchido e contorno), trash, currency-dollar, shopping-cart (preenchido), timer, package, coffee, plus, minus, credit-card, money e bank.

## 5. Componentes e estados

| Componente | Estados no Figma | Observações |
|---|---|---|
| Button Primary | default `yellow`, hover `yellow-dark` | Texto branco, Button G, maiúsculas ("CONFIRMAR PEDIDO"). |
| Button Secondary | default `base-button`, hover `base-hover` | Ícone trash em `purple` + "REMOVER" (Button M). |
| Icon button (carrinho no card) | default `purple-dark`, hover `purple` | Ícone de carrinho branco, quadrado ~38 px, raio 6 px. |
| Cart (Header) | empty / full | Fundo `yellow-light`, ícone `yellow-dark`; badge circular `yellow-dark` com número branco no canto superior direito. |
| Select (pagamento) | default / hover / selected | Default `base-button`; hover `base-hover`; selected com fundo `purple-light` e borda 1 px `purple`. Ícone `purple`, texto Button M. |
| Input Text | default empty / active empty / active filled / default filled | Fundo `base-input`, borda `base-button`; ativo com borda `yellow-dark`; "Opcional" em itálico `base-label` alinhado à direita. |
| Input Number | default / hover plus / hover minus | Fundo `base-button`; `+`/`−` em `purple`, hover em `purple-dark`; número centralizado. |
| Card Catálogo | — | Fundo `base-card`, raio `6px 36px` (cantos superior direito e inferior esquerdo maiores); imagem 120 px sobressaindo do topo; tags; nome (Title S); descrição (Text S, `base-label`); preço "R$" Text S + valor Title M. |
| Card Carrinho | — | Imagem 64 px, nome, Input Number + Remover, preço à direita; divisor `base-button` entre itens. |

### Formas
- Raio padrão: 6 px (botões, inputs, cards de formulário).
- Raio assimétrico `6px 44px` no container do carrinho e `6px 36px` no card de café e no card de sucesso.
- Card de sucesso com **borda em gradiente** amarelo → roxo.

## 6. Conteúdo

### 6.1 Catálogo (14 cafés, todos R$ 9,90)

| ID (slug) | Nome | Tags | Descrição | Imagem |
|---|---|---|---|---|
| `expresso-tradicional` | Expresso Tradicional | tradicional | O tradicional café feito com água quente e grãos moídos | `src/assets/coffees/expresso-tradicional.webp` |
| `expresso-americano` | Expresso Americano | tradicional | Expresso diluído, menos intenso que o tradicional | `expresso-americano.webp` |
| `expresso-cremoso` | Expresso Cremoso | tradicional | Café expresso tradicional com espuma cremosa | `expresso-cremoso.webp` |
| `expresso-gelado` | Expresso Gelado | tradicional, gelado | Bebida preparada com café expresso e cubos de gelo | `expresso-gelado.webp` |
| `cafe-com-leite` | Café com Leite | tradicional, com leite | Meio a meio de expresso tradicional com leite vaporizado | `cafe-com-leite.webp` |
| `latte` | Latte | tradicional, com leite | Uma dose de café expresso com o dobro de leite e espuma cremosa | `latte.webp` |
| `capuccino` | Capuccino | tradicional, com leite | Bebida com canela feita de doses iguais de café, leite e espuma | `capuccino.webp` |
| `macchiato` | Macchiato | tradicional, com leite | Café expresso misturado com um pouco de leite quente e espuma | `macchiato.webp` |
| `mocaccino` | Mocaccino | tradicional, com leite | Café expresso com calda de chocolate, pouco leite e espuma | `mocaccino.webp` |
| `chocolate-quente` | Chocolate Quente | especial, com leite | Bebida feita com chocolate dissolvido no leite quente e café | `chocolate-quente.webp` |
| `cubano` | Cubano | especial, alcoólico, gelado | Drink gelado de café expresso com rum, creme de leite e hortelã | `cubano.webp` |
| `havaiano` | Havaiano | especial | Bebida adocicada preparada com café e leite de coco | `havaiano.webp` |
| `arabe` | Árabe | especial | Bebida preparada com grãos de café árabe e especiarias | `arabe.webp` |
| `irlandes` | Irlandês | especial, alcoólico | Bebida a base de café, uísque irlandês, açúcar e chantilly | `irlandes.webp` |

As imagens foram extraídas do PDF exportado do Figma, associadas aos cafés pela posição na grade da Home e otimizadas para WebP 256 × 256 com transparência (~12 KB cada).

### 6.2 Textos fixos
- Hero: "Encontre o café perfeito para qualquer hora do dia" / "Com o Coffee Delivery você recebe seu café onde estiver, a qualquer hora".
- Benefícios: "Compra simples e segura" (carrinho, `yellow-dark`), "Embalagem mantém o café intacto" (pacote, `base-text`), "Entrega rápida e rastreada" (timer, `yellow`), "O café chega fresquinho até você" (café, `purple`).
- Checkout: "Complete seu pedido", "Cafés selecionados", "Endereço de Entrega" / "Informe o endereço onde deseja receber seu pedido", "Pagamento" / "O pagamento é feito na entrega. Escolha a forma que deseja pagar", "Total de itens", "Entrega", "Total", "Confirmar pedido".
- Sucesso: "Uhu! Pedido confirmado" / "Agora é só aguardar que logo o café chegará até você", "Entrega em {rua}, {número} / {bairro} - {cidade}, {UF}", "Previsão de entrega / 20 min - 30 min", "Pagamento na entrega / {forma}".

### 6.3 Outros assets
| Asset | Situação |
|---|---|
| `src/assets/hero/hero-illustration.svg` | SVG provisório (TASK-005) no lugar da foto do hero, que exibia a logo original do desafio. Versão final com IA na TASK-032. |
| `src/assets/hero/hero-background.webp` | Fundo desfocado do hero, extraído (1440 px). Pode ser substituído por gradiente CSS. |
| Ilustração do entregador (sucesso) | Vetorial, não extraída. SVG provisório (TASK-005); versão com IA (TASK-032). |
| Logo original | Vetorial; não será usada (a marca própria será criada com IA, RF-16). |

## 7. Lacunas e divergências em relação aos SPECs

| # | Ponto | Figma | SPEC atual | Encaminhamento |
|---|---|---|---|---|
| D1 | Taxa de entrega | R$ 3,50 | R$ 5,00 (RN-03) | **Resolvido:** segue o Figma, R$ 3,50 (PRD 1.2.0). |
| D2 | Biblioteca de ícones | Phosphor Icons | Lucide React | **Resolvido:** `@phosphor-icons/react` (TECH 1.2.0). |
| D3 | Preço na linha do carrinho | Latte com quantidade 1 mostra R$ 19,80 (mock inconsistente) | — | A linha exibe `preço unitário × quantidade`. |
| D4 | Mobile e tablet | Inexistente | Obrigatório (RF-15) | Layout próprio: grade de 1/2/3/4 colunas; checkout em coluna única abaixo de `lg`. |
| D5 | Dark mode | Inexistente | Obrigatório (RF-14) | Paleta escura derivada dos tokens base, a definir na TASK-006. |
| D6 | Localização no Header | "Porto Alegre, RS" fixo | Cidade/UF do último pedido | Mantida a decisão do PRD. |
| D7 | Logo no copo do hero | Logo original do desafio | Marca própria (RF-16) | **Resolvido:** SVG provisório na TASK-005; versão com IA na TASK-032. |
| D8 | Ilustração do sucesso | Vetorial | — | **Resolvido:** SVG provisório na TASK-005; versão com IA na TASK-032. |
| D9 | Orientação de 2 fotos | Café com Leite e Havaiano aparecem espelhados na Home | — | Detalhe visual sem impacto; usar as imagens como exportadas. |
