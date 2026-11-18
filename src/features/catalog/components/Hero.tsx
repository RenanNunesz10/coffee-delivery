import { CoffeeIcon, PackageIcon, ShoppingCartIcon, TimerIcon, type Icon } from '@phosphor-icons/react'
import heroBackground from '../../../assets/hero/hero-background.webp'
import heroIllustration from '../../../assets/hero/hero-illustration.svg'

interface Benefit {
  label: string
  icon: Icon
  /** Classe de fundo do círculo (cores do Figma). */
  circleClass: string
}

const BENEFITS: readonly Benefit[] = [
  { label: 'Compra simples e segura', icon: ShoppingCartIcon, circleClass: 'bg-yellow-dark' },
  { label: 'Embalagem mantém o café intacto', icon: PackageIcon, circleClass: 'bg-base-text' },
  { label: 'Entrega rápida e rastreada', icon: TimerIcon, circleClass: 'bg-yellow' },
  { label: 'O café chega fresquinho até você', icon: CoffeeIcon, circleClass: 'bg-purple' },
]

/** Seção de apresentação da Home (Figma: frame Home, topo). */
export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="relative isolate py-10 lg:py-24">
      {/* Fundo desfocado do Figma, com bordas suavizadas para não criar corte visível. */}
      <img
        src={heroBackground}
        alt=""
        className="pointer-events-none absolute inset-0 -z-10 size-full object-cover opacity-80 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)] dark:opacity-20"
      />

      <div className="grid items-center gap-10 lg:grid-cols-[1fr_29.75rem] lg:gap-14">
        <div>
          <h1 className="text-title-l text-base-title lg:text-title-xl">
            Encontre o café perfeito para qualquer hora do dia
          </h1>
          <p className="mt-4 text-l text-base-subtitle">
            Com o Coffee Delivery você recebe seu café onde estiver, a qualquer hora
          </p>

          <ul className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:mt-16">
            {BENEFITS.map(({ label, icon: BenefitIcon, circleClass }) => (
              <li key={label} className="flex items-center gap-3 text-m text-base-text">
                {/* Ícones decorativos: o texto ao lado comunica a informação. */}
                <span
                  aria-hidden="true"
                  className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-background ${circleClass}`}
                >
                  <BenefitIcon size={16} weight="fill" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={heroIllustration}
          alt=""
          width={476}
          height={360}
          className="mx-auto w-full max-w-[29.75rem]"
        />
      </div>
    </section>
  )
}
