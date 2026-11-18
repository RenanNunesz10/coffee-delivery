import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '../../../domain/constants'
import { renderApp } from '../../../tests/renderWithRouter'
import { FIGMA_VIACEP_RESPONSE, mockViaCep } from '../../../tests/viacepMock'

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
    await waitFor(() => expect(router.state.location.pathname).toBe('/checkout'))
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

describe('CheckoutPage: confirmação do pedido', () => {
  async function fillValidCheckout(user: ReturnType<typeof userEvent.setup>) {
    await user.type(await screen.findByLabelText('CEP'), '90250440')
    await screen.findByText(/Endereço encontrado/)
    await user.type(screen.getByLabelText('Número'), '102')
    await user.click(screen.getByRole('radio', { name: 'Cartão de crédito' }))
  }

  it('salva o snapshot, limpa o carrinho e navega para /success (RF-12, RF-13)', async () => {
    const user = userEvent.setup()
    mockViaCep({ '90250440': { body: FIGMA_VIACEP_RESPONSE } })
    withCart([
      { coffeeId: 'expresso-tradicional', quantity: 1 },
      { coffeeId: 'latte', quantity: 2 },
    ])
    const { router } = renderApp('/checkout')
    await fillValidCheckout(user)

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/success'))
    const order = JSON.parse(localStorage.getItem(STORAGE_KEYS.lastOrder) ?? 'null')
    expect(order).toMatchObject({
      items: [
        { coffeeId: 'expresso-tradicional', quantity: 1 },
        { coffeeId: 'latte', quantity: 2 },
      ],
      address: { postalCode: '90250440', street: 'Rua João Daniel Martinelli', number: '102', city: 'Porto Alegre', state: 'RS' },
      paymentMethod: 'credit',
      subtotalCents: 2970,
      deliveryFeeCents: 350,
      totalCents: 3320,
    })
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) ?? 'null')).toEqual({ items: [] })
    expect(screen.getByRole('link', { name: 'Carrinho vazio' })).toBeInTheDocument()
    expect(router.state.location.state).toEqual({ order })
  })

  it('grava o snapshot antes de limpar o carrinho (RN-06)', async () => {
    const user = userEvent.setup()
    mockViaCep({ '90250440': { body: FIGMA_VIACEP_RESPONSE } })
    withCart([{ coffeeId: 'latte', quantity: 1 }])
    renderApp('/checkout')
    await fillValidCheckout(user)
    const writes: string[] = []
    const originalSetItem = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
      writes.push(key)
      originalSetItem.call(this, key, value)
    })

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(writes.indexOf(STORAGE_KEYS.lastOrder)).toBeGreaterThanOrEqual(0)
    expect(writes.indexOf(STORAGE_KEYS.lastOrder)).toBeLessThan(writes.lastIndexOf(STORAGE_KEYS.cart))
  })

  it('confirma mesmo com localStorage indisponível, levando o snapshot pela navegação', async () => {
    const user = userEvent.setup()
    mockViaCep({ '90250440': { body: FIGMA_VIACEP_RESPONSE } })
    withCart([{ coffeeId: 'latte', quantity: 1 }])
    const { router } = renderApp('/checkout')
    await fillValidCheckout(user)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('cota cheia')
    })

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/success'))
    expect(router.state.location.state).toMatchObject({ order: { paymentMethod: 'credit', totalCents: 1340 } })
  })

  it('não salva pedido nem limpa o carrinho com formulário inválido (RN-10)', async () => {
    const user = userEvent.setup()
    withCart([{ coffeeId: 'latte', quantity: 1 }])
    renderApp('/checkout')

    await user.click(await screen.findByRole('button', { name: 'Confirmar pedido' }))

    expect(localStorage.getItem(STORAGE_KEYS.lastOrder)).toBeNull()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) ?? 'null')).toEqual({ items: [{ coffeeId: 'latte', quantity: 1 }] })
  })
})
