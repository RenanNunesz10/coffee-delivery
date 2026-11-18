import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '../../../domain/constants'
import { renderApp } from '../../../tests/renderWithRouter'
import { COFFEES } from '../data/coffees'

const BENEFITS = [
  'Compra simples e segura',
  'Embalagem mantém o café intacto',
  'Entrega rápida e rastreada',
  'O café chega fresquinho até você',
]

describe('HomePage', () => {
  it('apresenta o hero com os quatro benefícios', async () => {
    renderApp('/')

    expect(await screen.findByRole('heading', { level: 1, name: /Encontre o café perfeito/ })).toBeInTheDocument()
    BENEFITS.forEach((benefit) => expect(screen.getByText(benefit)).toBeInTheDocument())
  })

  it('lista todos os cafés do catálogo (RF-01)', async () => {
    renderApp('/')
    const catalog = await screen.findByRole('region', { name: 'Nossos cafés' })

    expect(within(catalog).getAllByRole('article')).toHaveLength(COFFEES.length)
    COFFEES.forEach((coffee) =>
      expect(within(catalog).getByRole('heading', { level: 3, name: coffee.name })).toBeInTheDocument(),
    )
  })
})

describe('HomePage + carrinho', () => {
  it('acumula o mesmo café e soma unidades no Header (RF-03, RF-04, RN-02)', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await screen.findByRole('region', { name: 'Nossos cafés' })
    expect(screen.getByRole('link', { name: 'Carrinho vazio' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Latte' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar 2 Latte ao carrinho' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar 1 Latte ao carrinho' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar 1 Cubano ao carrinho' }))

    expect(screen.getByRole('link', { name: 'Carrinho, 4 itens' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) ?? '')).toEqual({
      items: [
        { coffeeId: 'latte', quantity: 3 },
        { coffeeId: 'cubano', quantity: 1 },
      ],
    })
  })

  it('mostra no Header o carrinho recuperado após refresh (RF-06)', async () => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify({ items: [{ coffeeId: 'arabe', quantity: 2 }] }))

    renderApp('/')

    expect(await screen.findByRole('link', { name: 'Carrinho, 2 itens' })).toBeInTheDocument()
  })
})
