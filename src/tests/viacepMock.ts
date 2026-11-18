import { vi } from 'vitest'

export const FIGMA_VIACEP_RESPONSE = {
  cep: '90250-440',
  logradouro: 'Rua João Daniel Martinelli',
  complemento: '',
  bairro: 'Farrapos',
  localidade: 'Porto Alegre',
  uf: 'RS',
}

export const OTHER_VIACEP_RESPONSE = {
  cep: '01001-000',
  logradouro: 'Praça da Sé',
  complemento: 'lado ímpar',
  bairro: 'Sé',
  localidade: 'São Paulo',
  uf: 'SP',
}

type Behavior = 'network-error' | 'not-found' | { body: unknown; status?: number }

/**
 * Substitui o fetch global por respostas da ViaCEP por CEP (8 dígitos).
 * CEPs não mapeados respondem `{ erro: "true" }`, como a API real.
 */
export function mockViaCep(behaviors: Record<string, Behavior> = {}) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const cep = String(input).match(/ws\/(\d{8})\/json/)?.[1] ?? ''
    const behavior = behaviors[cep] ?? 'not-found'

    if (behavior === 'network-error') throw new TypeError('Failed to fetch')
    if (behavior === 'not-found') return new Response(JSON.stringify({ erro: 'true' }), { status: 200 })
    return new Response(JSON.stringify(behavior.body), { status: behavior.status ?? 200 })
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
