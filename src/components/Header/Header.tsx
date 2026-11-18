import { Link } from 'react-router'
import logoDark from '../../assets/brand/logo-dark.svg'
import logoLight from '../../assets/brand/logo-light.svg'
import { useTheme } from '../../features/theme/useTheme'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { CartLink } from './CartLink'
import { LocationChip } from './LocationChip'

interface HeaderProps {
  /** Soma de unidades do carrinho (RF-04). */
  cartUnits: number
  /** Cidade/UF do último pedido; oculto quando não há pedido (PRD §12). */
  location?: string | null
}

/** Header do Figma (RF-04, RF-14, RF-16), fixo no topo para manter o carrinho sempre acessível. */
export function Header({ cartUnits, location }: HeaderProps) {
  const { theme } = useTheme()

  return (
    <header className="sticky top-0 z-20 bg-background">
      <div className="app-container flex items-center justify-between gap-3 py-8">
        <Link to="/" className="shrink-0 rounded-sm">
          <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="Coffee Delivery, página inicial"
            width={85}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-3">
          {location && <LocationChip location={location} />}
          <ThemeToggle />
          <CartLink units={cartUnits} />
        </nav>
      </div>
    </header>
  )
}
