import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 3000, // Usa el puerto proporcionado por Railway o 3000 como respaldo
  },
  preview: {
    port: Number(process.env.PORT) || 3000, // Configura el puerto para el servidor de previsualización
  },
})
