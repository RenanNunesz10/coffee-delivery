import { useDocumentTitle } from '../../../hooks/useDocumentTitle'

export function SuccessPage() {
  useDocumentTitle('Pedido confirmado')

  return <h1 className="text-title-l text-yellow-dark">Uhu! Pedido confirmado</h1>
}
