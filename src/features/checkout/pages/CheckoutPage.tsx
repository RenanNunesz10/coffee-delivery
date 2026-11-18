import { zodResolver } from '@hookform/resolvers/zod'
import { ShoppingCartIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { CartItem } from '../../cart/components/CartItem'
import { CartSummary } from '../../cart/components/CartSummary'
import { useCart } from '../../cart/useCart'
import { createOrder, type CreateOrderResult } from '../../orders/orderService'
import { saveLastOrder } from '../../orders/orderStorage'
import { DeliveryAddressForm } from '../components/DeliveryAddressForm'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import {
  CHECKOUT_DEFAULT_VALUES,
  checkoutSchema,
  type CheckoutFormData,
  type CheckoutFormInput,
  toDeliveryAddress,
} from '../schemas/checkoutSchema'

const CONFIRMATION_ERRORS: Record<Exclude<CreateOrderResult, { ok: true }>['reason'], string> = {
  'empty-cart': 'Seu carrinho está vazio. Adicione cafés para confirmar o pedido.',
  'invalid-items': 'Alguns cafés do carrinho não estão mais disponíveis. Remova-os para continuar.',
  'invalid-order': 'Não foi possível confirmar o pedido. Revise os dados e tente novamente.',
}

/** Checkout (RF-05, RF-08 a RF-11): revisão do carrinho, endereço, pagamento e confirmação. */
export function CheckoutPage() {
  useDocumentTitle('Checkout')
  const cart = useCart()
  const navigate = useNavigate()
  const [confirmationError, setConfirmationError] = useState<string | null>(null)
  const form = useForm<CheckoutFormInput, unknown, CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: CHECKOUT_DEFAULT_VALUES,
  })
  const { isSubmitting, isSubmitted, isValid } = form.formState

  // Carrinho vazio: não há pedido possível (RF-11, RN-09).
  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl pt-8">
        <EmptyState
          icon={ShoppingCartIcon}
          headingLevel={1}
          title="Seu carrinho está vazio"
          description="Escolha seus cafés favoritos no catálogo para montar o pedido."
          actionLabel="Ver cafés"
          actionTo="/"
        />
      </div>
    )
  }

  /**
   * Confirmação (RF-12, RF-13, RN-06, RN-10). Só roda com o formulário válido, mas revalida
   * carrinho, itens e endereço em createOrder: não confia apenas no estado do botão.
   * Ordem importa: o snapshot é salvo ANTES de limpar o carrinho.
   */
  function handleConfirm(data: CheckoutFormData) {
    const result = createOrder({
      items: cart.items,
      address: toDeliveryAddress(data),
      paymentMethod: data.paymentMethod,
    })

    if (!result.ok) {
      setConfirmationError(CONFIRMATION_ERRORS[result.reason])
      return
    }

    setConfirmationError(null)
    // Se o storage estiver indisponível, o snapshot ainda segue pelo estado da navegação.
    saveLastOrder(result.order)
    cart.clearCart()
    navigate('/success', { replace: true, state: { order: result.order } })
  }

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleConfirm)}
        aria-label="Finalizar pedido"
        className="grid gap-8 pt-2 lg:grid-cols-[minmax(0,40rem)_minmax(0,28rem)] lg:justify-between"
      >
        <div className="min-w-0">
          <h1 className="text-title-xs text-base-subtitle">Complete seu pedido</h1>
          <div className="mt-4 flex flex-col gap-3">
            <DeliveryAddressForm />
            <PaymentMethodSelector />
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="text-title-xs text-base-subtitle">Cafés selecionados</h2>
          <section aria-label="Resumo do pedido" className="mt-4 rounded-cart bg-base-card p-6 sm:p-10">
            <ul aria-label="Cafés selecionados">
              {cart.detailedItems.map((item) => (
                <CartItem
                  key={item.coffee.id}
                  item={item}
                  onIncrease={() => cart.incrementItem(item.coffee.id)}
                  onDecrease={() => cart.decrementItem(item.coffee.id)}
                  onRemove={() => cart.removeItem(item.coffee.id)}
                />
              ))}
            </ul>

            {(confirmationError || (isSubmitted && !isValid)) && (
              <p role="alert" className="mt-6 flex items-center gap-2 text-s text-danger">
                <WarningCircleIcon size={18} weight="fill" aria-hidden="true" className="shrink-0" />
                {confirmationError ?? 'Revise os campos destacados para confirmar o pedido.'}
              </p>
            )}

            <CartSummary
              subtotalCents={cart.subtotalCents}
              deliveryFeeCents={cart.deliveryFeeCents}
              totalCents={cart.totalCents}
              isSubmitting={isSubmitting}
            />
          </section>
        </div>
      </form>
    </FormProvider>
  )
}
