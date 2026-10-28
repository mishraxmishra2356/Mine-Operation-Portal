import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api calls to the Express backend so login cookies stay same-origin.
    proxy: { '/api': 'http://localhost:4000' },
  },
})
