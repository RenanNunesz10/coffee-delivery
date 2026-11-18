import { STORAGE_KEYS } from '../../domain/constants'

export const THEMES = ['light', 'dark'] as const

export type Theme = (typeof THEMES)[number]

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}

/** Tema escolhido pelo usuário, ou `null` se não houver escolha válida salva. */
export function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.theme)
    return isTheme(value) ? value : null
  } catch {
    // localStorage pode estar bloqueado (modo privado, política do navegador).
    return null
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEYS.theme, theme)
  } catch {
    // Sem persistência disponível: o tema continua valendo nesta sessão.
  }
}

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'

export function getSystemTheme(): Theme {
  if (typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia(DARK_SCHEME_QUERY).matches ? 'dark' : 'light'
}

/** Avisa quando a preferência do sistema muda. Retorna a função de cancelamento. */
export function subscribeToSystemTheme(onChange: (theme: Theme) => void): () => void {
  if (typeof window.matchMedia !== 'function') {
    return () => {}
  }

  const mediaQuery = window.matchMedia(DARK_SCHEME_QUERY)
  const handleChange = (event: MediaQueryListEvent) => onChange(event.matches ? 'dark' : 'light')

  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}

/** Preferência salva tem prioridade; sem ela, vale a preferência do sistema. */
export function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? getSystemTheme()
}
