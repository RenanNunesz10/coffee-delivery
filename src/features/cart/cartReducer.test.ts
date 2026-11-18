import { describe, expect, it } from 'vitest'
import { cartReducer } from './cartReducer'
import { EMPTY_CART, type CartState } from './cartTypes'

const withItems = (...items: CartState['items']): CartState => ({ items })

/** Congela o estado (inclusive os itens) para provar que o reducer não o altera. */
function frozen(state: CartState): CartState {
  state.items.forEach((item) => Object.freeze(item))
  Object.freeze(state.items)
  return Object.freeze(state)
}

describe('cartReducer', () => {
  describe('ADD_ITEM', () => {
    it('cria uma linha para um café novo', () => {
      const state = cartReducer(frozen(EMPTY_CART), { type: 'ADD_ITEM', payload: { coffeeId: 'latte', quantity: 2 } })

      expect(state.items).toEqual([{ coffeeId: 'latte', quantity: 2 }])
    })

    it('acumula a quantidade do mesmo café sem duplicar a linha (RN-02)', () => {
      const initial = frozen(withItems({ coffeeId: 'latte', quantity: 2 }, { coffeeId: 'cubano', quantity: 1 }))

      const state = cartReducer(initial, { type: 'ADD_ITEM', payload: { coffeeId: 'latte', quantity: 3 } })

      expect(state.items).toEqual([
        { coffeeId: 'latte', quantity: 5 },
        { coffeeId: 'cubano', quantity: 1 },
      ])
    })

    it.each([0, -1, 1.5, Number.NaN])('ignora quantidade inválida %s (RN-01)', (quantity) => {
      const initial = frozen(withItems({ coffeeId: 'latte', quantity: 1 }))

      expect(cartReducer(initial, { type: 'ADD_ITEM', payload: { coffeeId: 'latte', quantity } })).toBe(initial)
    })

    it('ignora café que não existe no catálogo (RN-10)', () => {
      const initial = frozen(EMPTY_CART)

      expect(cartReducer(initial, { type: 'ADD_ITEM', payload: { coffeeId: 'inexistente', quantity: 1 } })).toBe(initial)
    })
  })

  it('INCREMENT_ITEM soma uma unidade', () => {
    const state = cartReducer(frozen(withItems({ coffeeId: 'latte', quantity: 1 })), {
      type: 'INCREMENT_ITEM',
      payload: { coffeeId: 'latte' },
    })

    expect(state.items).toEqual([{ coffeeId: 'latte', quantity: 2 }])
  })

  describe('DECREMENT_ITEM', () => {
    it('subtrai uma unidade', () => {
      const state = cartReducer(frozen(withItems({ coffeeId: 'latte', quantity: 3 })), {
        type: 'DECREMENT_ITEM',
        payload: { coffeeId: 'latte' },
      })

      expect(state.items).toEqual([{ coffeeId: 'latte', quantity: 2 }])
    })

    it('remove o item ao decrementar de 1 para 0 (RN-01)', () => {
      const initial = frozen(withItems({ coffeeId: 'latte', quantity: 1 }, { coffeeId: 'cubano', quantity: 2 }))

      const state = cartReducer(initial, { type: 'DECREMENT_ITEM', payload: { coffeeId: 'latte' } })

      expect(state.items).toEqual([{ coffeeId: 'cubano', quantity: 2 }])
    })
  })

  it('REMOVE_ITEM remove somente o café informado', () => {
    const initial = frozen(withItems({ coffeeId: 'latte', quantity: 4 }, { coffeeId: 'cubano', quantity: 2 }))

    const state = cartReducer(initial, { type: 'REMOVE_ITEM', payload: { coffeeId: 'latte' } })

    expect(state.items).toEqual([{ coffeeId: 'cubano', quantity: 2 }])
  })

  it('CLEAR_CART esvazia o carrinho', () => {
    const state = cartReducer(frozen(withItems({ coffeeId: 'latte', quantity: 4 })), { type: 'CLEAR_CART' })

    expect(state).toEqual(EMPTY_CART)
  })

  it.each([
    { type: 'INCREMENT_ITEM', payload: { coffeeId: 'cubano' } },
    { type: 'DECREMENT_ITEM', payload: { coffeeId: 'cubano' } },
    { type: 'REMOVE_ITEM', payload: { coffeeId: 'cubano' } },
  ] as const)('$type em item ausente devolve o mesmo estado', (action) => {
    const initial = frozen(withItems({ coffeeId: 'latte', quantity: 1 }))

    expect(cartReducer(initial, action)).toBe(initial)
  })

  it('CLEAR_CART em carrinho vazio devolve o mesmo estado', () => {
    const initial = frozen(EMPTY_CART)

    expect(cartReducer(initial, { type: 'CLEAR_CART' })).toBe(initial)
  })
})
