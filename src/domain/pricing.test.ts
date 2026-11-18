import { describe, expect, it } from 'vitest'
import { DELIVERY_FEE_CENTS } from './constants'
import {
  calculateDeliveryFee,
  calculateLineTotal,
  calculateSubtotal,
  calculateTotal,
  countUnits,
  findInvalidItems,
} from './pricing'
import type { Coffee } from './types'

const coffees: Coffee[] = [
  { id: 'expresso', name: 'Expresso', description: 'x', priceCents: 990, tags: ['traditional'], image: 'a.webp' },
  { id: 'latte', name: 'Latte', description: 'x', priceCents: 1050, tags: ['with-milk'], image: 'b.webp' },
]

describe('pricing', () => {
  it('calcula a linha como preço unitário × quantidade', () => {
    expect(calculateLineTotal(990, 3)).toBe(2970)
  })

  it('soma o subtotal de vários itens em centavos', () => {
    const items = [
      { coffeeId: 'expresso', quantity: 2 },
      { coffeeId: 'latte', quantity: 1 },
    ]

    expect(calculateSubtotal(items, coffees)).toBe(990 * 2 + 1050)
  })

  it('não acumula erro de ponto flutuante (0,10 × 3 = 0,30)', () => {
    const cheap: Coffee[] = [{ ...coffees[0], id: 'dez-centavos', priceCents: 10 }]

    expect(calculateSubtotal([{ coffeeId: 'dez-centavos', quantity: 3 }], cheap)).toBe(30)
  })

  it('cobra o frete fixo somente com itens no carrinho', () => {
    expect(calculateDeliveryFee([])).toBe(0)
    expect(calculateDeliveryFee([{ coffeeId: 'expresso', quantity: 1 }])).toBe(DELIVERY_FEE_CENTS)
    expect(calculateDeliveryFee([{ coffeeId: 'expresso', quantity: 9 }])).toBe(350)
  })

  it('zera subtotal, frete e total no carrinho vazio', () => {
    const subtotal = calculateSubtotal([], coffees)
    const fee = calculateDeliveryFee([])

    expect([subtotal, fee, calculateTotal(subtotal, fee)]).toEqual([0, 0, 0])
  })

  it('reproduz o exemplo do Figma: 3 cafés de R$ 9,90 + entrega = R$ 33,20', () => {
    const items = [
      { coffeeId: 'expresso', quantity: 1 },
      { coffeeId: 'expresso-2', quantity: 2 },
    ]
    const catalog: Coffee[] = [coffees[0], { ...coffees[0], id: 'expresso-2' }]
    const subtotal = calculateSubtotal(items, catalog)

    expect(subtotal).toBe(2970)
    expect(calculateTotal(subtotal, calculateDeliveryFee(items))).toBe(3320)
  })

  it('reporta itens inexistentes no catálogo sem somá-los', () => {
    const items = [
      { coffeeId: 'expresso', quantity: 1 },
      { coffeeId: 'removido', quantity: 4 },
    ]

    expect(findInvalidItems(items, coffees)).toEqual(['removido'])
    expect(calculateSubtotal(items, coffees)).toBe(990)
  })

  it('conta unidades, não tipos de café', () => {
    expect(
      countUnits([
        { coffeeId: 'expresso', quantity: 2 },
        { coffeeId: 'latte', quantity: 3 },
      ]),
    ).toBe(5)
    expect(countUnits([])).toBe(0)
  })
})
