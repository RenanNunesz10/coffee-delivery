import { POSTAL_CODE_LENGTH } from '../domain/constants'

/** Remove tudo que não é dígito: "90250-440" → "90250440" (RN-07). */
export function normalizePostalCode(value: string): string {
  return value.replace(/\D/g, '')
}

export function isCompletePostalCode(value: string): boolean {
  return normalizePostalCode(value).length === POSTAL_CODE_LENGTH
}

/** Máscara progressiva para digitação: "902504" → "90250-4"; limita a 8 dígitos. */
export function formatPostalCode(value: string): string {
  const digits = normalizePostalCode(value).slice(0, POSTAL_CODE_LENGTH)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}
