import { act, render, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { DELIVERY_FEE_CENTS, STORAGE_KEYS } from '../../domain/constants'
import { CartProvider } from './CartProvider'
import { useCart } from './useCart'

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>

const renderCart = () => renderHook(() => useCart(), { wrapper })

const storedCart = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) ?? 'null')

describe('CartProvider', () => {
  it('expõe carrinho vazio com valores zerados', () => {
    const { result } = renderCart()

    expect(result.current.items).toEqual([])
    expect(result.current.totalUnits).toBe(0)
    expect([result.current.subtotalCents, result.current.deliveryFeeCents, result.current.totalCents]).toEqual([0, 0, 0])
  })

  it('soma unidades, subtotal, frete e total ao adicionar (RF-03, RF-04, RF-10)', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem('latte', 2)
      result.current.addItem('cubano', 1)
      result.current.addItem('latte', 1)
    })

    expect(result.current.items).toEqual([
      { coffeeId: 'latte', quantity: 3 },
      { coffeeId: 'cubano', quantity: 1 },
    ])
    expect(result.current.totalUnits).toBe(4)
    expect(result.current.subtotalCents).toBe(4 * 990)
    expect(result.current.deliveryFeeCents).toBe(DELIVERY_FEE_CENTS)
    expect(result.current.totalCents).toBe(4 * 990 + DELIVERY_FEE_CENTS)
    expect(result.current.detailedItems[0]).toMatchObject({ quantity: 3, lineTotalCents: 2970 })
    expect(result.current.detailedItems[0].coffee.name).toBe('Latte')
  })

  it('incrementa, decrementa até remover, remove e limpa (RF-05)', () => {
    const { result } = renderCart()
    act(() => {
      result.current.addItem('latte', 1)
      result.current.addItem('cubano', 2)
    })

    act(() => result.current.incrementItem('latte'))
    expect(result.current.items[0].quantity).toBe(2)

    act(() => {
      result.current.decrementItem('latte')
      result.current.decrementItem('latte')
    })
    expect(result.current.items).toEqual([{ coffeeId: 'cubano', quantity: 2 }])

    act(() => result.current.removeItem('cubano'))
    expect(result.current.items).toEqual([])

    act(() => result.current.addItem('arabe', 1))
    act(() => result.current.clearCart())
    expect(result.current.items).toEqual([])
    expect(result.current.deliveryFeeCents).toBe(0)
  })

  it('persiste cada alteração no localStorage (RF-06)', () => {
    const { result } = renderCart()

    act(() => result.current.addItem('latte', 2))
    expect(storedCart()).toEqual({ items: [{ coffeeId: 'latte', quantity: 2 }] })

    act(() => result.current.clearCart())
    expect(storedCart()).toEqual({ items: [] })
  })

  it('recupera o carrinho salvo ao montar de novo (simula refresh) sem sobrescrevê-lo', () => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify({ items: [{ coffeeId: 'irlandes', quantity: 3 }] }))

    const { result } = renderCart()

    expect(result.current.items).toEqual([{ coffeeId: 'irlandes', quantity: 3 }])
    expect(result.current.totalUnits).toBe(3)
    expect(storedCart()).toEqual({ items: [{ coffeeId: 'irlandes', quantity: 3 }] })
  })

  it('exige o Provider', () => {
    const Consumer = () => {
      useCart()
      return null
    }
    // Silencia o log de erro esperado do React.
    const originalError = console.error
    console.error = () => {}
    expect(() => render(<Consumer />)).toThrow('useCart deve ser usado dentro de <CartProvider>')
    console.error = originalError
  })
})
