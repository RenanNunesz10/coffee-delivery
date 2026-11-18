import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('monta providers e router reais e abre na Home', async () => {
    render(<App />)

    expect(await screen.findByRole('heading', { level: 1, name: /Encontre o café perfeito/ })).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})
