import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildViaCepUrl, lookupPostalCode } from './viacep'

/** Resposta real da ViaCEP para o CEP do Figma (campos relevantes). */
const FIGMA_RESPONSE = {
  cep: '90250-440',
  logradouro: 'Rua João Daniel Martinelli',
  complemento: '',
  bairro: 'Farrapos',
  localidade: 'Porto Alegre',
  uf: 'RS',
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const mockFetch = (implementation: Parameters<typeof vi.fn<typeof fetch>>[0]) => vi.fn<typeof fetch>(implementation)

/** fetch que só termina quando o sinal é abortado (simula servidor lento). */
const hangingFetch = () =>
  mockFetch(
    (_input, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
      }),
  )

afterEach(() => {
  vi.useRealTimers()
})

describe('lookupPostalCode', () => {
  it('consulta a URL da ViaCEP com o CEP normalizado', async () => {
    const fetchFn = mockFetch(async () => jsonResponse(FIGMA_RESPONSE))

    await lookupPostalCode('90250-440', { fetchFn })

    expect(fetchFn).toHaveBeenCalledWith('https://viacep.com.br/ws/90250440/json/', expect.anything())
    expect(buildViaCepUrl('90.250-440')).toBe('https://viacep.com.br/ws/90250440/json/')
  })

  it('mapeia logradouro, bairro, localidade e UF', async () => {
    const result = await lookupPostalCode('90250440', { fetchFn: mockFetch(async () => jsonResponse(FIGMA_RESPONSE)) })

    expect(result).toEqual({
      status: 'success',
      address: {
        postalCode: '90250440',
        street: 'Rua João Daniel Martinelli',
        district: 'Farrapos',
        city: 'Porto Alegre',
        state: 'RS',
      },
    })
  })

  it('aceita CEP geral com logradouro e bairro vazios', async () => {
    const generic = { ...FIGMA_RESPONSE, cep: '78890-000', logradouro: '', bairro: '', localidade: 'Sorriso', uf: 'MT' }

    const result = await lookupPostalCode('78890000', { fetchFn: mockFetch(async () => jsonResponse(generic)) })

    expect(result).toMatchObject({ status: 'success', address: { street: '', district: '', city: 'Sorriso', state: 'MT' } })
  })

  it.each(['9025044', '902504401', '', 'abcde-fgh'])('não faz requisição para CEP malformado "%s"', async (cep) => {
    const fetchFn = mockFetch(async () => jsonResponse(FIGMA_RESPONSE))

    expect(await lookupPostalCode(cep, { fetchFn })).toEqual({ status: 'invalid' })
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it.each([{ erro: true }, { erro: 'true' }])('trata %o como CEP não encontrado', async (body) => {
    expect(await lookupPostalCode('99999999', { fetchFn: mockFetch(async () => jsonResponse(body)) })).toEqual({
      status: 'not-found',
    })
  })

  it('trata HTTP 400 como CEP não encontrado', async () => {
    expect(await lookupPostalCode('00000000', { fetchFn: mockFetch(async () => jsonResponse({}, 400)) })).toEqual({
      status: 'not-found',
    })
  })

  it('trata HTTP 5xx como indisponibilidade', async () => {
    expect(await lookupPostalCode('90250440', { fetchFn: mockFetch(async () => jsonResponse({}, 503)) })).toEqual({
      status: 'error',
      reason: 'http',
    })
  })

  it('trata falha de rede', async () => {
    const fetchFn = mockFetch(async () => {
      throw new TypeError('Failed to fetch')
    })

    expect(await lookupPostalCode('90250440', { fetchFn })).toEqual({ status: 'error', reason: 'network' })
  })

  it('trata JSON inválido', async () => {
    const fetchFn = mockFetch(async () => new Response('<html>erro</html>', { status: 200 }))

    expect(await lookupPostalCode('90250440', { fetchFn })).toEqual({ status: 'error', reason: 'invalid-response' })
  })

  it.each([{ cep: '90250-440' }, { ...FIGMA_RESPONSE, uf: 'XX' }, ['lista']])(
    'trata resposta fora do contrato %o como inválida',
    async (body) => {
      expect(await lookupPostalCode('90250440', { fetchFn: mockFetch(async () => jsonResponse(body)) })).toEqual({
        status: 'error',
        reason: 'invalid-response',
      })
    },
  )

  it('interrompe após o timeout', async () => {
    vi.useFakeTimers()
    const promise = lookupPostalCode('90250440', { fetchFn: hangingFetch(), timeoutMs: 8000 })

    await vi.advanceTimersByTimeAsync(8000)

    expect(await promise).toEqual({ status: 'error', reason: 'timeout' })
  })

  it('devolve "aborted" quando o chamador cancela a consulta', async () => {
    const controller = new AbortController()
    const promise = lookupPostalCode('90250440', { fetchFn: hangingFetch(), signal: controller.signal })

    controller.abort()

    expect(await promise).toEqual({ status: 'aborted' })
  })

  it('não consulta se o sinal já estiver cancelado', async () => {
    const controller = new AbortController()
    controller.abort()
    const fetchFn = mockFetch(async () => jsonResponse(FIGMA_RESPONSE))

    expect(await lookupPostalCode('90250440', { fetchFn, signal: controller.signal })).toEqual({ status: 'aborted' })
    expect(fetchFn).not.toHaveBeenCalled()
  })
})
