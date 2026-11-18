import { vi } from 'vitest'

type ChangeListener = (event: MediaQueryListEvent) => void

/**
 * jsdom não implementa matchMedia. Este mock simula `prefers-color-scheme`
 * e permite disparar mudanças da preferência do sistema nos testes.
 */
export function mockSystemColorScheme(initial: 'light' | 'dark') {
  let matches = initial === 'dark'
  const listeners = new Set<ChangeListener>()

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches() {
        return matches
      },
      media: query,
      addEventListener: (_type: 'change', listener: ChangeListener) => listeners.add(listener),
      removeEventListener: (_type: 'change', listener: ChangeListener) => listeners.delete(listener),
    })),
  )

  return {
    change(next: 'light' | 'dark') {
      matches = next === 'dark'
      listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent))
    },
  }
}
