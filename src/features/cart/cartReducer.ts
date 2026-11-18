import { MIN_ITEM_QUANTITY } from '../../domain/constants'
import { isKnownCoffee } from '../catalog/data/coffees'
import { EMPTY_CART, type CartAction, type CartState } from './cartTypes'

function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= MIN_ITEM_QUANTITY
}

/**
 * Reducer puro e imutável do carrinho (RF-03, RF-05, RN-01, RN-02).
 * Nunca altera `state`: sempre devolve um novo objeto/array.
 * Ações inválidas devolvem o MESMO estado (mesma referência), o que evita re-render.
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { coffeeId, quantity } = action.payload
      if (!isValidQuantity(quantity) || !isKnownCoffee(coffeeId)) return state

      const existing = state.items.find((item) => item.coffeeId === coffeeId)
      if (!existing) {
        return { items: [...state.items, { coffeeId, quantity }] }
      }
      // RN-02: o mesmo café acumula na linha existente, sem duplicar.
      return {
        items: state.items.map((item) =>
          item.coffeeId === coffeeId ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      }
    }

    case 'INCREMENT_ITEM': {
      const { coffeeId } = action.payload
      if (!state.items.some((item) => item.coffeeId === coffeeId)) return state

      return {
        items: state.items.map((item) =>
          item.coffeeId === coffeeId ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      }
    }

    case 'DECREMENT_ITEM': {
      const { coffeeId } = action.payload
      if (!state.items.some((item) => item.coffeeId === coffeeId)) return state

      // RN-01: decrementar de 1 para 0 remove o item.
      return {
        items: state.items
          .map((item) => (item.coffeeId === coffeeId ? { ...item, quantity: item.quantity - 1 } : item))
          .filter((item) => item.quantity >= MIN_ITEM_QUANTITY),
      }
    }

    case 'REMOVE_ITEM': {
      const { coffeeId } = action.payload
      if (!state.items.some((item) => item.coffeeId === coffeeId)) return state

      return { items: state.items.filter((item) => item.coffeeId !== coffeeId) }
    }

    case 'CLEAR_CART':
      return state.items.length === 0 ? state : EMPTY_CART
  }
}
