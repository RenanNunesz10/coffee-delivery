import { ShoppingCartIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'

interface CartLinkProps {
  /** Soma de unidades no carrinho (RF-04). */
  units: number
}

function describeCart(units: number): string {
  if (units === 0) return 'Carrinho vazio'
  return `Carrinho, ${units} ${units === 1 ? 'item' : 'itens'}`
}

/** Botão do carrinho do Header com badge de unidades (Figma: Cart empty/full). */
export function CartLink({ units }: CartLinkProps) {
  return (
    <Link
      to="/checkout"
      aria-label={describeCart(units)}
      className="relative inline-flex size-[38px] items-center justify-center rounded-sm bg-yellow-light text-yellow-ink transition-colors hover:brightness-95"
    >
      <ShoppingCartIcon size={22} weight="fill" aria-hidden="true" />
      {units > 0 && (
        <span
          aria-hidden="true"
          data-testid="cart-badge"
          className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-dark px-1 text-xs text-on-yellow"
        >
          {units}
        </span>
      )}
    </Link>
  )
}
