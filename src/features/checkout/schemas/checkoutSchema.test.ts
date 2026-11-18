import { describe, expect, it } from 'vitest'
import { checkoutSchema, toDeliveryAddress, type CheckoutFormInput } from './checkoutSchema'

const valid: CheckoutFormInput = {
  postalCode: '90250-440',
  street: 'Rua João Daniel Martinelli',
  number: '102',
  complement: '',
  district: 'Farrapos',
  city: 'Porto Alegre',
  state: 'RS',
  paymentMethod: 'credit',
}

function errorsFor(input: Partial<Record<keyof CheckoutFormInput, unknown>>) {
  const result = checkoutSchema.safeParse({ ...valid, ...input })
  return result.success ? {} : Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]))
}

describe('checkoutSchema', () => {
  it('aceita o endereço do Figma e normaliza os valores', () => {
    const result = checkoutSchema.parse(valid)

    expect(result.postalCode).toBe('90250440')
    expect(result.complement).toBeUndefined()
    expect(toDeliveryAddress(result)).toEqual({
      postalCode: '90250440',
      street: 'Rua João Daniel Martinelli',
      number: '102',
      district: 'Farrapos',
      city: 'Porto Alegre',
      state: 'RS',
    })
  })

  it('mantém o complemento quando informado (opcional)', () => {
    expect(checkoutSchema.parse({ ...valid, complement: ' Apto 3 ' }).complement).toBe('Apto 3')
    expect(checkoutSchema.safeParse({ ...valid, complement: undefined }).success).toBe(true)
  })

  it.each(['9025044', '902504401', '', 'abcdefgh'])('rejeita CEP malformado "%s"', (postalCode) => {
    expect(errorsFor({ postalCode })).toEqual({ postalCode: 'Informe um CEP com 8 dígitos' })
  })

  it.each([
    ['street', 'Informe a rua'],
    ['number', 'Informe o número'],
    ['district', 'Informe o bairro'],
    ['city', 'Informe a cidade'],
  ] as const)('exige %s', (field, message) => {
    expect(errorsFor({ [field]: '   ' })).toEqual({ [field]: message })
  })

  it('aceita UF em minúsculas e converte para maiúsculas', () => {
    expect(checkoutSchema.parse({ ...valid, state: 'sp' }).state).toBe('SP')
  })

  it.each(['XX', 'R', 'RSS', ''])('rejeita UF inválida "%s"', (state) => {
    expect(errorsFor({ state })).toEqual({ state: 'Informe uma UF válida' })
  })

  it.each(['credit', 'debit', 'cash'])('aceita a forma de pagamento %s', (paymentMethod) => {
    expect(checkoutSchema.safeParse({ ...valid, paymentMethod }).success).toBe(true)
  })

  it.each([undefined, null, 'pix'])('exige forma de pagamento válida (recebido %s)', (paymentMethod) => {
    expect(errorsFor({ paymentMethod })).toEqual({ paymentMethod: 'Selecione uma forma de pagamento' })
  })
})
