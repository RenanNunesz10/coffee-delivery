import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
