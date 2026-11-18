import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '../../../domain/constants'
import type { DeliveryAddress } from '../../../domain/types'
import { renderApp } from '../../../tests/renderWithRouter'
import { createOrder } from '../orderService'

const ADDRESS: DeliveryAddress = {
  postalCode: '90250440',
  street: 'Rua João Daniel Martinelli',
  number: '102',
  district: 'Farrapos',
  city: 'Porto Alegre',
  state: 'RS',
}

function saveOrder(overrides: Partial<DeliveryAddress> = {}) {
  const result = createOrder({
    items: [{ coffeeId: 'latte', quantity: 2 }],
    address: { ...ADDRESS, ...overrides },
    paymentMethod: 'credit',
  })
  if (!result.ok) throw new Error('pedido inválido no teste')
  localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(result.order))
  return result.order
}

const details = () => within(screen.getByRole('list', { name: 'Detalhes do pedido' }))

describe('SuccessPage', () => {
  it('mostra endereço, previsão e pagamento do snapshot salvo (RF-12, refresh)', async () => {
    saveOrder()

    renderApp('/success')

    expect(await screen.findByRole('heading', { level: 1, name: 'Uhu! Pedido confirmado' })).toBeInTheDocument()
    expect(details().getByText('Rua João Daniel Martinelli, 102')).toBeInTheDocument()
    expect(details().getByText(/Farrapos - Porto Alegre, RS/)).toBeInTheDocument()
    expect(details().getByText('20 min – 30 min')).toBeInTheDocument()
    expect(details().getByText('Cartão de crédito')).toBeInTheDocument()
  })

  it('inclui o complemento quando informado', async () => {
    saveOrder({ complement: 'Apto 3' })

    renderApp('/success')

    expect(await screen.findByText('Rua João Daniel Martinelli, 102 - Apto 3')).toBeInTheDocument()
  })

  it('funciona com o carrinho vazio, pois não depende dele (RF-13)', async () => {
    saveOrder()
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify({ items: [] }))

    renderApp('/success')

    expect(await screen.findByRole('heading', { name: 'Uhu! Pedido confirmado' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Carrinho vazio' })).toBeInTheDocument()
  })

  it('mostra a cidade do pedido no Header', async () => {
    saveOrder()

    renderApp('/success')

    expect(await screen.findByText('Porto Alegre, RS')).toBeInTheDocument()
  })

  it('mostra estado vazio sem pedido válido (RN-09)', async () => {
    renderApp('/success')

    expect(await screen.findByRole('heading', { level: 1, name: 'Nenhum pedido para mostrar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver cafés' })).toHaveAttribute('href', '/')
    expect(screen.queryByText(/Pedido confirmado/)).not.toBeInTheDocument()
    expect(document.title).toBe('Nenhum pedido | Coffee Delivery')
  })

  it('não exibe snapshot corrompido como pedido concluído', async () => {
    localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify({ id: 'falso', totalCents: 10 }))

    renderApp('/success')

    expect(await screen.findByRole('heading', { name: 'Nenhum pedido para mostrar' })).toBeInTheDocument()
  })
})
