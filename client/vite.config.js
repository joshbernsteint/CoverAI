import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  test: {
    // Vitest configurations
    globals: true,
    environment: 'jsdom',
    // setupFiles: 'src/setupTests.js',
  },
})
