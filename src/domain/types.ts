import type { BRAZILIAN_STATES, COFFEE_TAGS, PAYMENT_METHODS } from './constants'

/*
 * Tipos de domínio do Coffee Delivery (TECH_SPEC §4).
 * As uniões são derivadas das listas em constants.ts: adicionar um valor na lista
 * atualiza o tipo automaticamente, e os schemas Zod reutilizam as mesmas listas.
 * Valores monetários são sempre centavos inteiros (RN-04).
 */

export type CoffeeTag = (typeof COFFEE_TAGS)[number]

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export type BrazilianState = (typeof BRAZILIAN_STATES)[number]

/** Café do catálogo (RF-01, RN-08). */
export interface Coffee {
  /** Slug estável, ex.: 'expresso-tradicional'. Identidade do produto (RN-02). */
  id: string
  name: string
  description: string
  /** Preço unitário em centavos inteiros. */
  priceCents: number
  /** Ao menos uma tag. */
  tags: readonly CoffeeTag[]
  /** URL da imagem (import de src/assets/coffees). */
  image: string
}

/** Linha do carrinho: referência ao café + quantidade inteira ≥ 1 (RN-01, RN-02). */
export interface CartItem {
  coffeeId: Coffee['id']
  quantity: number
}

/** Endereço de entrega (RF-08, RN-07). */
export interface DeliveryAddress {
  /** Oito dígitos, sem máscara. */
  postalCode: string
  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: BrazilianState
}

/**
 * Item do pedido: cópia dos dados do café no momento da confirmação,
 * para que mudanças futuras no catálogo não alterem um pedido concluído (RN-06).
 */
export interface OrderItem {
  coffeeId: Coffee['id']
  name: string
  unitPriceCents: number
  quantity: number
  image: string
}

/** Snapshot imutável do pedido confirmado, independente do carrinho (RF-12, RF-13, RN-06). */
export interface Order {
  /** Gerado com crypto.randomUUID(). */
  id: string
  /** Data ISO 8601. */
  createdAt: string
  items: readonly OrderItem[]
  address: DeliveryAddress
  paymentMethod: PaymentMethod
  subtotalCents: number
  deliveryFeeCents: number
  totalCents: number
}
