import { z } from 'zod'
import { BRAZILIAN_STATES } from '../../../domain/constants'
import type { DeliveryAddress } from '../../../domain/types'
import { isCompletePostalCode, normalizePostalCode } from '../../../lib/postalCode'

/*
 * Cliente da ViaCEP (RF-08, RN-07). Integração real em execução; nos testes o `fetch` é simulado.
 * Nunca lança exceção: cada situação vira um resultado tipado que a interface sabe comunicar.
 */

export const VIACEP_TIMEOUT_MS = 8000

export type PostalCodeAddress = Pick<DeliveryAddress, 'postalCode' | 'street' | 'district' | 'city' | 'state'>

export type PostalCodeLookupError = 'network' | 'timeout' | 'http' | 'invalid-response'

export type PostalCodeLookupResult =
  | { status: 'success'; address: PostalCodeAddress }
  /** CEP sem 8 dígitos: nenhuma requisição é feita. */
  | { status: 'invalid' }
  /** CEP com formato válido, mas inexistente (`erro: true` ou HTTP 400). */
  | { status: 'not-found' }
  | { status: 'error'; reason: PostalCodeLookupError }
  /** Cancelada pelo chamador (ex.: o usuário digitou outro CEP); não deve ser exibida como erro. */
  | { status: 'aborted' }

interface LookupOptions {
  signal?: AbortSignal
  timeoutMs?: number
  fetchFn?: typeof fetch
}

const notFoundSchema = z.object({ erro: z.union([z.literal(true), z.literal('true')]) })

/** Contrato mínimo da resposta de sucesso; campos podem vir vazios (ex.: CEP geral de cidade). */
const viaCepResponseSchema = z.object({
  cep: z.string(),
  logradouro: z.string(),
  bairro: z.string(),
  localidade: z.string(),
  uf: z.enum(BRAZILIAN_STATES),
})

export function buildViaCepUrl(postalCode: string): string {
  return `https://viacep.com.br/ws/${normalizePostalCode(postalCode)}/json/`
}

export async function lookupPostalCode(cep: string, options: LookupOptions = {}): Promise<PostalCodeLookupResult> {
  const { signal, timeoutMs = VIACEP_TIMEOUT_MS, fetchFn = fetch } = options

  if (!isCompletePostalCode(cep)) return { status: 'invalid' }
  if (signal?.aborted) return { status: 'aborted' }

  // Um único AbortController atende ao timeout e ao cancelamento externo.
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  const abortFromCaller = () => controller.abort()
  signal?.addEventListener('abort', abortFromCaller, { once: true })

  const failure = (reason: PostalCodeLookupError): PostalCodeLookupResult => {
    if (timedOut) return { status: 'error', reason: 'timeout' }
    if (signal?.aborted) return { status: 'aborted' }
    return { status: 'error', reason }
  }

  try {
    let response: Response
    try {
      response = await fetchFn(buildViaCepUrl(cep), {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })
    } catch {
      return failure('network')
    }

    if (response.status === 400) return { status: 'not-found' }
    if (!response.ok) return failure('http')

    let body: unknown
    try {
      body = await response.json()
    } catch {
      return failure('invalid-response')
    }

    if (notFoundSchema.safeParse(body).success) return { status: 'not-found' }

    const parsed = viaCepResponseSchema.safeParse(body)
    if (!parsed.success) return failure('invalid-response')

    const { logradouro, bairro, localidade, uf } = parsed.data
    return {
      status: 'success',
      address: {
        postalCode: normalizePostalCode(cep),
        street: logradouro,
        district: bairro,
        city: localidade,
        state: uf,
      },
    }
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abortFromCaller)
  }
}
