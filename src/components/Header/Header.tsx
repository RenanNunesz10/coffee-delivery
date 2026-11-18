import { Link } from 'react-router'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'

/** Provisório: o Header do Figma é implementado na TASK-012. */
export function Header() {
  return (
    <header className="app-container flex items-center justify-between gap-4 py-8">
      <Link to="/" className="font-title text-title-s text-purple-ink">
        Coffee Delivery
      </Link>
      <nav aria-label="Principal" className="flex items-center gap-3">
        <Link to="/checkout" className="text-s text-purple-ink underline">
          Carrinho
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  )
}
