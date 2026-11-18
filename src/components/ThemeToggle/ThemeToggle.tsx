import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from '../../features/theme/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className="inline-flex size-[38px] items-center justify-center rounded-sm bg-purple-light text-purple-ink transition-colors hover:bg-base-hover"
    >
      {isDark ? (
        <SunIcon size={22} weight="fill" aria-hidden="true" />
      ) : (
        <MoonIcon size={22} weight="fill" aria-hidden="true" />
      )}
    </button>
  )
}
