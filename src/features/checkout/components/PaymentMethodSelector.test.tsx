import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { checkoutSchema, type CheckoutFormData, type CheckoutFormInput } from '../schemas/checkoutSchema'
import { PaymentMethodSelector } from './PaymentMethodSelector'

/** Endereço válido pré-preenchido: o teste isola a validação do pagamento. */
const ADDRESS: Partial<CheckoutFormInput> = {
  postalCode: '90250440',
  street: 'Rua João Daniel Martinelli',
  number: '102',
  district: 'Farrapos',
  city: 'Porto Alegre',
  state: 'RS',
}

function TestForm({ onValid }: { onValid: (data: CheckoutFormData) => void }) {
  const form = useForm<CheckoutFormInput, unknown, CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: ADDRESS,
  })
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)} noValidate>
        <PaymentMethodSelector />
        <button type="submit">Enviar</button>
      </form>
    </FormProvider>
  )
}

function setup() {
  const onValid = vi.fn()
  render(<TestForm onValid={onValid} />)
  return { onValid, user: userEvent.setup(), group: screen.getByRole('group', { name: 'Forma de pagamento' }) }
}

describe('PaymentMethodSelector', () => {
  it('oferece as três opções sem nenhuma selecionada', () => {
    const { group } = setup()
    const radios = within(group).getAllByRole('radio')

    expect(radios.map((radio) => radio.closest('label')?.textContent)).toEqual([
      'Cartão de crédito',
      'Cartão de débito',
      'Dinheiro',
    ])
    radios.forEach((radio) => expect(radio).not.toBeChecked())
  })

  it('exige uma forma de pagamento (RF-09, RF-11)', async () => {
    const { user, onValid, group } = setup()

    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(onValid).not.toHaveBeenCalled()
    expect(group).toHaveAccessibleDescription('Selecione uma forma de pagamento')
  })

  it.each([
    ['Cartão de crédito', 'credit'],
    ['Cartão de débito', 'debit'],
    ['Dinheiro', 'cash'],
  ])('aceita "%s"', async (label, value) => {
    const { user, onValid } = setup()

    await user.click(screen.getByRole('radio', { name: label }))
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(screen.getByRole('radio', { name: label })).toBeChecked()
    expect(onValid).toHaveBeenCalledWith(expect.objectContaining({ paymentMethod: value }), expect.anything())
  })

  it('troca a opção pelas setas do teclado', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('radio', { name: 'Cartão de crédito' }))

    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('radio', { name: 'Cartão de débito' })).toBeChecked()
  })

  it('não solicita nenhum dado de cartão (RN-05)', () => {
    const { group } = setup()

    expect(within(group).queryAllByRole('textbox')).toHaveLength(0)
    expect(screen.queryByLabelText(/número do cartão|cvv|validade/i)).not.toBeInTheDocument()
  })
})
