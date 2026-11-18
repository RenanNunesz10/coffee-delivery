import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { AppProviders } from '../app/providers'
import { routes } from '../app/router'

/** Renderiza o app completo (providers + rotas reais) em uma URL inicial, com router em memória. */
export function renderApp(initialPath = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })

  const view = render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )

  return { ...view, router }
}
