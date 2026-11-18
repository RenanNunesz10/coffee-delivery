import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * Acessibilidade em SPA: a cada troca de rota, move o foco para o conteúdo principal
 * (sem rolar), para que teclado e leitores de tela comecem pela página nova.
 * A primeira renderização é ignorada para não roubar o foco ao abrir o site.
 */
export function useRouteFocus(targetId: string) {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    document.getElementById(targetId)?.focus({ preventScroll: true })
  }, [pathname, targetId])
}
