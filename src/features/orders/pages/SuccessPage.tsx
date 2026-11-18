import { ReceiptIcon } from '@phosphor-icons/react'
import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { OrderSuccess } from '../components/OrderSuccess'
import { parseOrder } from '../orderSchema'
import { readLastOrder } from '../orderStorage'

function orderFromNavigationState(state: unknown): unknown {
  return typeof state === 'object' && state !== null && 'order' in state ? state.order : null
}

/**
 * Tela de sucesso (RF-12, RF-13). Usa o snapshot vindo da confirmação (estado da navegação)
 * ou, após um refresh, o último pedido salvo. Nunca reconstrói o pedido a partir do carrinho.
 */
export function SuccessPage() {
  const location = useLocation()
  const order = useMemo(
    () => parseOrder(orderFromNavigationState(location.state)) ?? readLastOrder(),
    [location.state],
  )
  useDocumentTitle(order ? 'Pedido confirmado' : 'Nenhum pedido')

  if (!order) {
    return (
      <div className="mx-auto max-w-xl pt-8">
        <EmptyState
          icon={ReceiptIcon}
          headingLevel={1}
          title="Nenhum pedido para mostrar"
          description="Você ainda não confirmou um pedido. Escolha seus cafés para começar."
          actionLabel="Ver cafés"
          actionTo="/"
        />
      </div>
    )
  }

  return <OrderSuccess order={order} />
}
