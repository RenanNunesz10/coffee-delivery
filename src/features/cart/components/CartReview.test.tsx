import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CoffeeIcon } from '@phosphor-icons/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import { STORAGE_KEYS } from '../../../domain/constants'
import { CartProvider } from '../CartProvider'
import { useCart } from '../useCart'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'

/** Composição mínima usada pela página de checkout: linhas + resumo ligados ao contexto. */
function CartReview() {
  const cart = useCart()

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <ul aria-label="Cafés selecionados">
        {cart.detailedItems.map((item) => (
          <CartItem
            key={item.coffee.id}
            item={item}
            onIncrease={() => cart.incrementItem(item.coffee.id)}
            onDecrease={() => cart.decrementItem(item.coffee.id)}
            onRemove={() => cart.removeItem(item.coffee.id)}
          />
        ))}
      </ul>
      <CartSummary
        subtotalCents={cart.subtotalCents}
        deliveryFeeCents={cart.deliveryFeeCents}
        totalCents={cart.totalCents}
      />
    </form>
  )
}

function renderReview(items: { coffeeId: string; quantity: number }[]) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify({ items }))
  render(
    <CartProvider>
      <CartReview />
    </CartProvider>,
  )
}

const text = (element: HTMLElement) => element.textContent?.replace(/\s/g, ' ')
const summaryValue = (label: string) => text(screen.getByText(label).nextElementSibling as HTMLElement)

describe('revisão do carrinho', () => {
  it('mostra cada linha com preço unitário × quantidade e o resumo em BRL', () => {
    renderReview([
      { coffeeId: 'expresso-tradicional', quantity: 1 },
      { coffeeId: 'latte', quantity: 2 },
    ])
    const lines = within(screen.getByRole('list', { name: 'Cafés selecionados' })).getAllByRole('listitem')

    expect(text(lines[0])).toContain('R$ 9,90')
    expect(text(lines[1])).toContain('R$ 19,80')
    expect(summaryValue('Total de itens')).toBe('R$ 29,70')
    expect(summaryValue('Entrega')).toBe('R$ 3,50')
    expect(summaryValue('Total')).toBe('R$ 33,20')
  })

  it('atualiza valores imediatamente ao incrementar e decrementar (RF-05)', async () => {
    const user = userEvent.setup()
    renderReview([{ coffeeId: 'latte', quantity: 1 }])

    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Latte' }))
    expect(screen.getByRole('status', { name: 'Quantidade de Latte' })).toHaveTextContent('2')
    expect(summaryValue('Total')).toBe('R$ 23,30')

    await user.click(screen.getByRole('button', { name: 'Diminuir quantidade de Latte' }))
    expect(summaryValue('Total')).toBe('R$ 13,40')
  })

  it('remove o item ao decrementar de 1 e zera o frete (RN-01, RN-03)', async () => {
    const user = userEvent.setup()
    renderReview([{ coffeeId: 'latte', quantity: 1 }])

    await user.click(screen.getByRole('button', { name: 'Diminuir quantidade de Latte' }))

    expect(screen.queryByText('Latte')).not.toBeInTheDocument()
    expect(summaryValue('Entrega')).toBe('R$ 0,00')
    expect(summaryValue('Total')).toBe('R$ 0,00')
  })

  it('remove diretamente pelo botão Remover', async () => {
    const user = userEvent.setup()
    renderReview([
      { coffeeId: 'latte', quantity: 3 },
      { coffeeId: 'cubano', quantity: 1 },
    ])

    await user.click(screen.getByRole('button', { name: 'Remover Latte do carrinho' }))

    expect(screen.queryByText('Latte')).not.toBeInTheDocument()
    expect(screen.getByText('Cubano')).toBeInTheDocument()
    expect(summaryValue('Total de itens')).toBe('R$ 9,90')
  })
})

describe('EmptyState', () => {
  it('explica o estado e oferece caminho de volta (RN-09)', () => {
    render(
      <MemoryRouter>
        <EmptyState
          icon={CoffeeIcon}
          title="Seu carrinho está vazio"
          description="Escolha seus cafés favoritos para continuar."
          actionLabel="Ver cafés"
          actionTo="/"
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Seu carrinho está vazio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver cafés' })).toHaveAttribute('href', '/')
  })
})
