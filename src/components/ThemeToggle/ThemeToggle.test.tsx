import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '../../domain/constants'
import { ThemeProvider } from '../../features/theme/ThemeProvider'
import { mockSystemColorScheme } from '../../tests/matchMedia'
import { ThemeToggle } from './ThemeToggle'

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

const root = document.documentElement

describe('ThemeToggle', () => {
  it('na primeira visita segue a preferência do sistema', () => {
    mockSystemColorScheme('dark')
    renderToggle()

    expect(root.dataset.theme).toBe('dark')
    expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument()
  })

  it('alterna o tema globalmente e persiste a escolha', async () => {
    const user = userEvent.setup()
    mockSystemColorScheme('light')
    renderToggle()

    await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))

    expect(root.dataset.theme).toBe('dark')
    expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe('dark')
    expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument()
  })

  it('mantém o tema salvo após recarregar (remontar)', async () => {
    const user = userEvent.setup()
    mockSystemColorScheme('light')
    const { unmount } = renderToggle()
    await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))
    unmount()

    renderToggle()

    expect(root.dataset.theme).toBe('dark')
  })

  it('é acionável pelo teclado', async () => {
    const user = userEvent.setup()
    mockSystemColorScheme('light')
    renderToggle()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Ativar tema escuro' })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(root.dataset.theme).toBe('dark')
  })

  it('acompanha mudanças do sistema enquanto não houver escolha salva', () => {
    const system = mockSystemColorScheme('light')
    renderToggle()

    act(() => system.change('dark'))

    expect(root.dataset.theme).toBe('dark')
  })

  it('ignora mudanças do sistema depois que o usuário escolhe', async () => {
    const user = userEvent.setup()
    const system = mockSystemColorScheme('light')
    renderToggle()
    await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))

    act(() => system.change('light'))

    expect(root.dataset.theme).toBe('dark')
  })
})
