import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    // Demais CSS são ignorados nos testes; tokens.css é lido como texto (?raw) em tokens.test.ts.
    css: { include: [/tokens\.css/] },
  },
})
