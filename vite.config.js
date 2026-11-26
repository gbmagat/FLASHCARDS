import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Vite builds the app with the React plugin, which compiles the JSX. Vitest
// runs the tests in test/ against a simulated browser (jsdom).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.js',
    // Only the project's own tests, never stray files in tool folders.
    include: ['test/**/*.test.{js,jsx}'],
  },
})
