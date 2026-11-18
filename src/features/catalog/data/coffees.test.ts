import { describe, expect, it } from 'vitest'
import { COFFEE_TAGS } from '../../../domain/constants'
import { COFFEES, findCoffee, isKnownCoffee } from './coffees'

describe('catálogo de cafés', () => {
  it('contém os 14 cafés do Figma', () => {
    expect(COFFEES).toHaveLength(14)
  })

  it('tem IDs únicos em formato de slug', () => {
    const ids = COFFEES.map((coffee) => coffee.id)

    expect(new Set(ids).size).toBe(ids.length)
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/))
  })

  it.each(COFFEES)('$name tem dados obrigatórios válidos', (coffee) => {
    expect(coffee.name.trim()).not.toBe('')
    expect(coffee.description.trim()).not.toBe('')
    expect(Number.isInteger(coffee.priceCents)).toBe(true)
    expect(coffee.priceCents).toBeGreaterThan(0)
    expect(coffee.tags.length).toBeGreaterThan(0)
    coffee.tags.forEach((tag) => expect(COFFEE_TAGS).toContain(tag))
    expect(new Set(coffee.tags).size).toBe(coffee.tags.length)
  })

  it('cada café usa uma imagem WebP própria do catálogo', () => {
    // O import da imagem já falha na transformação se o arquivo não existir.
    COFFEES.forEach((coffee) => expect(coffee.image).toMatch(/assets\/coffees\/[a-z-]+\.webp$/))
    expect(new Set(COFFEES.map((coffee) => coffee.image)).size).toBe(COFFEES.length)
  })

  it('encontra cafés pelo ID e rejeita IDs desconhecidos', () => {
    expect(findCoffee('latte')?.name).toBe('Latte')
    expect(isKnownCoffee('latte')).toBe(true)
    expect(findCoffee('cafe-inexistente')).toBeUndefined()
    expect(isKnownCoffee('cafe-inexistente')).toBe(false)
  })
})
