import { STORAGE_KEYS } from '../../domain/constants'
import type { Order } from '../../domain/types'
import { readJson, writeJson } from '../../lib/storage'
import { orderSchema } from './orderSchema'

/** Persiste o último pedido em chave própria, separada do carrinho (RN-06). */
export function saveLastOrder(order: Order): boolean {
  return writeJson(STORAGE_KEYS.lastOrder, order)
}

/** Último pedido válido salvo, ou `null` (ausente, corrompido ou inconsistente). */
export function readLastOrder(): Order | null {
  return readJson(STORAGE_KEYS.lastOrder, orderSchema)
}
