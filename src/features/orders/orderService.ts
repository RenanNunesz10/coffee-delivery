import { MIN_ITEM_QUANTITY } from '../../domain/constants'
import { calculateDeliveryFee, calculateLineTotal, calculateTotal, findInvalidItems } from '../../domain/pricing'
import type { CartItem, Coffee, DeliveryAddress, Order, OrderItem, PaymentMethod } from '../../domain/types'
import { COFFEES } from '../catalog/data/coffees'
import { parseOrder } from './orderSchema'

interface CreateOrderInput {
  items: readonly CartItem[]
  address: DeliveryAddress
  paymentMethod: PaymentMethod
  /** Injetáveis para testes. */
  coffees?: readonly Coffee[]
  now?: Date
  generateId?: () => string
}

export type CreateOrderResult =
  | { ok: true; order: Order }
  | { ok: false; reason: 'empty-cart' }
  | { ok: false; reason: 'invalid-items'; invalidItemIds: string[] }
  | { ok: false; reason: 'invalid-order' }

/**
 * Cria o snapshot imutável do pedido (RF-12, RN-06) e revalida as regras de confirmação (RN-10).
 * Os dados de cada café são COPIADOS: o pedido não depende do carrinho (que será limpo)
 * nem de mudanças futuras no catálogo.
 */
export function createOrder({
  items,
  address,
  paymentMethod,
  coffees = COFFEES,
  now = new Date(),
  generateId = () => crypto.randomUUID(),
}: CreateOrderInput): CreateOrderResult {
  if (items.length === 0) return { ok: false, reason: 'empty-cart' }

  const invalidItemIds = [
    ...findInvalidItems(items, coffees),
    ...items
      .filter((item) => !Number.isInteger(item.quantity) || item.quantity < MIN_ITEM_QUANTITY)
      .map((item) => item.coffeeId),
  ]
  if (invalidItemIds.length > 0) return { ok: false, reason: 'invalid-items', invalidItemIds }

  // findInvalidItems já garantiu que todos existem; o flatMap evita um cast e mantém o tipo seguro.
  const orderItems = items.flatMap<OrderItem>((item) => {
    const coffee = coffees.find(({ id }) => id === item.coffeeId)
    if (!coffee) return []
    return [
      Object.freeze({
        coffeeId: coffee.id,
        name: coffee.name,
        unitPriceCents: coffee.priceCents,
        quantity: item.quantity,
        image: coffee.image,
      }),
    ]
  })

  const subtotalCents = orderItems.reduce((sum, item) => sum + calculateLineTotal(item.unitPriceCents, item.quantity), 0)
  const deliveryFeeCents = calculateDeliveryFee(items)

  const candidate: Order = {
    id: generateId(),
    createdAt: now.toISOString(),
    items: Object.freeze(orderItems),
    address: Object.freeze({ ...address }),
    paymentMethod,
    subtotalCents,
    deliveryFeeCents,
    totalCents: calculateTotal(subtotalCents, deliveryFeeCents),
  }

  // Mesmo contrato usado na leitura do storage: o que é salvo sempre pode ser lido de volta.
  if (!parseOrder(candidate)) return { ok: false, reason: 'invalid-order' }

  return { ok: true, order: Object.freeze(candidate) }
}
