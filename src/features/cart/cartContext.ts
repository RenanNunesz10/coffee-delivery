import { createContext } from 'react'
import type { CartItem, Coffee } from '../../domain/types'

/** Linha do carrinho com os dados do café resolvidos pelo catálogo. */
export interface DetailedCartItem {
  coffee: Coffee
  quantity: number
  lineTotalCents: number
}

export interface CartContextValue {
  items: readonly CartItem[]
  detailedItems: readonly DetailedCartItem[]
  /** Itens cujo café não existe no catálogo; bloqueiam a confirmação (RN-10). */
  invalidItemIds: readonly string[]
  totalUnits: number
  subtotalCents: number
  deliveryFeeCents: number
  totalCents: number
  addItem: (coffeeId: Coffee['id'], quantity: number) => void
  incrementItem: (coffeeId: Coffee['id']) => void
  decrementItem: (coffeeId: Coffee['id']) => void
  removeItem: (coffeeId: Coffee['id']) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
