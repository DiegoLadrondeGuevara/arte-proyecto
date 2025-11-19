// vite.config.ts (o vite.config.js si no usas TS para la config)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path'; // 🟢 Necesitas importar 'path' para resolver directorios

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🟢 CONFIGURACIÓN CLAVE A AÑADIR:
  resolve: {
    alias: {
      // 1. ALIAS PARA MÚLTIPLES COPIAS DE REACT (SOLUCIÓN ROBUSTA al hook call error)
      // Esto asegura que todas las importaciones de 'react' y 'react-dom'
      // se resuelvan a la versión instalada en la raíz.
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),

      // 2. ALIAS PARA RUTAS ABSOLUTAS (MEJORA DE UX/DEV)
      // Permite importar módulos usando @/ en lugar de ../../../
      // Ejemplo: import { useAuth } from '@/hooks/useAuth'
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 3. MEJORA DEL BUILD (Opcional, pero bueno para producción)
  build: {
    sourcemap: true, // Para facilitar la depuración en producción
  },
});