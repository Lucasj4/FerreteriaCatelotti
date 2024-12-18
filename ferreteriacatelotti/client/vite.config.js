import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/variables.scss";`, // Opcional: importa variables globales
      },
    },
    
  },
  server: {
    port: 5173, // Cambia si es necesario
    open: true, // Abre automáticamente el navegador
  },
  optimizeDeps: {
    exclude: ['events', 'url', 'http', 'path', 'buffer', 'util'],
  },
})
