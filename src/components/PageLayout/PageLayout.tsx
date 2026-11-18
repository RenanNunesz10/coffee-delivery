import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { useCart } from '../../features/cart/useCart'
import { readLastOrder } from '../../features/orders/orderStorage'
import { useRouteFocus } from '../../hooks/useRouteFocus'
import { Header } from '../Header/Header'

const MAIN_CONTENT_ID = 'conteudo'

/** "Porto Alegre, RS" a partir do último pedido salvo, ou `null` sem pedido (PRD §12). */
function readLastOrderLocation(): string | null {
  const order = readLastOrder()
  return order ? `${order.address.city}, ${order.address.state}` : null
}

/** Estrutura comum das rotas: link de pular, Header e conteúdo da página (RF-07). */
export function PageLayout() {
  const { totalUnits } = useCart()
  // O layout renderiza a cada navegação; reler o último pedido (JSON pequeno) faz o Header
  // refletir um pedido recém-confirmado sem estado duplicado.
  useLocation()
  const lastOrderLocation = readLastOrderLocation()
  useRouteFocus(MAIN_CONTENT_ID)

  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only rounded-sm bg-purple-dark px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
      >
        Pular para o conteúdo
      </a>
      <Header cartUnits={totalUnits} location={lastOrderLocation} />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="app-container pb-16 outline-none">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  )
}
