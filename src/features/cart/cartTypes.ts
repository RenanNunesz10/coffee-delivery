import type { CartItem, Coffee } from '../../domain/types'

export interface CartState {
  items: CartItem[]
}

type CoffeeId = Coffee['id']

/** Ações do carrinho (TECH_SPEC §5.1). */
export type CartAction =
  | { type: 'ADD_ITEM'; payload: { coffeeId: CoffeeId; quantity: number } }
  | { type: 'INCREMENT_ITEM'; payload: { coffeeId: CoffeeId } }
  | { type: 'DECREMENT_ITEM'; payload: { coffeeId: CoffeeId } }
  | { type: 'REMOVE_ITEM'; payload: { coffeeId: CoffeeId } }
  | { type: 'CLEAR_CART' }

export const EMPTY_CART: CartState = { items: [] }
