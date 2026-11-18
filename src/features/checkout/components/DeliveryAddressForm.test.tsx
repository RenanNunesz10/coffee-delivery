import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { FIGMA_VIACEP_RESPONSE, OTHER_VIACEP_RESPONSE, mockViaCep } from '../../../tests/viacepMock'
import {
  CHECKOUT_DEFAULT_VALUES,
  checkoutSchema,
  type CheckoutFormData,
  type CheckoutFormInput,
} from '../schemas/checkoutSchema'
import { DeliveryAddressForm } from './DeliveryAddressForm'

function TestForm({ onValid }: { onValid: (data: CheckoutFormData) => void }) {
  const form = useForm<CheckoutFormInput, unknown, CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { ...CHECKOUT_DEFAULT_VALUES, paymentMethod: 'cash' },
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)} noValidate>
        <DeliveryAddressForm />
        <button type="submit">Enviar</button>
      </form>
    </FormProvider>
  )
}

function setup() {
  const onValid = vi.fn()
  render(<TestForm onValid={onValid} />)
  return { onValid, user: userEvent.setup() }
}

const field = (name: string) => screen.getByLabelText(name, { exact: false }) as HTMLInputElement

describe('DeliveryAddressForm', () => {
  it('consulta a ViaCEP e preenche rua, bairro, cidade e UF (RF-08)', async () => {
    const fetchMock = mockViaCep({ '90250440': { body: FIGMA_VIACEP_RESPONSE } })
    const { user } = setup()

    await user.type(field('CEP'), '90250440')

    expect(field('CEP')).toHaveValue('90250-440')
    expect(await screen.findByText('Endereço encontrado. Confira os dados e informe o número.')).toBeInTheDocument()
    expect(field('Rua')).toHaveValue('Rua João Daniel Martinelli')
    expect(field('Bairro')).toHaveValue('Farrapos')
    expect(field('Cidade')).toHaveValue('Porto Alegre')
    expect(field('UF')).toHaveValue('RS')
    expect(field('Número')).toHaveFocus()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('preserva número e complemento digitados antes (RN-07)', async () => {
    mockViaCep({ '90250440': { body: FIGMA_VIACEP_RESPONSE } })
    const { user } = setup()
    await user.type(field('Número'), '102')
    await user.type(field('Complemento'), 'Apto 3')

    await user.type(field('CEP'), '90250440')
    await screen.findByText(/Endereço encontrado/)

    expect(field('Número')).toHaveValue('102')
    expect(field('Complemento')).toHaveValue('Apto 3')
  })

  it('substitui o endereço ao consultar outro CEP', async () => {
    mockViaCep({ '90250440': { body: FIGMA_VIACEP_RESPONSE }, '01001000': { body: OTHER_VIACEP_RESPONSE } })
    const { user } = setup()
    await user.type(field('CEP'), '90250440')
    await screen.findByText(/Endereço encontrado/)

    await user.clear(field('CEP'))
    await user.type(field('CEP'), '01001000')

    expect(await screen.findByDisplayValue('Praça da Sé')).toBeInTheDocument()
    expect(field('Cidade')).toHaveValue('São Paulo')
    expect(field('UF')).toHaveValue('SP')
  })

  it('limpa o endereço do CEP anterior quando o novo não é encontrado', async () => {
    mockViaCep({ '90250440': { body: FIGMA_VIACEP_RESPONSE } })
    const { user } = setup()
    await user.type(field('CEP'), '90250440')
    await screen.findByText(/Endereço encontrado/)

    await user.clear(field('CEP'))
    await user.type(field('CEP'), '99999999')

    expect(await screen.findByText(/CEP não encontrado/)).toBeInTheDocument()
    expect(field('Rua')).toHaveValue('')
    expect(field('Cidade')).toHaveValue('')
  })

  it('comunica falha na consulta e permite preencher manualmente', async () => {
    mockViaCep({ '90250440': 'network-error' })
    const { user, onValid } = setup()

    await user.type(field('CEP'), '90250440')
    expect(
      await screen.findByText('Não foi possível consultar o CEP agora. Preencha o endereço manualmente.'),
    ).toBeInTheDocument()

    await user.type(field('Rua'), 'Rua Manual')
    await user.type(field('Número'), '10')
    await user.type(field('Bairro'), 'Centro')
    await user.type(field('Cidade'), 'Porto Alegre')
    await user.type(field('UF'), 'rs')
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(onValid).toHaveBeenCalledWith(
      expect.objectContaining({ postalCode: '90250440', street: 'Rua Manual', state: 'RS' }),
      expect.anything(),
    )
  })

  it('não consulta CEP incompleto e mostra erro acessível ao enviar', async () => {
    const fetchMock = mockViaCep()
    const { user, onValid } = setup()

    await user.type(field('CEP'), '1234')
    await user.tab()
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(onValid).not.toHaveBeenCalled()
    const cep = field('CEP')
    expect(cep).toHaveAttribute('aria-invalid', 'true')
    expect(cep).toHaveAccessibleDescription('Informe um CEP com 8 dígitos')
    expect(field('Rua')).toHaveAccessibleDescription('Informe a rua')
    expect(field('Complemento')).not.toHaveAttribute('aria-invalid')
  })

  it('anuncia o carregamento enquanto consulta', async () => {
    let release: (response: Response) => void = () => {}
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>((resolve) => (release = resolve))),
    )
    const { user } = setup()

    await user.type(field('CEP'), '90250440')

    expect(screen.getByRole('status')).toHaveTextContent('Buscando endereço pelo CEP…')
    release(new Response(JSON.stringify(FIGMA_VIACEP_RESPONSE)))
    expect(await screen.findByText(/Endereço encontrado/)).toBeInTheDocument()
  })
})
