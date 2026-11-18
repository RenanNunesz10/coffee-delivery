import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '../../../domain/constants'
import { renderApp } from '../../../tests/renderWithRouter'

function withCart(items: { coffeeId: string; quantity: number }[]) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify({ items }))
}

const normalize = (value: string | null | undefined) => value?.replace(/\s/g, ' ')

describe('CheckoutPage', () => {
  it('mostra estado vazio com caminho para a Home quando não há itens (RN-09)', async () => {
    renderApp('/checkout')

    expect(await screen.findByRole('heading', { level: 1, name: 'Seu carrinho está vazio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver cafés' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('button', { name: 'Confirmar pedido' })).not.toBeInTheDocument()
  })

  it('apresenta endereço, pagamento, itens e resumo do Figma', async () => {
    withCart([
      { coffeeId: 'expresso-tradicional', quantity: 1 },
      { coffeeId: 'latte', quantity: 2 },
    ])
    renderApp('/checkout')

    expect(await screen.findByRole('heading', { level: 1, name: 'Complete seu pedido' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Endereço de Entrega' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Forma de pagamento' })).toBeInTheDocument()
    const summary = screen.getByRole('region', { name: 'Resumo do pedido' })
    expect(within(summary).getAllByRole('listitem')).toHaveLength(2)
    expect(normalize(summary.textContent)).toContain('TotalR$ 33,20')
  })

  it('bloqueia a confirmação com formulário inválido e indica o que corrigir (RF-11)', async () => {
    const user = userEvent.setup()
    withCart([{ coffeeId: 'latte', quantity: 1 }])
    const { router } = renderApp('/checkout')

    await user.click(await screen.findByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Revise os campos destacados')
    expect(screen.getByLabelText('CEP')).toHaveFocus()
    expect(screen.getByLabelText('CEP')).toHaveAccessibleDescription('Informe um CEP com 8 dígitos')
    expect(screen.getByRole('group', { name: 'Forma de pagamento' })).toHaveAccessibleDescription(
      'Selecione uma forma de pagamento',
    )
    expect(router.state.location.pathname).toBe('/checkout')
  })

  it('volta ao estado vazio ao remover o último item', async () => {
    const user = userEvent.setup()
    withCart([{ coffeeId: 'latte', quantity: 1 }])
    renderApp('/checkout')

    await user.click(await screen.findByRole('button', { name: 'Remover Latte do carrinho' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Seu carrinho está vazio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Carrinho vazio' })).toBeInTheDocument()
  })
})
