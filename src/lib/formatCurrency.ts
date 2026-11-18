const CENTS_PER_REAL = 100

const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Formata centavos em BRL, ex.: 990 → "R$ 9,90" (RN-04). A divisão acontece só na exibição. */
export function formatCurrency(cents: number): string {
  return brlFormatter.format(cents / CENTS_PER_REAL)
}

/**
 * Separa símbolo e valor para layouts como o card do catálogo ("R$" pequeno + "9,90" grande),
 * usando o mesmo formatador para não haver divergência.
 */
export function formatCurrencyParts(cents: number): { symbol: string; amount: string } {
  const parts = brlFormatter.formatToParts(cents / CENTS_PER_REAL)
  const symbol = parts.find((part) => part.type === 'currency')?.value ?? 'R$'
  const amount = parts
    .filter((part) => part.type !== 'currency' && part.type !== 'literal')
    .map((part) => part.value)
    .join('')

  return { symbol, amount }
}
