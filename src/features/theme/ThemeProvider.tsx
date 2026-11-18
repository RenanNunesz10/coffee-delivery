import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type ThemeContextValue } from './themeContext'
import { readStoredTheme, resolveInitialTheme, saveTheme, subscribeToSystemTheme } from './themeStorage'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState(resolveInitialTheme)

  // Aplica o tema no <html>; os tokens CSS reagem ao atributo data-theme.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Enquanto o usuário não escolher um tema, acompanha mudanças do sistema.
  useEffect(
    () =>
      subscribeToSystemTheme((systemTheme) => {
        if (readStoredTheme() === null) {
          setTheme(systemTheme)
        }
      }),
    [],
  )

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      saveTheme(next)
      return next
    })
  }, [])

  const value = useMemo<ThemeContextValue>(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
