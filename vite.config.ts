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
})
