import { Navigate, type RouteObject } from 'react-router'
import { PageLayout } from '../components/PageLayout/PageLayout'
import { PageLoading } from '../components/PageLoading/PageLoading'
import { HomePage } from '../features/catalog/pages/HomePage'

/**
 * Rotas da SPA (RF-07). Exportadas para que os testes usem as mesmas rotas com um router em memória.
 * Checkout e Sucesso são carregadas sob demanda: o formulário (React Hook Form) e a tela de
 * confirmação só são baixados quando o usuário chega a essas páginas (PRD §8.3).
 */
export const routes: RouteObject[] = [
  {
    element: <PageLayout />,
    hydrateFallbackElement: <PageLoading />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'checkout',
        lazy: async () => {
          const { CheckoutPage } = await import('../features/checkout/pages/CheckoutPage')
          return { Component: CheckoutPage }
        },
      },
      {
        path: 'success',
        lazy: async () => {
          const { SuccessPage } = await import('../features/orders/pages/SuccessPage')
          return { Component: SuccessPage }
        },
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]
