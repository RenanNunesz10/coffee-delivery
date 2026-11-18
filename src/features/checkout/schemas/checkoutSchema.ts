import { z } from 'zod'
import { BRAZILIAN_STATES, PAYMENT_METHODS, POSTAL_CODE_LENGTH } from '../../../domain/constants'
import type { DeliveryAddress } from '../../../domain/types'
import { normalizePostalCode } from '../../../lib/postalCode'

const requiredText = (message: string) => z.string().trim().min(1, message)

/**
 * Validação do checkout (RF-08, RF-09, RF-11, RN-07). A validação do CEP é sintática;
 * a existência do CEP é verificada pela consulta à ViaCEP.
 * Reutiliza as listas de constants.ts, as mesmas que definem os tipos de domínio.
 */
export const checkoutSchema = z.object({
  postalCode: z
    .string()
    .transform(normalizePostalCode)
    .pipe(z.string().length(POSTAL_CODE_LENGTH, `Informe um CEP com ${POSTAL_CODE_LENGTH} dígitos`)),
  street: requiredText('Informe a rua'),
  number: requiredText('Informe o número').max(10, 'Use no máximo 10 caracteres'),
  complement: z
    .string()
    .trim()
    .max(60, 'Use no máximo 60 caracteres')
    .optional()
    .transform((value) => value || undefined),
  district: requiredText('Informe o bairro'),
  city: requiredText('Informe a cidade'),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .pipe(z.enum(BRAZILIAN_STATES, { error: 'Informe uma UF válida' })),
  paymentMethod: z.enum(PAYMENT_METHODS, { error: 'Selecione uma forma de pagamento' }),
})

/** Valores como estão nos campos do formulário. */
export type CheckoutFormInput = z.input<typeof checkoutSchema>
/** Valores já validados e normalizados. */
export type CheckoutFormData = z.output<typeof checkoutSchema>

export const CHECKOUT_DEFAULT_VALUES: Partial<CheckoutFormInput> = {
  postalCode: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
}

export function toDeliveryAddress(data: CheckoutFormData): DeliveryAddress {
  const { postalCode, street, number, complement, district, city, state } = data
  return { postalCode, street, number, ...(complement ? { complement } : {}), district, city, state }
}
