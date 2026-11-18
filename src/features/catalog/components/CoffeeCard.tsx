import { CheckIcon, ShoppingCartSimpleIcon } from '@phosphor-icons/react'
import { useEffect, useId, useState } from 'react'
import { QuantityInput } from '../../../components/QuantityInput/QuantityInput'
import { COFFEE_TAG_LABELS, MIN_ITEM_QUANTITY } from '../../../domain/constants'
import type { Coffee } from '../../../domain/types'
import { formatCurrencyParts } from '../../../lib/formatCurrency'

interface CoffeeCardProps {
  coffee: Coffee
  onAdd: (coffeeId: Coffee['id'], quantity: number) => void
}

const ADDED_FEEDBACK_MS = 2000

/** Card do catálogo (RF-01, RF-02): escolhe a quantidade e adiciona ao carrinho. */
export function CoffeeCard({ coffee, onAdd }: CoffeeCardProps) {
  const titleId = useId()
  const [quantity, setQuantity] = useState(MIN_ITEM_QUANTITY)
  const [justAdded, setJustAdded] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const price = formatCurrencyParts(coffee.priceCents)

  useEffect(() => {
    if (!justAdded) return
    const timeout = window.setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS)
    return () => window.clearTimeout(timeout)
  }, [justAdded])

  function handleAdd() {
    onAdd(coffee.id, quantity)
    setAnnouncement(
      `${quantity} ${quantity === 1 ? 'unidade' : 'unidades'} de ${coffee.name} ${quantity === 1 ? 'adicionada' : 'adicionadas'} ao carrinho`,
    )
    setJustAdded(true)
    setQuantity(MIN_ITEM_QUANTITY)
  }

  return (
    <article
      aria-labelledby={titleId}
      className="flex w-full max-w-64 flex-col items-center rounded-card bg-base-card px-5 pb-5 text-center"
    >
      <img src={coffee.image} alt="" width={120} height={120} loading="lazy" className="-mt-5 size-30" />

      <ul aria-label="Categorias" className="mt-3 flex flex-wrap justify-center gap-1">
        {coffee.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-yellow-light px-2 py-1 text-tag text-yellow-ink uppercase">
            {COFFEE_TAG_LABELS[tag]}
          </li>
        ))}
      </ul>

      <h3 id={titleId} className="mt-4 text-title-s text-base-subtitle">
        {coffee.name}
      </h3>
      <p className="mt-2 text-s text-base-label">{coffee.description}</p>

      <div className="mt-auto flex w-full items-center justify-between gap-2 pt-8">
        <p className="text-base-text">
          <span className="text-s">{price.symbol}</span>{' '}
          <span className="font-title text-title-m">{price.amount}</span>
        </p>

        <div className="flex items-center gap-2">
          <QuantityInput
            quantity={quantity}
            itemName={coffee.name}
            onIncrease={() => setQuantity((current) => current + 1)}
            onDecrease={() => setQuantity((current) => Math.max(MIN_ITEM_QUANTITY, current - 1))}
            canDecrease={quantity > MIN_ITEM_QUANTITY}
          />
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Adicionar ${quantity} ${coffee.name} ao carrinho`}
            className="inline-flex size-[38px] items-center justify-center rounded-sm bg-purple-dark text-white transition-colors hover:bg-purple dark:hover:bg-purple-dark dark:hover:brightness-125"
          >
            {justAdded ? (
              <CheckIcon size={22} weight="bold" aria-hidden="true" />
            ) : (
              <ShoppingCartSimpleIcon size={22} weight="fill" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <p role="status" className="sr-only">
        {announcement}
      </p>
    </article>
  )
}
