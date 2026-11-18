import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import {
  calculateDeliveryFee,
  calculateLineTotal,
  calculateSubtotal,
  calculateTotal,
  countUnits,
  findInvalidItems,
} from '../../domain/pricing'
import type { Coffee } from '../../domain/types'
import { COFFEES, findCoffee } from '../catalog/data/coffees'
import { CartContext, type CartContextValue, type DetailedCartItem } from './cartContext'
import { cartReducer } from './cartReducer'
import { loadCart, saveCart } from './cartStorage'

interface CartProviderProps {
  children: ReactNode
}

/**
 * Estado global do carrinho (Context API + useReducer, RF-03 a RF-06).
 * O reducer decide COMO o estado muda; o Provider expõe ações e valores derivados
 * e sincroniza com o localStorage.
 */
export function CartProvider({ children }: CartProviderProps) {
  // Terceiro argumento: inicialização preguiçosa e síncrona a partir do storage.
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart)

  useEffect(() => {
    saveCart(state)
  }, [state])

  const addItem = useCallback(
    (coffeeId: Coffee['id'], quantity: number) => dispatch({ type: 'ADD_ITEM', payload: { coffeeId, quantity } }),
    [],
  )
  const incrementItem = useCallback(
    (coffeeId: Coffee['id']) => dispatch({ type: 'INCREMENT_ITEM', payload: { coffeeId } }),
    [],
  )
  const decrementItem = useCallback(
    (coffeeId: Coffee['id']) => dispatch({ type: 'DECREMENT_ITEM', payload: { coffeeId } }),
    [],
  )
  const removeItem = useCallback(
    (coffeeId: Coffee['id']) => dispatch({ type: 'REMOVE_ITEM', payload: { coffeeId } }),
    [],
  )
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])

  const value = useMemo<CartContextValue>(() => {
    const { items } = state
    const detailedItems = items.flatMap<DetailedCartItem>((item) => {
      const coffee = findCoffee(item.coffeeId)
      return coffee
        ? [{ coffee, quantity: item.quantity, lineTotalCents: calculateLineTotal(coffee.priceCents, item.quantity) }]
        : []
    })
    const subtotalCents = calculateSubtotal(items, COFFEES)
    const deliveryFeeCents = calculateDeliveryFee(items)

    return {
      items,
      detailedItems,
      invalidItemIds: findInvalidItems(items, COFFEES),
      totalUnits: countUnits(items),
      subtotalCents,
      deliveryFeeCents,
      totalCents: calculateTotal(subtotalCents, deliveryFeeCents),
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
    }
  }, [state, addItem, incrementItem, decrementItem, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
