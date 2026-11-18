import { Outlet, ScrollRestoration } from 'react-router'
import { Header } from '../Header/Header'

/** Estrutura comum das rotas: link de pular, Header e conteúdo da página (RF-07). */
export function PageLayout() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only rounded-sm bg-purple-dark px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="app-container pb-16 outline-none">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  )
}
