import type { CoffeeTag, PaymentMethod } from './types'

/** Taxa de entrega fixa e fictícia por pedido não vazio: R$ 3,50, conforme Figma (RN-03). */
export const DELIVERY_FEE_CENTS = 350

/** Previsão de entrega exibida na tela de sucesso (texto fixo do Figma). */
export const DELIVERY_ESTIMATE = '20 min – 30 min'

/** Tags dos cafés (RF-01). A ordem define a ordem de exibição. */
export const COFFEE_TAGS = ['traditional', 'special', 'with-milk', 'alcoholic', 'iced'] as const

export const COFFEE_TAG_LABELS = {
  traditional: 'Tradicional',
  special: 'Especial',
  'with-milk': 'Com leite',
  alcoholic: 'Alcoólico',
  iced: 'Gelado',
} as const satisfies Record<CoffeeTag, string>

/** Formas de pagamento informativas, sem transação real (RN-05). */
export const PAYMENT_METHODS = ['credit', 'debit', 'cash'] as const

export const PAYMENT_METHOD_LABELS = {
  credit: 'Cartão de crédito',
  debit: 'Cartão de débito',
  cash: 'Dinheiro',
} as const satisfies Record<PaymentMethod, string>

/** As 27 unidades federativas (RN-07). */
export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

/** Quantidade mínima em qualquer operação de adição (RN-01). */
export const MIN_ITEM_QUANTITY = 1

/** Quantidade de dígitos do CEP após remover a máscara (RN-07). */
export const POSTAL_CODE_LENGTH = 8

/**
 * Chaves do localStorage, versionadas para permitir migração futura.
 * A chave do tema também aparece no script inline de index.html (que roda antes do bundle
 * e não pode importar módulos); um teste garante que as duas continuem iguais.
 */
export const STORAGE_KEYS = {
  cart: 'coffee-delivery:cart:v1',
  theme: 'coffee-delivery:theme:v1',
  lastOrder: 'coffee-delivery:last-order:v1',
} as const
