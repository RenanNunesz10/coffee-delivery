import type { ReactNode } from 'react'
import { ThemeProvider } from '../features/theme/ThemeProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>
}
