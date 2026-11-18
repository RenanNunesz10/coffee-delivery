import { formatCurrency } from '../../../lib/formatCurrency'

interface CartSummaryProps {
  subtotalCents: number
  deliveryFeeCents: number
  totalCents: number
  isSubmitting?: boolean
}

/**
 * Resumo financeiro e botão de confirmação (RF-10, RF-11).
 * O botão é `submit` do formulário do checkout; a validação acontece no handler (RN-10).
 */
export function CartSummary({ subtotalCents, deliveryFeeCents, totalCents, isSubmitting = false }: CartSummaryProps) {
  return (
    <div className="pt-6">
      <dl className="flex flex-col gap-3 text-base-text">
        <div className="flex items-center justify-between">
          <dt className="text-s">Total de itens</dt>
          <dd className="text-m">{formatCurrency(subtotalCents)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-s">Entrega</dt>
          <dd className="text-m">{formatCurrency(deliveryFeeCents)}</dd>
        </div>
        <div className="flex items-center justify-between text-base-subtitle">
          <dt className="text-l font-bold">Total</dt>
          <dd className="text-l font-bold">{formatCurrency(totalCents)}</dd>
        </div>
      </dl>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-sm bg-yellow px-2 py-3 text-button-g text-on-yellow uppercase transition-colors hover:bg-yellow-dark disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? 'Confirmando…' : 'Confirmar pedido'}
      </button>
    </div>
  )
}
