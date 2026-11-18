import { useId, type ComponentProps, type ReactNode } from 'react'

interface TextFieldProps extends Omit<ComponentProps<'input'>, 'placeholder'> {
  /** Nome do campo: usado como label (para leitores de tela) e como placeholder visível, como no Figma. */
  label: string
  error?: string
  /** Exibe o selo "Opcional" dentro do campo (Figma: Input Text). */
  optional?: boolean
  /** Conteúdo à direita dentro do campo (ex.: indicador de carregamento). */
  endAdornment?: ReactNode
  containerClassName?: string
}

/**
 * Campo de texto do Figma com acessibilidade: label associado, erro ligado por
 * aria-describedby e aria-invalid. O erro aparece em texto, não só pela cor da borda.
 * React 19: `ref` chega como prop comum, então funciona com `register()` do React Hook Form.
 */
export function TextField({
  label,
  error,
  optional = false,
  endAdornment,
  containerClassName = '',
  id,
  className = '',
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-erro`

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className="sr-only">
        {label}
        {optional && ' (opcional)'}
      </label>
      <div className="relative">
        <input
          id={inputId}
          placeholder={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`h-[42px] w-full rounded-sm border border-base-button bg-base-input p-3 text-s text-base-text transition-colors placeholder:text-base-label focus:border-yellow-dark aria-[invalid=true]:border-danger ${optional || endAdornment ? 'pr-20' : ''} ${className}`}
          {...inputProps}
        />
        {(optional || endAdornment) && (
          <span className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2 text-xs font-normal text-base-label italic">
            {endAdornment}
            {optional && <span aria-hidden="true">Opcional</span>}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs font-normal text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
