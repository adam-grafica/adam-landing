import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    compression({
      exclude: [/\.(br)$/, /\.(gz)$/],
      algorithms: ['gzip'],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // Eliminar console.log y debugger en producción
    drop: ['console', 'debugger'],
  },
  build: {
    // es2020 elimina polyfills innecesarios (~35KB ahorro)
    // pero mantiene compatibilidad con browsers de últimos 2 años
    target: 'es2020',

    // Separar CSS por chunk
    cssCodeSplit: true,

    // Minificar CSS con esbuild (incluido en Vite, no requiere instalación)
    cssMinify: true,

    // Advertir si un chunk supera 80KB
    chunkSizeWarningLimit: 80,

    rollupOptions: {
      output: {
        manualChunks: {
          // React en su propio chunk (se cachea independiente)
          'react-vendor': ['react', 'react-dom'],

          // GSAP separado — se carga async desde main.tsx
          'gsap-vendor': ['gsap'],

          // Lucide icons separados — solo se usan below-the-fold
          'lucide-icons': ['lucide-react'],
        },
      },
    },
  },
})
