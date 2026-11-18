import { useEffect } from 'react'

const APP_NAME = 'Coffee Delivery'

/** Atualiza o título da aba a cada página, o que também ajuda leitores de tela a perceber a navegação. */
export function useDocumentTitle(pageTitle?: string) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | ${APP_NAME}` : APP_NAME
  }, [pageTitle])
}
