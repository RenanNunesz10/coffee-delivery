import { MinusIcon, PlusIcon } from '@phosphor-icons/react'

interface QuantityInputProps {
  quantity: number
  /** Nome do item, usado nos rótulos acessíveis ("Aumentar quantidade de Latte"). */
  itemName: string
  onIncrease: () => void
  onDecrease: () => void
  /** Quando falso, o botão de diminuir fica desabilitado (ex.: Home não desce abaixo de 1). */
  canDecrease?: boolean
  size?: 'md' | 'sm'
}

/** Controle −/+ do Figma ("Input Number"), sem digitação livre: só produz inteiros (RF-02, RN-01). */
export function QuantityInput({
  quantity,
  itemName,
  onIncrease,
  onDecrease,
  canDecrease = true,
  size = 'md',
}: QuantityInputProps) {
  const buttonClass =
    'inline-flex size-6 items-center justify-center rounded-sm text-purple transition-colors hover:text-purple-ink disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-sm bg-base-button px-2 ${size === 'md' ? 'h-[38px]' : 'h-8'}`}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={onDecrease}
        disabled={!canDecrease}
        aria-label={`Diminuir quantidade de ${itemName}`}
      >
        <MinusIcon size={14} weight="bold" aria-hidden="true" />
      </button>
      <output aria-live="polite" aria-label={`Quantidade de ${itemName}`} className="min-w-5 text-center text-m text-base-title">
        {quantity}
      </output>
      <button
        type="button"
        className={buttonClass}
        onClick={onIncrease}
        aria-label={`Aumentar quantidade de ${itemName}`}
      >
        <PlusIcon size={14} weight="bold" aria-hidden="true" />
      </button>
    </div>
  )
}
