import { describe, expect, it } from 'vitest'
import {
  BRAZILIAN_STATES,
  COFFEE_TAG_LABELS,
  COFFEE_TAGS,
  DELIVERY_FEE_CENTS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  STORAGE_KEYS,
} from './constants'

describe('constantes de domínio', () => {
  it('define o frete do Figma em centavos inteiros (R$ 3,50)', () => {
    expect(DELIVERY_FEE_CENTS).toBe(350)
    expect(Number.isInteger(DELIVERY_FEE_CENTS)).toBe(true)
  })

  it('lista as 27 UFs, sem repetição, com duas letras maiúsculas', () => {
    expect(BRAZILIAN_STATES).toHaveLength(27)
    expect(new Set(BRAZILIAN_STATES).size).toBe(27)
    BRAZILIAN_STATES.forEach((state) => expect(state).toMatch(/^[A-Z]{2}$/))
  })

  it('tem rótulo em português para cada tag e forma de pagamento', () => {
    expect(Object.keys(COFFEE_TAG_LABELS).sort()).toEqual([...COFFEE_TAGS].sort())
    expect(Object.keys(PAYMENT_METHOD_LABELS).sort()).toEqual([...PAYMENT_METHODS].sort())
  })

  it('oferece apenas as três formas de pagamento informativas (RN-05)', () => {
    expect(PAYMENT_METHODS).toEqual(['credit', 'debit', 'cash'])
  })

  it('usa chaves de storage versionadas e únicas', () => {
    const keys = Object.values(STORAGE_KEYS)

    expect(new Set(keys).size).toBe(keys.length)
    keys.forEach((key) => expect(key).toMatch(/^coffee-delivery:[a-z-]+:v\d+$/))
  })
})
