import { Navigate, type RouteObject } from 'react-router'
import { PageLayout } from '../components/PageLayout/PageLayout'
import { HomePage } from '../features/catalog/pages/HomePage'
import { CheckoutPage } from '../features/checkout/pages/CheckoutPage'
import { SuccessPage } from '../features/orders/pages/SuccessPage'

/** Rotas da SPA (RF-07). Exportadas para que os testes usem as mesmas rotas com um router em memória. */
export const routes: RouteObject[] = [
  {
    element: <PageLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'success', element: <SuccessPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]
