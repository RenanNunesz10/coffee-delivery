import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '../domain/constants'
import { mockSystemColorScheme } from './matchMedia'
import { renderApp } from './renderWithRouter'
import { FIGMA_VIACEP_RESPONSE, mockViaCep } from './viacepMock'

const normalize = (value: string | null | undefined) => value?.replace(/\s/g, ' ') ?? ''

/**
 * Cenário de aceitação ponta a ponta (PRD §11), com rotas, providers e storage reais
 * e apenas a ViaCEP simulada.
 */
describe('fluxo de compra completo', () => {
  it('Home → Checkout → Sucesso, com snapshot preservado após limpar o carrinho e após refresh', async () => {
    const user = userEvent.setup()
    mockSystemColorScheme('light')
    const fetchMock = mockViaCep({ '90250440': { body: FIGMA_VIACEP_RESPONSE } })
    const { router, unmount } = renderApp('/')

    // Home: o mesmo café acumula; o contador soma unidades (RF-02 a RF-04).
    await user.click(await screen.findByRole('button', { name: 'Adicionar 1 Expresso Tradicional ao carrinho' }))
    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Latte' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar 2 Latte ao carrinho' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar 1 Cubano ao carrinho' }))
    expect(screen.getByRole('link', { name: 'Carrinho, 4 itens' })).toBeInTheDocument()

    // Tema escolhido vale para todo o fluxo (RF-14).
    await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))
    expect(document.documentElement.dataset.theme).toBe('dark')

    // Checkout: remove um item e confere o resumo do Figma (RF-05, RF-10).
    await user.click(screen.getByRole('link', { name: 'Carrinho, 4 itens' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/checkout'))
    await user.click(await screen.findByRole('button', { name: 'Remover Cubano do carrinho' }))
    const summary = screen.getByRole('region', { name: 'Resumo do pedido' })
    expect(within(summary).getAllByRole('listitem')).toHaveLength(2)
    expect(normalize(summary.textContent)).toContain('Total de itensR$ 29,70')
    expect(normalize(summary.textContent)).toContain('EntregaR$ 3,50')
    expect(normalize(summary.textContent)).toContain('TotalR$ 33,20')

    // Endereço pela ViaCEP + pagamento (RF-08, RF-09).
    await user.type(screen.getByLabelText('CEP'), '90250440')
    await screen.findByText(/Endereço encontrado/)
    await user.type(screen.getByLabelText('Número'), '102')
    await user.type(screen.getByLabelText('Complemento', { exact: false }), 'Casa')
    await user.click(screen.getByRole('radio', { name: 'Dinheiro' }))
    expect(fetchMock).toHaveBeenCalledOnce()

    // Confirmação (RF-12, RF-13).
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/success'))
    const details = within(await screen.findByRole('list', { name: 'Detalhes do pedido' }))
    expect(details.getByText('Rua João Daniel Martinelli, 102 - Casa')).toBeInTheDocument()
    expect(details.getByText(/Farrapos - Porto Alegre, RS/)).toBeInTheDocument()
    expect(details.getByText('Dinheiro')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Carrinho vazio' })).toBeInTheDocument()
    expect(screen.getByText('Porto Alegre, RS')).toBeInTheDocument()

    // Refresh: carrinho continua vazio, pedido e tema continuam salvos (RF-06, RF-14, RN-06).
    unmount()
    renderApp('/success')
    expect(await screen.findByRole('heading', { level: 1, name: 'Uhu! Pedido confirmado' })).toBeInTheDocument()
    expect(screen.getByText('Dinheiro')).toBeInTheDocument()
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) ?? 'null')).toEqual({ items: [] })

    // Voltar ao checkout depois da compra mostra o carrinho vazio, não o pedido antigo (RN-09).
    await user.click(screen.getByRole('link', { name: 'Carrinho vazio' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Seu carrinho está vazio' })).toBeInTheDocument()
  })
})
