import { describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '../../domain/constants'
import { mockSystemColorScheme } from '../../tests/matchMedia'
import { readStoredTheme, resolveInitialTheme, saveTheme } from './themeStorage'

describe('themeStorage', () => {
  it('salva e lê o tema escolhido', () => {
    saveTheme('dark')

    expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe('dark')
    expect(readStoredTheme()).toBe('dark')
  })

  it('ignora valores inválidos salvos', () => {
    localStorage.setItem(STORAGE_KEYS.theme, '"roxo"')

    expect(readStoredTheme()).toBeNull()
  })

  it('não quebra quando o localStorage está indisponível', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })

    expect(() => saveTheme('dark')).not.toThrow()
    expect(readStoredTheme()).toBeNull()
  })

  it('usa a preferência do sistema quando não há escolha salva', () => {
    mockSystemColorScheme('dark')

    expect(resolveInitialTheme()).toBe('dark')
  })

  it('prioriza a escolha salva sobre a preferência do sistema', () => {
    mockSystemColorScheme('dark')
    saveTheme('light')

    expect(resolveInitialTheme()).toBe('light')
  })

  it('usa o tema claro quando matchMedia não existe', () => {
    vi.stubGlobal('matchMedia', undefined)

    expect(resolveInitialTheme()).toBe('light')
  })
})

describe('script anti-flash de index.html', () => {
  it('usa a mesma chave de storage que o app', async () => {
    const { default: indexHtml } = await import('../../../index.html?raw')

    expect(indexHtml).toContain(`localStorage.getItem('${STORAGE_KEYS.theme}')`)
  })
})
