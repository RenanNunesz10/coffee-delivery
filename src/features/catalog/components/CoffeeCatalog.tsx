import type { Coffee } from '../../../domain/types'
import { CoffeeCard } from './CoffeeCard'

interface CoffeeCatalogProps {
  coffees: readonly Coffee[]
  onAdd: (coffeeId: Coffee['id'], quantity: number) => void
}

/** Grade responsiva de cafés (RF-01, RF-15): 1 coluna no celular até 4 no desktop. */
export function CoffeeCatalog({ coffees, onAdd }: CoffeeCatalogProps) {
  return (
    <section aria-labelledby="catalogo-titulo" className="pt-8">
      <h2 id="catalogo-titulo" className="text-title-l text-base-subtitle">
        Nossos cafés
      </h2>

      <ul className="mt-14 grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] justify-items-center gap-x-8 gap-y-10">
        {coffees.map((coffee) => (
          <li key={coffee.id} className="flex w-full justify-center">
            <CoffeeCard coffee={coffee} onAdd={onAdd} />
          </li>
        ))}
      </ul>
    </section>
  )
}
