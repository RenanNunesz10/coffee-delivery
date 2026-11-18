import { describe, expect, it } from 'vitest'
import { formatCurrency, formatCurrencyParts } from './formatCurrency'

/** Intl usa espaço não separável entre "R$" e o valor. */
const normalizeSpaces = (value: string) => value.replace(/\s/g, ' ')

describe('formatCurrency', () => {
  it.each([
    [990, 'R$ 9,90'],
    [350, 'R$ 3,50'],
    [0, 'R$ 0,00'],
    [3320, 'R$ 33,20'],
    [123456, 'R$ 1.234,56'],
  ])('formata %i centavos como %s', (cents, expected) => {
    expect(normalizeSpaces(formatCurrency(cents))).toBe(expected)
  })

  it('separa símbolo e valor para o card do catálogo', () => {
    expect(formatCurrencyParts(990)).toEqual({ symbol: 'R$', amount: '9,90' })
    expect(formatCurrencyParts(123456)).toEqual({ symbol: 'R$', amount: '1.234,56' })
  })
})
