import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base relativo permite servir em https://usuario.github.io/<repo>/ sem ajustes
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
