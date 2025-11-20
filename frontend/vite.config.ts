import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para React + TypeScript
export default defineConfig({
  plugins: [react()],

  // Configuración del servidor de desarrollo
  server: {
    host: true,          // permite acceder desde otras IP (útil con Docker o LAN)
    port: 5173,          // puerto local del frontend
    open: true,          // abre el navegador automáticamente al iniciar
  },

  // Variables de entorno (.env)
  envPrefix: 'VITE_',     // sólo las que empiecen con VITE_ estarán disponibles en import.meta.env

  // Opcional: build para producción
  build: {
    outDir: 'dist',
    sourcemap: true,      // genera mapas de código (útil para debugging)
  },
})
