import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import logoDark from '../../assets/brand/logo-dark.svg'
import logoLight from '../../assets/brand/logo-light.svg'
import { ThemeProvider } from '../../features/theme/ThemeProvider'
import { Header } from './Header'

function renderHeader(props: Parameters<typeof Header>[0]) {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <Header {...props} />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('Header', () => {
  it('mostra a logo com link para a Home', () => {
    renderHeader({ cartUnits: 0 })

    expect(screen.getByRole('link', { name: 'Coffee Delivery, página inicial' })).toHaveAttribute('href', '/')
  })

  it('esconde o badge com carrinho vazio', () => {
    renderHeader({ cartUnits: 0 })

    expect(screen.getByRole('link', { name: 'Carrinho vazio' })).toHaveAttribute('href', '/checkout')
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument()
  })

  it.each([
    [1, 'Carrinho, 1 item'],
    [5, 'Carrinho, 5 itens'],
  ])('exibe %i unidade(s) no badge e no nome acessível (RF-04)', (units, label) => {
    renderHeader({ cartUnits: units })

    expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    expect(screen.getByTestId('cart-badge')).toHaveTextContent(String(units))
  })

  it('mostra a localização somente quando informada', () => {
    const { unmount } = renderHeader({ cartUnits: 0, location: null })
    expect(screen.queryByText(/Porto Alegre/)).not.toBeInTheDocument()
    unmount()

    renderHeader({ cartUnits: 0, location: 'Porto Alegre, RS' })
    expect(screen.getByText('Porto Alegre, RS')).toBeInTheDocument()
  })

  it('troca a logo conforme o tema', async () => {
    const user = userEvent.setup()
    renderHeader({ cartUnits: 0 })
    const logo = screen.getByRole('img', { name: 'Coffee Delivery, página inicial' })
    expect(logo).toHaveAttribute('src', logoLight)

    await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))

    expect(logo).toHaveAttribute('src', logoDark)
  })
})
