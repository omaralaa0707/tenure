import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'
import { defineConfig } from 'vitest/config'

// The app keeps JSX in .js files, the way Next allows; Vite only assumes JSX in
// .jsx, so tell it explicitly for everything under app/.
const jsxInJs = {
  name: 'jsx-in-js',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('.js') || !id.includes('/app/')) return null
    return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' })
  },
}

export default defineConfig({
  plugins: [jsxInJs, react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.js'],
    include: ['test/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['app/**/*.js'],
      exclude: ['app/layout.js'],
    },
  },
})
