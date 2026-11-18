import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle'
import { AppProviders } from './providers'

export function App() {
  return (
    <AppProviders>
      {/* Provisório até o Header (TASK-012). */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center gap-2 px-4 text-center">
        <h1 className="font-title text-title-xl">Coffee Delivery</h1>
        <p className="text-l text-base-subtitle">Em construção</p>
      </main>
    </AppProviders>
  )
}
