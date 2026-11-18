import { z } from 'zod'
import { BRAZILIAN_STATES, MIN_ITEM_QUANTITY, PAYMENT_METHODS, POSTAL_CODE_LENGTH } from '../../domain/constants'
import type { Order } from '../../domain/types'

const cents = z.number().int().min(0)

const orderItemSchema = z.object({
  coffeeId: z.string().min(1),
  name: z.string().min(1),
  unitPriceCents: cents,
  quantity: z.number().int().min(MIN_ITEM_QUANTITY),
  image: z.string().min(1),
})

const deliveryAddressSchema = z.object({
  postalCode: z.string().regex(new RegExp(`^\\d{${POSTAL_CODE_LENGTH}}$`)),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().min(1).optional(),
  district: z.string().min(1),
  city: z.string().min(1),
  state: z.enum(BRAZILIAN_STATES),
})

/**
 * Contrato do snapshot do pedido (RN-06). Usado para validar o pedido criado,
 * o que vem do localStorage e o que chega pelo estado da navegação.
 * Os totais precisam bater com os itens: um snapshot adulterado ou corrompido é rejeitado.
 */
export const orderSchema = z
  .object({
    id: z.string().min(1),
    createdAt: z.iso.datetime(),
    items: z.array(orderItemSchema).min(1),
    address: deliveryAddressSchema,
    paymentMethod: z.enum(PAYMENT_METHODS),
    subtotalCents: cents,
    deliveryFeeCents: cents,
    totalCents: cents,
  })
  .refine(
    (order) =>
      order.subtotalCents === order.items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0) &&
      order.totalCents === order.subtotalCents + order.deliveryFeeCents,
    { message: 'Totais do pedido inconsistentes' },
  )

/** Valida um valor desconhecido como pedido; `null` se não for um snapshot válido. */
export function parseOrder(value: unknown): Order | null {
  const result = orderSchema.safeParse(value)
  return result.success ? result.data : null
}
