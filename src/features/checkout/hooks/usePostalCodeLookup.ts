import { useCallback, useEffect, useRef, useState } from 'react'
import { lookupPostalCode, type PostalCodeLookupResult } from '../services/viacep'

export type PostalCodeLookupStatus = 'idle' | 'loading' | 'success' | 'not-found' | 'error'

type SettledResult = Exclude<PostalCodeLookupResult, { status: 'aborted' }>

function toStatus(result: SettledResult): PostalCodeLookupStatus {
  switch (result.status) {
    case 'success':
      return 'success'
    case 'not-found':
      return 'not-found'
    case 'error':
      return 'error'
    case 'invalid':
      return 'idle'
  }
}

/**
 * Orquestra a consulta de CEP para a interface (RN-07):
 * guarda o status para feedback, cancela a consulta anterior quando uma nova começa
 * (evita respostas fora de ordem) e cancela tudo ao desmontar.
 */
export function usePostalCodeLookup(lookup: typeof lookupPostalCode = lookupPostalCode) {
  const [status, setStatus] = useState<PostalCodeLookupStatus>('idle')
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => () => controllerRef.current?.abort(), [])

  /** Resolve com o resultado, ou `null` se a consulta foi substituída por outra mais nova. */
  const lookupAddress = useCallback(
    async (cep: string): Promise<SettledResult | null> => {
      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller
      setStatus('loading')

      const result = await lookup(cep, { signal: controller.signal })
      if (result.status === 'aborted' || controllerRef.current !== controller) return null

      controllerRef.current = null
      setStatus(toStatus(result))
      return result
    },
    [lookup],
  )

  const reset = useCallback(() => {
    controllerRef.current?.abort()
    controllerRef.current = null
    setStatus('idle')
  }, [])

  return { status, lookupAddress, reset }
}
