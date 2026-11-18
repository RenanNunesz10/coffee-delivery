import { describe, expect, it } from 'vitest'
import tokensCss from './tokens.css?raw'

type Theme = 'light' | 'dark'

function readThemeTokens(theme: Theme): Record<string, string> {
  const selector =
    theme === 'light' ? /:root,\s*\[data-theme='light'\]\s*\{([^}]*)\}/ : /\[data-theme='dark'\]\s*\{([^}]*)\}/
  const block = tokensCss.match(selector)?.[1]

  if (!block) {
    throw new Error(`Bloco de tokens do tema ${theme} não encontrado`)
  }

  const entries = [...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map(
    ([, name, value]) => [name, value] as const,
  )

  return Object.fromEntries(entries)
}

function relativeLuminance(hex: string): number {
  const [red, green, blue] = [1, 3, 5]
    .map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background))

  return (lighter + 0.05) / (darker + 0.05)
}

const TEXT = 4.5
const LARGE_TEXT_OR_UI = 3

/** [cor do texto/ícone, cor de fundo, mínimo WCAG AA, onde é usado] */
const USED_PAIRS: ReadonlyArray<readonly [string, string, number, string]> = [
  ['on-yellow', 'yellow', TEXT, 'botão primário'],
  ['on-yellow', 'yellow-dark', TEXT, 'botão primário em hover e badge do carrinho'],
  ['base-title', 'background', TEXT, 'títulos'],
  ['base-subtitle', 'background', TEXT, 'subtítulos'],
  ['base-text', 'background', TEXT, 'texto corrido'],
  ['base-text', 'base-card', TEXT, 'texto em cards'],
  ['base-label', 'base-card', TEXT, 'descrição do café'],
  ['base-label', 'base-input', TEXT, 'placeholder e "Opcional"'],
  ['base-text', 'base-button', TEXT, 'botão secundário'],
  ['base-text', 'base-hover', TEXT, 'botão secundário em hover'],
  ['yellow-ink', 'yellow-light', TEXT, 'tag do café e ícone do carrinho'],
  ['purple-ink', 'purple-light', TEXT, 'localização e pagamento selecionado'],
  ['white', 'purple-dark', TEXT, 'botão de adicionar ao carrinho'],
  ['danger', 'background', TEXT, 'mensagens de erro'],
  ['danger', 'base-card', TEXT, 'mensagens de erro em cards'],
  ['purple', 'base-button', LARGE_TEXT_OR_UI, 'ícones + e − e de pagamento'],
  ['purple', 'base-hover', LARGE_TEXT_OR_UI, 'ícone de pagamento em hover'],
  ['yellow-dark', 'background', LARGE_TEXT_OR_UI, 'título da tela de sucesso (texto grande)'],
  ['focus', 'background', LARGE_TEXT_OR_UI, 'anel de foco'],
  ['focus', 'base-card', LARGE_TEXT_OR_UI, 'anel de foco sobre cards'],
]

describe.each<Theme>(['light', 'dark'])('tokens do tema %s', (theme) => {
  const tokens = readThemeTokens(theme)

  it.each(USED_PAIRS)('%s sobre %s atinge %d:1 (%s)', (foreground, background, minimum) => {
    const foregroundColor = tokens[foreground]
    const backgroundColor = tokens[background]

    expect(foregroundColor, `token --${foreground}`).toBeDefined()
    expect(backgroundColor, `token --${background}`).toBeDefined()
    expect(contrastRatio(foregroundColor, backgroundColor)).toBeGreaterThanOrEqual(minimum)
  })
})

describe('paridade entre temas', () => {
  it('define os mesmos tokens no tema claro e no escuro', () => {
    expect(Object.keys(readThemeTokens('dark')).sort()).toEqual(
      Object.keys(readThemeTokens('light')).sort(),
    )
  })
})
