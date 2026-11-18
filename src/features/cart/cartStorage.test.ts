import { describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '../../domain/constants'
import { loadCart, saveCart } from './cartStorage'
import { EMPTY_CART } from './cartTypes'

const store = (value: unknown) =>
  localStorage.setItem(STORAGE_KEYS.cart, typeof value === 'string' ? value : JSON.stringify(value))

describe('cartStorage', () => {
  it('começa vazio sem dados salvos', () => {
    expect(loadCart()).toEqual(EMPTY_CART)
  })

  it('salva e recupera itens e quantidades (RF-06)', () => {
    saveCart({ items: [{ coffeeId: 'latte', quantity: 2 }, { coffeeId: 'cubano', quantity: 1 }] })

    expect(loadCart()).toEqual({ items: [{ coffeeId: 'latte', quantity: 2 }, { coffeeId: 'cubano', quantity: 1 }] })
  })

  it('descarta JSON corrompido sem quebrar e remove a chave', () => {
    store('{"items": [')

    expect(loadCart()).toEqual(EMPTY_CART)
    expect(localStorage.getItem(STORAGE_KEYS.cart)).toBeNull()
  })

  it('descarta formato incompatível', () => {
    store({ produtos: ['latte'] })

    expect(loadCart()).toEqual(EMPTY_CART)
  })

  it('aproveita só os itens válidos e existentes no catálogo', () => {
    store({
      items: [
        { coffeeId: 'latte', quantity: 2 },
        { coffeeId: 'latte', quantity: 0 },
        { coffeeId: 'cubano', quantity: 1.5 },
        { coffeeId: 'cafe-removido', quantity: 3 },
        'lixo',
        { coffeeId: 'arabe', quantity: 1 },
      ],
    })

    expect(loadCart()).toEqual({ items: [{ coffeeId: 'latte', quantity: 2 }, { coffeeId: 'arabe', quantity: 1 }] })
  })

  it('junta linhas repetidas do mesmo café (RN-02)', () => {
    store({ items: [{ coffeeId: 'latte', quantity: 2 }, { coffeeId: 'latte', quantity: 3 }] })

    expect(loadCart()).toEqual({ items: [{ coffeeId: 'latte', quantity: 5 }] })
  })

  it('não quebra com localStorage indisponível', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })

    expect(loadCart()).toEqual(EMPTY_CART)
    expect(() => saveCart({ items: [{ coffeeId: 'latte', quantity: 1 }] })).not.toThrow()
  })
})
