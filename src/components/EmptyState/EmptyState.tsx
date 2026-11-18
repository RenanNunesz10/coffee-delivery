import type { Icon } from '@phosphor-icons/react'
import { Link } from 'react-router'

interface EmptyStateProps {
  icon: Icon
  title: string
  description: string
  actionLabel: string
  actionTo: string
  /** Nível do título, conforme a hierarquia da página. */
  headingLevel?: 1 | 2
}

/** Estado vazio com caminho de volta (RN-09): carrinho vazio e sucesso sem pedido. */
export function EmptyState({ icon: StateIcon, title, description, actionLabel, actionTo, headingLevel = 2 }: EmptyStateProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'

  return (
    <div className="flex flex-col items-center gap-4 rounded-card bg-base-card px-6 py-12 text-center">
      <span
        aria-hidden="true"
        className="inline-flex size-16 items-center justify-center rounded-full bg-yellow-light text-yellow-ink"
      >
        <StateIcon size={32} weight="fill" />
      </span>
      <Heading className="text-title-s text-base-subtitle">{title}</Heading>
      <p className="max-w-sm text-m text-base-text">{description}</p>
      <Link
        to={actionTo}
        className="mt-2 inline-flex items-center justify-center rounded-sm bg-yellow px-6 py-3 text-button-g text-on-yellow uppercase transition-colors hover:bg-yellow-dark"
      >
        {actionLabel}
      </Link>
    </div>
  )
}
