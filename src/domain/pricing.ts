import { DELIVERY_FEE_CENTS } from './constants'
import type { CartItem, Coffee } from './types'

/*
 * Regras de preço (RN-03, RN-04). Funções puras e somente com inteiros (centavos):
 * nenhuma conta usa ponto flutuante, então não há erro de arredondamento.
 */

/** Valor de uma linha do carrinho: preço unitário × quantidade. */
export function calculateLineTotal(unitPriceCents: number, quantity: number): number {
  return unitPriceCents * quantity
}

/**
 * Soma das linhas cujo café existe no catálogo.
 * Itens desconhecidos não entram na soma e são reportados por `findInvalidItems`,
 * que bloqueia a confirmação do pedido (RN-10).
 */
export function calculateSubtotal(items: readonly CartItem[], coffees: readonly Coffee[]): number {
  return items.reduce((subtotal, item) => {
    const coffee = coffees.find(({ id }) => id === item.coffeeId)
    return coffee ? subtotal + calculateLineTotal(coffee.priceCents, item.quantity) : subtotal
  }, 0)
}

/** Frete fixo por pedido não vazio; carrinho vazio não paga frete. */
export function calculateDeliveryFee(items: readonly CartItem[]): number {
  return items.length > 0 ? DELIVERY_FEE_CENTS : 0
}

export function calculateTotal(subtotalCents: number, deliveryFeeCents: number): number {
  return subtotalCents + deliveryFeeCents
}

/** IDs de itens do carrinho que não existem no catálogo. */
export function findInvalidItems(items: readonly CartItem[], coffees: readonly Coffee[]): string[] {
  return items
    .filter((item) => !coffees.some(({ id }) => id === item.coffeeId))
    .map((item) => item.coffeeId)
}

/** Soma de unidades (não de tipos de café) para o contador do Header (RF-04). */
export function countUnits(items: readonly CartItem[]): number {
  return items.reduce((units, item) => units + item.quantity, 0)
}
