import { z } from 'zod'
import { MIN_ITEM_QUANTITY, STORAGE_KEYS } from '../../domain/constants'
import type { CartItem } from '../../domain/types'
import { readJson, writeJson } from '../../lib/storage'
import { isKnownCoffee } from '../catalog/data/coffees'
import { EMPTY_CART, type CartState } from './cartTypes'

/** Envelope salvo: os itens são validados um a um para aproveitar os válidos. */
const storedCartSchema = z.object({ items: z.array(z.unknown()) })

const storedItemSchema = z.object({
  coffeeId: z.string().min(1),
  quantity: z.number().int().min(MIN_ITEM_QUANTITY),
})

/**
 * Hidrata o carrinho salvo (RF-06). Mantém apenas itens válidos e existentes no catálogo
 * e junta linhas repetidas do mesmo café (RN-02). Usado como inicializador do useReducer,
 * de forma síncrona, para que o primeiro efeito de persistência não apague os dados salvos.
 */
export function loadCart(): CartState {
  const stored = readJson(STORAGE_KEYS.cart, storedCartSchema)
  if (!stored) return EMPTY_CART

  const items = stored.items.reduce<CartItem[]>((validItems, candidate) => {
    const parsed = storedItemSchema.safeParse(candidate)
    if (!parsed.success || !isKnownCoffee(parsed.data.coffeeId)) return validItems

    const { coffeeId, quantity } = parsed.data
    const existing = validItems.find((item) => item.coffeeId === coffeeId)
    return existing
      ? validItems.map((item) => (item.coffeeId === coffeeId ? { ...item, quantity: item.quantity + quantity } : item))
      : [...validItems, { coffeeId, quantity }]
  }, [])

  return items.length > 0 ? { items } : EMPTY_CART
}

export function saveCart(state: CartState): void {
  writeJson(STORAGE_KEYS.cart, { items: state.items })
}
