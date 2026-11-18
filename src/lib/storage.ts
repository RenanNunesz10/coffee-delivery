import type { ZodType } from 'zod'

/*
 * Acesso seguro ao localStorage (PRD §8.4). Nada aqui lança exceção:
 * storage bloqueado, cota cheia, JSON corrompido ou formato inesperado viram `null`/`false`.
 */

/** Lê e valida um JSON salvo. Conteúdo inválido é removido para não falhar de novo no próximo acesso. */
export function readJson<T>(key: string, schema: ZodType<T>): T | null {
  let raw: string | null
  try {
    raw = localStorage.getItem(key)
  } catch {
    return null
  }
  if (raw === null) return null

  try {
    const result = schema.safeParse(JSON.parse(raw))
    if (result.success) return result.data
  } catch {
    // JSON.parse falhou: cai na remoção abaixo.
  }

  removeKey(key)
  return null
}

/** Grava um valor como JSON. Retorna `false` se o storage estiver indisponível. */
export function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // Sem storage disponível: nada a remover.
  }
}
