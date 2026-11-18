import { describe, expect, it } from 'vitest'
import { formatPostalCode, isCompletePostalCode, normalizePostalCode } from './postalCode'

describe('postalCode', () => {
  it('normaliza para dígitos', () => {
    expect(normalizePostalCode('90250-440')).toBe('90250440')
    expect(normalizePostalCode(' 90.250 440 ')).toBe('90250440')
  })

  it('identifica CEP completo', () => {
    expect(isCompletePostalCode('90250-440')).toBe(true)
    expect(isCompletePostalCode('9025044')).toBe(false)
    expect(isCompletePostalCode('902504401')).toBe(false)
  })

  it.each([
    ['', ''],
    ['902', '902'],
    ['90250', '90250'],
    ['902504', '90250-4'],
    ['90250440', '90250-440'],
    ['902504409999', '90250-440'],
    ['abc90250-440', '90250-440'],
  ])('mascara "%s" como "%s"', (input, expected) => {
    expect(formatPostalCode(input)).toBe(expected)
  })
})
