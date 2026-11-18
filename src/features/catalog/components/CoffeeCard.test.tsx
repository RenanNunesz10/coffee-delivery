import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { findCoffee } from '../data/coffees'
import { CoffeeCard } from './CoffeeCard'

const cubano = findCoffee('cubano')!

function setup() {
  const onAdd = vi.fn()
  render(<CoffeeCard coffee={cubano} onAdd={onAdd} />)
  return { onAdd, card: screen.getByRole('article', { name: 'Cubano' }) }
}

describe('CoffeeCard', () => {
  it('exibe imagem, tags, nome, descrição e preço (RF-01)', () => {
    const { card } = setup()

    expect(within(card).getByRole('heading', { name: 'Cubano' })).toBeInTheDocument()
    expect(within(card).getByText(cubano.description)).toBeInTheDocument()
    expect(within(card).getByRole('list', { name: 'Categorias' })).toHaveTextContent(/Especial.*Alcoólico.*Gelado/)
    expect(card).toHaveTextContent('R$ 9,90')
    expect(card.querySelector('img')).toHaveAttribute('src', cubano.image)
  })

  it('começa em 1 e não desce abaixo de 1 (RF-02, RN-01)', async () => {
    const user = userEvent.setup()
    setup()
    const quantity = screen.getByRole('status', { name: 'Quantidade de Cubano' })

    expect(quantity).toHaveTextContent('1')
    expect(screen.getByRole('button', { name: 'Diminuir quantidade de Cubano' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Cubano' }))
    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Cubano' }))
    expect(quantity).toHaveTextContent('3')

    await user.click(screen.getByRole('button', { name: 'Diminuir quantidade de Cubano' }))
    expect(quantity).toHaveTextContent('2')
  })

  it('adiciona a quantidade escolhida, anuncia e volta para 1', async () => {
    const user = userEvent.setup()
    const { onAdd } = setup()
    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Cubano' }))

    await user.click(screen.getByRole('button', { name: 'Adicionar 2 Cubano ao carrinho' }))

    expect(onAdd).toHaveBeenCalledWith('cubano', 2)
    expect(screen.getByText('2 unidades de Cubano adicionadas ao carrinho')).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Quantidade de Cubano' })).toHaveTextContent('1')
  })
})
