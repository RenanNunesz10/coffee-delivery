import { TrashIcon } from '@phosphor-icons/react'
import { QuantityInput } from '../../../components/QuantityInput/QuantityInput'
import { formatCurrency } from '../../../lib/formatCurrency'
import type { DetailedCartItem } from '../cartContext'

interface CartItemProps {
  item: DetailedCartItem
  onIncrease: () => void
  /** Ao decrementar de 1, o item é removido (RN-01). */
  onDecrease: () => void
  onRemove: () => void
}

/** Linha do carrinho no checkout (Figma: componente "Cart"), RF-05. */
export function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  const { coffee, quantity, lineTotalCents } = item

  return (
    <li className="flex items-start justify-between gap-3 border-b border-base-button py-6 first:pt-0">
      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
        <img src={coffee.image} alt="" width={64} height={64} className="size-16 shrink-0" />
        <div className="min-w-0">
          <p className="text-m text-base-subtitle">{coffee.name}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <QuantityInput
              quantity={quantity}
              itemName={coffee.name}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              size="sm"
            />
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remover ${coffee.name} do carrinho`}
              className="inline-flex h-8 items-center gap-1 rounded-sm bg-base-button px-2 text-button-m text-base-text uppercase transition-colors hover:bg-base-hover"
            >
              <TrashIcon size={16} aria-hidden="true" className="text-purple" />
              Remover
            </button>
          </div>
        </div>
      </div>
      <p className="shrink-0 text-m font-bold text-base-text">{formatCurrency(lineTotalCents)}</p>
    </li>
  )
}
