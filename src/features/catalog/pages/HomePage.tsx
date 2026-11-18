import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { CoffeeCatalog } from '../components/CoffeeCatalog'
import { Hero } from '../components/Hero'
import { COFFEES } from '../data/coffees'

/** Home: apresentação + catálogo (RF-01, RF-02). A adição ao carrinho é conectada na TASK-017. */
export function HomePage() {
  useDocumentTitle()

  return (
    <>
      <Hero />
      <CoffeeCatalog coffees={COFFEES} onAdd={() => {}} />
    </>
  )
}
