import { MapPinIcon } from '@phosphor-icons/react'

interface LocationChipProps {
  /** Ex.: "Porto Alegre, RS". */
  location: string
}

/** Chip de localização do Figma. No celular mostra só o ícone; o texto continua disponível para leitores de tela. */
export function LocationChip({ location }: LocationChipProps) {
  return (
    <p className="inline-flex h-[38px] items-center gap-1 rounded-sm bg-purple-light px-2 text-s text-purple-ink">
      <MapPinIcon size={22} weight="fill" aria-hidden="true" className="text-purple" />
      <span className="sr-only sm:not-sr-only">
        <span className="sr-only">Entrega em </span>
        {location}
      </span>
    </p>
  )
}
