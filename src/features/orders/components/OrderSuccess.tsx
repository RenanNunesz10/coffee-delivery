import { CurrencyDollarIcon, MapPinIcon, TimerIcon, type Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import deliveryIllustration from '../../../assets/illustrations/delivery-success.svg'
import { DELIVERY_ESTIMATE, PAYMENT_METHOD_LABELS } from '../../../domain/constants'
import type { Order } from '../../../domain/types'

interface InfoRowProps {
  icon: Icon
  circleClass: string
  children: ReactNode
}

function InfoRow({ icon: RowIcon, circleClass, children }: InfoRowProps) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-background ${circleClass}`}
      >
        <RowIcon size={16} weight="fill" />
      </span>
      <p className="text-m text-base-text">{children}</p>
    </li>
  )
}

/** Confirmação do pedido (Figma: frame Sucesso). Exibe somente dados do snapshot (RF-12). */
export function OrderSuccess({ order }: { order: Order }) {
  const { address } = order
  const streetLine = [`${address.street}, ${address.number}`, address.complement].filter(Boolean).join(' - ')

  return (
    <div className="grid items-end gap-10 pt-6 lg:grid-cols-[minmax(0,32.875rem)_1fr] lg:gap-24 lg:pt-12">
      <div>
        <h1 className="text-title-l text-yellow-dark">Uhu! Pedido confirmado</h1>
        <p className="mt-1 text-l text-base-subtitle">Agora é só aguardar que logo o café chegará até você</p>

        <div className="border-gradient mt-10 rounded-card">
          <ul aria-label="Detalhes do pedido" className="flex flex-col gap-8 p-6 sm:p-10">
            <InfoRow icon={MapPinIcon} circleClass="bg-purple">
              Entrega em <strong>{streetLine}</strong>
              <br />
              {address.district} - {address.city}, {address.state}
            </InfoRow>
            <InfoRow icon={TimerIcon} circleClass="bg-yellow">
              Previsão de entrega
              <br />
              <strong>{DELIVERY_ESTIMATE}</strong>
            </InfoRow>
            <InfoRow icon={CurrencyDollarIcon} circleClass="bg-yellow-dark">
              Pagamento na entrega
              <br />
              <strong>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</strong>
            </InfoRow>
          </ul>
        </div>
      </div>

      <img src={deliveryIllustration} alt="" width={492} height={293} className="mx-auto w-full max-w-[30.75rem]" />
    </div>
  )
}
