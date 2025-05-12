import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/styled-engine': fileURLToPath(new URL('./node_modules/@mui/styled-engine-sc', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@routes': fileURLToPath(new URL('./src/routes', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      '@theme': fileURLToPath(new URL('./src/theme', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
