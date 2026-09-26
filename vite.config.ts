import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from 'vite'
import { compression } from 'vite-plugin-compression2'

/**
 * Backend FastAPI propio. El bundle habla same-origin (`/api/...`), así que
 * dev y `vite preview` tienen que reverse-proxyear /api hacia el uvicorn:
 * sin esto el mismo-origin funciona en nginx (prod) y revienta en local, que
 * es el peor asymmetric bug que existe. Override con VITE_API_PROXY_TARGET.
 */
const API_PROXY_TARGET = process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:3001'

export default defineConfig(() => {
  const apiProxy = {
    '/api': {
      target: API_PROXY_TARGET,
      changeOrigin: true,
    },
  }

  return {
  base: '/',
  plugins: [
    react(),
    compression({
      exclude: [/\.(br)$/, /\.(gz)$/],
      algorithms: ['gzip'],
    }),
  ],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
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
    // Modern targets = no unnecessary polyfills (saves ~35 KiB)
    target: ['es2020', 'chrome90', 'firefox88', 'safari14', 'edge90'],

    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
    },

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('gsap')) return 'gsap';
          if (id.includes('react-dom')) return 'react';
          if (id.includes('lucide')) return 'icons';
        },
      },
    },

    cssCodeSplit: true,
    sourcemap: false,
  },
  }
})
