/**
 * Chaves do localStorage, versionadas para permitir migração futura.
 * A chave do tema também aparece no script inline de index.html (que roda antes do bundle
 * e não pode importar módulos); mantenha as duas em sincronia.
 */
export const STORAGE_KEYS = {
  cart: 'coffee-delivery:cart:v1',
  theme: 'coffee-delivery:theme:v1',
  lastOrder: 'coffee-delivery:last-order:v1',
} as const
