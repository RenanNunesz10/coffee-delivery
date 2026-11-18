import { useDocumentTitle } from '../../../hooks/useDocumentTitle'

export function HomePage() {
  useDocumentTitle()

  return (
    <section aria-labelledby="catalogo-titulo">
      <h1 id="catalogo-titulo" className="text-title-l text-base-subtitle">
        Nossos cafés
      </h1>
    </section>
  )
}
