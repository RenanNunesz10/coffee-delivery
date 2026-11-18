import { CircleNotchIcon, MapPinLineIcon } from '@phosphor-icons/react'
import { useRef, type ChangeEvent, type FocusEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import { TextField } from '../../../components/TextField/TextField'
import { formatPostalCode, isCompletePostalCode, normalizePostalCode } from '../../../lib/postalCode'
import { usePostalCodeLookup, type PostalCodeLookupStatus } from '../hooks/usePostalCodeLookup'
import type { CheckoutFormData, CheckoutFormInput } from '../schemas/checkoutSchema'

/** Campos que a ViaCEP preenche. Número e complemento nunca são tocados (RN-07). */
const DERIVED_FIELDS = ['street', 'district', 'city', 'state'] as const

const STATUS_MESSAGES: Record<Exclude<PostalCodeLookupStatus, 'idle'>, string> = {
  loading: 'Buscando endereço pelo CEP…',
  success: 'Endereço encontrado. Confira os dados e informe o número.',
  'not-found': 'CEP não encontrado. Confira o número ou preencha o endereço manualmente.',
  error: 'Não foi possível consultar o CEP agora. Preencha o endereço manualmente.',
}

/** Formulário de endereço com consulta à ViaCEP (RF-08, RN-07). Usa o formulário do CheckoutPage via contexto. */
export function DeliveryAddressForm() {
  const {
    register,
    setValue,
    getValues,
    setFocus,
    formState: { errors },
  } = useFormContext<CheckoutFormInput, unknown, CheckoutFormData>()
  const { status, lookupAddress } = usePostalCodeLookup()
  /** Último CEP consultado com resposta definitiva (encontrado ou inexistente). */
  const lastSettledCep = useRef<string | null>(null)
  /** Indica se os campos derivados vieram da API (e não do usuário). */
  const hasAutofilledFields = useRef(false)

  async function searchAddress(rawCep: string) {
    const cep = normalizePostalCode(rawCep)
    if (!isCompletePostalCode(cep) || cep === lastSettledCep.current) return

    // Um CEP novo não pode herdar o endereço preenchido para o CEP anterior.
    if (hasAutofilledFields.current) {
      DERIVED_FIELDS.forEach((field) => setValue(field, ''))
      hasAutofilledFields.current = false
    }

    const result = await lookupAddress(cep)
    // Ignora respostas de um CEP que o usuário já alterou.
    if (!result || normalizePostalCode(getValues('postalCode')) !== cep) return

    if (result.status === 'success' || result.status === 'not-found') lastSettledCep.current = cep
    if (result.status !== 'success') return

    const { address } = result
    DERIVED_FIELDS.forEach((field) => {
      const value = address[field]
      setValue(field, value, { shouldDirty: true, shouldValidate: value !== '' })
    })
    hasAutofilledFields.current = true
    // CEP geral (sem logradouro) exige completar a rua; senão, segue para o número.
    setFocus(address.street ? 'number' : 'street')
  }

  const postalCodeField = register('postalCode', {
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      const masked = formatPostalCode(event.target.value)
      setValue('postalCode', masked)
      void searchAddress(masked)
    },
    onBlur: (event: FocusEvent<HTMLInputElement>) => void searchAddress(event.target.value),
  })

  const isLoading = status === 'loading'
  const statusTone = status === 'not-found' || status === 'error' ? 'text-danger' : 'text-base-text'

  return (
    <section aria-labelledby="endereco-titulo" aria-busy={isLoading} className="rounded-sm bg-base-card p-6 sm:p-10">
      <div className="flex gap-2">
        <MapPinLineIcon size={22} aria-hidden="true" className="shrink-0 text-yellow-dark" />
        <div>
          <h2 id="endereco-titulo" className="font-sans text-m text-base-subtitle">
            Endereço de Entrega
          </h2>
          <p className="text-s text-base-text">Informe o endereço onde deseja receber seu pedido</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-[12.5rem_1fr_3.75rem] sm:gap-x-3">
        <TextField
          label="CEP"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={9}
          error={errors.postalCode?.message}
          endAdornment={
            isLoading ? <CircleNotchIcon size={18} className="animate-spin text-purple" aria-hidden="true" /> : undefined
          }
          containerClassName="sm:col-span-1"
          {...postalCodeField}
        />
        <p role="status" aria-live="polite" className={`text-xs font-normal sm:col-span-2 sm:self-center ${statusTone}`}>
          {status === 'idle' ? '' : STATUS_MESSAGES[status]}
        </p>

        <TextField
          label="Rua"
          autoComplete="address-line1"
          error={errors.street?.message}
          containerClassName="sm:col-span-3"
          {...register('street')}
        />

        <TextField label="Número" error={errors.number?.message} {...register('number')} />
        <TextField
          label="Complemento"
          optional
          autoComplete="address-line2"
          error={errors.complement?.message}
          containerClassName="sm:col-span-2"
          {...register('complement')}
        />

        <TextField label="Bairro" error={errors.district?.message} {...register('district')} />
        <TextField
          label="Cidade"
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register('city')}
        />
        <TextField
          label="UF"
          autoComplete="address-level1"
          maxLength={2}
          className="uppercase"
          error={errors.state?.message}
          {...register('state')}
        />
      </div>
    </section>
  )
}
