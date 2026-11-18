import { useDocumentTitle } from '../../../hooks/useDocumentTitle'

export function CheckoutPage() {
  useDocumentTitle('Checkout')

  return <h1 className="text-title-xs text-base-subtitle">Complete seu pedido</h1>
}
