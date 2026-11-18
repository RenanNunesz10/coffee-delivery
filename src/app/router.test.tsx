import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../tests/renderWithRouter'

const HOME_HEADING = 'Encontre o café perfeito para qualquer hora do dia'

describe('rotas', () => {
  it.each([
    ['/', 'Encontre o café perfeito para qualquer hora do dia', 'Coffee Delivery'],
    ['/checkout', 'Complete seu pedido', 'Checkout | Coffee Delivery'],
    ['/success', 'Uhu! Pedido confirmado', 'Pedido confirmado | Coffee Delivery'],
  ])('acesso direto a %s mostra a página certa', async (path, heading, title) => {
    renderApp(path)

    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    expect(document.title).toBe(title)
  })

  it('redireciona rotas desconhecidas para a Home', async () => {
    const { router } = renderApp('/rota-que-nao-existe')

    expect(await screen.findByRole('heading', { level: 1, name: HOME_HEADING })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
  })

  it('navega pelo link sem recarregar a página (SPA)', async () => {
    const user = userEvent.setup()
    const { router } = renderApp('/')
    const homeHeading = await screen.findByRole('heading', { level: 1, name: HOME_HEADING })
    const header = screen.getByRole('banner')

    await user.click(screen.getByRole('link', { name: /carrinho/i }))

    expect(router.state.location.pathname).toBe('/checkout')
    expect(homeHeading).not.toBeInTheDocument()
    // O mesmo Header continua montado: não houve recarga do documento.
    expect(screen.getByRole('banner')).toBe(header)
  })

  it('oferece link para pular direto ao conteúdo', async () => {
    renderApp('/')

    expect(await screen.findByRole('link', { name: 'Pular para o conteúdo' })).toHaveAttribute('href', '#conteudo')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'conteudo')
  })
})
