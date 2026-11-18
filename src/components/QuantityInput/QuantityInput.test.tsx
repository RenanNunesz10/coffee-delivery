import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QuantityInput } from './QuantityInput'

function setup(props: Partial<Parameters<typeof QuantityInput>[0]> = {}) {
  const onIncrease = vi.fn()
  const onDecrease = vi.fn()
  render(<QuantityInput quantity={2} itemName="Latte" onIncrease={onIncrease} onDecrease={onDecrease} {...props} />)
  return { onIncrease, onDecrease }
}

describe('QuantityInput', () => {
  it('mostra a quantidade com nome acessível', () => {
    setup()

    expect(screen.getByRole('status', { name: 'Quantidade de Latte' })).toHaveTextContent('2')
  })

  it('aciona aumentar e diminuir pelos botões rotulados', async () => {
    const user = userEvent.setup()
    const { onIncrease, onDecrease } = setup()

    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Latte' }))
    await user.click(screen.getByRole('button', { name: 'Diminuir quantidade de Latte' }))

    expect(onIncrease).toHaveBeenCalledOnce()
    expect(onDecrease).toHaveBeenCalledOnce()
  })

  it('desabilita diminuir quando não é permitido', async () => {
    const user = userEvent.setup()
    const { onDecrease } = setup({ quantity: 1, canDecrease: false })
    const decrease = screen.getByRole('button', { name: 'Diminuir quantidade de Latte' })

    expect(decrease).toBeDisabled()
    await user.click(decrease)
    expect(onDecrease).not.toHaveBeenCalled()
  })

  it('funciona pelo teclado', async () => {
    const user = userEvent.setup()
    const { onIncrease } = setup()

    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Aumentar quantidade de Latte' })).toHaveFocus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')

    expect(onIncrease).toHaveBeenCalledTimes(2)
  })
})
