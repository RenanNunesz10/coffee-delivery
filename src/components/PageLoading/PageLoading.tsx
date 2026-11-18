import { CircleNotchIcon } from '@phosphor-icons/react'

/** Exibido enquanto o código de uma rota carregada sob demanda é baixado. */
export function PageLoading() {
  return (
    <p role="status" className="flex items-center justify-center gap-2 py-24 text-m text-base-text">
      <CircleNotchIcon size={24} className="animate-spin text-purple" aria-hidden="true" />
      Carregando…
    </p>
  )
}
