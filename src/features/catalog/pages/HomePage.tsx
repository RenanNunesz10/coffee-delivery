import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { useCart } from '../../cart/useCart'
import { CoffeeCatalog } from '../components/CoffeeCatalog'
import { Hero } from '../components/Hero'
import { COFFEES } from '../data/coffees'

/** Home: apresentação + catálogo conectado ao carrinho (RF-01 a RF-04). */
export function HomePage() {
  useDocumentTitle()
  const { addItem } = useCart()

  return (
    <>
      <Hero />
      <CoffeeCatalog coffees={COFFEES} onAdd={addItem} />
    </>
  )
}
