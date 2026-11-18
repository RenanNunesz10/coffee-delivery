import type { Coffee } from '../../../domain/types'
import arabe from '../../../assets/coffees/arabe.webp'
import cafeComLeite from '../../../assets/coffees/cafe-com-leite.webp'
import capuccino from '../../../assets/coffees/capuccino.webp'
import chocolateQuente from '../../../assets/coffees/chocolate-quente.webp'
import cubano from '../../../assets/coffees/cubano.webp'
import expressoAmericano from '../../../assets/coffees/expresso-americano.webp'
import expressoCremoso from '../../../assets/coffees/expresso-cremoso.webp'
import expressoGelado from '../../../assets/coffees/expresso-gelado.webp'
import expressoTradicional from '../../../assets/coffees/expresso-tradicional.webp'
import havaiano from '../../../assets/coffees/havaiano.webp'
import irlandes from '../../../assets/coffees/irlandes.webp'
import latte from '../../../assets/coffees/latte.webp'
import macchiato from '../../../assets/coffees/macchiato.webp'
import mocaccino from '../../../assets/coffees/mocaccino.webp'

/** Preço único de todos os cafés no Figma: R$ 9,90. */
const DEFAULT_PRICE_CENTS = 990

/**
 * Catálogo local tipado (RF-01, RN-08), na ordem e com os textos do Figma.
 * Imagens extraídas do PDF do Figma (docs/figma/README.md §6.1).
 */
export const COFFEES: readonly Coffee[] = [
  {
    id: 'expresso-tradicional',
    name: 'Expresso Tradicional',
    description: 'O tradicional café feito com água quente e grãos moídos',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['traditional'],
    image: expressoTradicional,
  },
  {
    id: 'expresso-americano',
    name: 'Expresso Americano',
    description: 'Expresso diluído, menos intenso que o tradicional',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['traditional'],
    image: expressoAmericano,
  },
  {
    id: 'expresso-cremoso',
    name: 'Expresso Cremoso',
    description: 'Café expresso tradicional com espuma cremosa',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['traditional'],
    image: expressoCremoso,
  },
  {
    id: 'expresso-gelado',
    name: 'Expresso Gelado',
    description: 'Bebida preparada com café expresso e cubos de gelo',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['traditional', 'iced'],
    image: expressoGelado,
  },
  {
    id: 'cafe-com-leite',
    name: 'Café com Leite',
    description: 'Meio a meio de expresso tradicional com leite vaporizado',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['traditional', 'with-milk'],
    image: cafeComLeite,
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Uma dose de café expresso com o dobro de leite e espuma cremosa',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['traditional', 'with-milk'],
    image: latte,
  },
  {
    id: 'capuccino',
    name: 'Capuccino',
    description: 'Bebida com canela feita de doses iguais de café, leite e espuma',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['traditional', 'with-milk'],
    image: capuccino,
  },
  {
    id: 'macchiato',
    name: 'Macchiato',
    description: 'Café expresso misturado com um pouco de leite quente e espuma',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['traditional', 'with-milk'],
    image: macchiato,
  },
  {
    id: 'mocaccino',
    name: 'Mocaccino',
    description: 'Café expresso com calda de chocolate, pouco leite e espuma',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['traditional', 'with-milk'],
    image: mocaccino,
  },
  {
    id: 'chocolate-quente',
    name: 'Chocolate Quente',
    description: 'Bebida feita com chocolate dissolvido no leite quente e café',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['special', 'with-milk'],
    image: chocolateQuente,
  },
  {
    id: 'cubano',
    name: 'Cubano',
    description: 'Drink gelado de café expresso com rum, creme de leite e hortelã',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['special', 'alcoholic', 'iced'],
    image: cubano,
  },
  {
    id: 'havaiano',
    name: 'Havaiano',
    description: 'Bebida adocicada preparada com café e leite de coco',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['special'],
    image: havaiano,
  },
  {
    id: 'arabe',
    name: 'Árabe',
    description: 'Bebida preparada com grãos de café árabe e especiarias',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['special'],
    image: arabe,
  },
  {
    id: 'irlandes',
    name: 'Irlandês',
    description: 'Bebida a base de café, uísque irlandês, açúcar e chantilly',
    priceCents: DEFAULT_PRICE_CENTS,
    tags: ['special', 'alcoholic'],
    image: irlandes,
  },
]

const COFFEES_BY_ID = new Map(COFFEES.map((coffee) => [coffee.id, coffee]))

export function findCoffee(coffeeId: string): Coffee | undefined {
  return COFFEES_BY_ID.get(coffeeId)
}

export function isKnownCoffee(coffeeId: string): boolean {
  return COFFEES_BY_ID.has(coffeeId)
}
