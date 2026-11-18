import { BankIcon, CreditCardIcon, CurrencyDollarIcon, MoneyIcon, type Icon } from '@phosphor-icons/react'
import { useFormContext } from 'react-hook-form'
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from '../../../domain/constants'
import type { PaymentMethod } from '../../../domain/types'
import type { CheckoutFormData, CheckoutFormInput } from '../schemas/checkoutSchema'

const PAYMENT_ICONS: Record<PaymentMethod, Icon> = {
  credit: CreditCardIcon,
  debit: BankIcon,
  cash: MoneyIcon,
}

const ERROR_ID = 'pagamento-erro'

/**
 * Escolha informativa da forma de pagamento (RF-09, RN-05): nenhum dado de cartão é solicitado
 * e nenhuma transação acontece. Rádios nativos garantem teclado (setas) e leitores de tela.
 */
export function PaymentMethodSelector() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormInput, unknown, CheckoutFormData>()
  const error = errors.paymentMethod?.message

  return (
    <section aria-labelledby="pagamento-titulo" className="rounded-sm bg-base-card p-6 sm:p-10">
      <div className="flex gap-2">
        <CurrencyDollarIcon size={22} aria-hidden="true" className="shrink-0 text-purple" />
        <div>
          <h2 id="pagamento-titulo" className="font-sans text-m text-base-subtitle">
            Pagamento
          </h2>
          <p className="text-s text-base-text">O pagamento é feito na entrega. Escolha a forma que deseja pagar</p>
        </div>
      </div>

      <fieldset aria-describedby={error ? ERROR_ID : undefined} className="mt-8">
        <legend className="sr-only">Forma de pagamento</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {PAYMENT_METHODS.map((method) => {
            const MethodIcon = PAYMENT_ICONS[method]
            return (
              <label
                key={method}
                className="flex cursor-pointer items-center gap-3 rounded-sm border border-transparent bg-base-button p-4 text-button-m text-base-text uppercase transition-colors hover:bg-base-hover has-checked:border-purple has-checked:bg-purple-light has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus has-focus-visible:outline-solid"
              >
                <input type="radio" value={method} className="sr-only" {...register('paymentMethod')} />
                <MethodIcon size={16} aria-hidden="true" className="shrink-0 text-purple" />
                {PAYMENT_METHOD_LABELS[method]}
              </label>
            )
          })}
        </div>
        {error && (
          <p id={ERROR_ID} className="mt-3 text-xs font-normal text-danger">
            {error}
          </p>
        )}
      </fieldset>
    </section>
  )
}
