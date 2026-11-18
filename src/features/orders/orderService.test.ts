import { describe, expect, it } from 'vitest'
import { DELIVERY_FEE_CENTS, STORAGE_KEYS } from '../../domain/constants'
import type { CartItem, Coffee, DeliveryAddress } from '../../domain/types'
import { COFFEES } from '../catalog/data/coffees'
import { parseOrder } from './orderSchema'
import { createOrder } from './orderService'
import { readLastOrder, saveLastOrder } from './orderStorage'

const ADDRESS: DeliveryAddress = {
  postalCode: '90250440',
  street: 'Rua João Daniel Martinelli',
  number: '102',
  district: 'Farrapos',
  city: 'Porto Alegre',
  state: 'RS',
}

const NOW = new Date('2026-11-18T12:00:00.000Z')

function create(items: CartItem[], coffees: readonly Coffee[] = COFFEES) {
  return createOrder({ items, address: ADDRESS, paymentMethod: 'credit', coffees, now: NOW, generateId: () => 'pedido-1' })
}

function createValidOrder() {
  const result = create([
    { coffeeId: 'expresso-tradicional', quantity: 1 },
    { coffeeId: 'latte', quantity: 2 },
  ])
  if (!result.ok) throw new Error('pedido deveria ser válido')
  return result.order
}

describe('createOrder', () => {
  it('cria o snapshot com itens copiados, endereço, pagamento e valores', () => {
    const order = createValidOrder()

    expect(order).toEqual({
      id: 'pedido-1',
      createdAt: '2026-11-18T12:00:00.000Z',
      items: [
        expect.objectContaining({ coffeeId: 'expresso-tradicional', name: 'Expresso Tradicional', unitPriceCents: 990, quantity: 1 }),
        expect.objectContaining({ coffeeId: 'latte', name: 'Latte', unitPriceCents: 990, quantity: 2 }),
      ],
      address: ADDRESS,
      paymentMethod: 'credit',
      subtotalCents: 2970,
      deliveryFeeCents: DELIVERY_FEE_CENTS,
      totalCents: 3320,
    })
  })

  it('não depende do carrinho nem do catálogo depois de criado (RN-06)', () => {
    const items: CartItem[] = [{ coffeeId: 'latte', quantity: 2 }]
    const catalog: Coffee[] = COFFEES.map((coffee) => ({ ...coffee }))
    const result = create(items, catalog)
    if (!result.ok) throw new Error('pedido deveria ser válido')

    items[0].quantity = 99
    items.length = 0
    catalog.forEach((coffee) => Object.assign(coffee, { name: 'Alterado', priceCents: 1 }))

    expect(result.order.items).toEqual([expect.objectContaining({ name: 'Latte', unitPriceCents: 990, quantity: 2 })])
    expect(result.order.totalCents).toBe(2 * 990 + DELIVERY_FEE_CENTS)
  })

  it('devolve um snapshot congelado', () => {
    const order = createValidOrder()

    expect(Object.isFrozen(order)).toBe(true)
    expect(Object.isFrozen(order.items)).toBe(true)
    expect(Object.isFrozen(order.items[0])).toBe(true)
    expect(Object.isFrozen(order.address)).toBe(true)
  })

  it('rejeita carrinho vazio (RN-10)', () => {
    expect(create([])).toEqual({ ok: false, reason: 'empty-cart' })
  })

  it('rejeita café inexistente no catálogo (RN-10)', () => {
    expect(create([{ coffeeId: 'latte', quantity: 1 }, { coffeeId: 'cafe-removido', quantity: 1 }])).toEqual({
      ok: false,
      reason: 'invalid-items',
      invalidItemIds: ['cafe-removido'],
    })
  })

  it('rejeita quantidade inválida', () => {
    expect(create([{ coffeeId: 'latte', quantity: 0 }])).toMatchObject({ ok: false, reason: 'invalid-items' })
  })

  it('rejeita endereço inválido', () => {
    const result = createOrder({
      items: [{ coffeeId: 'latte', quantity: 1 }],
      address: { ...ADDRESS, postalCode: '123' },
      paymentMethod: 'cash',
    })

    expect(result).toEqual({ ok: false, reason: 'invalid-order' })
  })

  it('gera IDs únicos por padrão', () => {
    const first = createOrder({ items: [{ coffeeId: 'latte', quantity: 1 }], address: ADDRESS, paymentMethod: 'cash' })
    const second = createOrder({ items: [{ coffeeId: 'latte', quantity: 1 }], address: ADDRESS, paymentMethod: 'cash' })

    expect(first.ok && second.ok && first.order.id !== second.order.id).toBe(true)
  })
})

describe('orderStorage', () => {
  it('salva e lê o último pedido (sobrevive a refresh)', () => {
    const order = createValidOrder()

    expect(saveLastOrder(order)).toBe(true)
    expect(readLastOrder()).toEqual(order)
  })

  it('usa uma chave separada do carrinho', () => {
    saveLastOrder(createValidOrder())

    expect(localStorage.getItem(STORAGE_KEYS.lastOrder)).not.toBeNull()
    expect(localStorage.getItem(STORAGE_KEYS.cart)).toBeNull()
  })

  it('retorna null sem pedido salvo', () => {
    expect(readLastOrder()).toBeNull()
  })

  it('descarta JSON corrompido', () => {
    localStorage.setItem(STORAGE_KEYS.lastOrder, '{"id":')

    expect(readLastOrder()).toBeNull()
    expect(localStorage.getItem(STORAGE_KEYS.lastOrder)).toBeNull()
  })

  it('descarta snapshot com totais inconsistentes', () => {
    localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify({ ...createValidOrder(), totalCents: 1 }))

    expect(readLastOrder()).toBeNull()
  })
})

describe('parseOrder', () => {
  it.each([null, 'pedido', {}, { id: 'x' }])('rejeita %o', (value) => {
    expect(parseOrder(value)).toBeNull()
  })
})
