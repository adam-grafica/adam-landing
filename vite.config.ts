import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { compression } from 'vite-plugin-compression2'

function asyncCssPlugin(): Plugin {
  return {
    name: 'async-css',
    enforce: 'post',
    transformIndexHtml(html) {
      let newHtml = html.replace(
        /<link rel="stylesheet" crossorigin href="(.*?)">/g,
        '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'">\n    <noscript><link rel="stylesheet" href="$1"></noscript>'
      );
      
      // Inject fetchpriority="high" for main script and low for gsap-vendor
      newHtml = newHtml.replace(
        /<script(.*?)src="(.*?\/index-.*?\.js)"(.*?)>/,
        '<script$1src="$2"$3 fetchpriority="high">'
      );
      newHtml = newHtml.replace(
        /<script(.*?)src="(.*?\/gsap-vendor-.*?\.js)"(.*?)>/,
        '<script$1src="$2"$3 fetchpriority="low">'
      );

      return newHtml;
    }
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), asyncCssPlugin(), compression({ exclude: [/\.(br)$/, /\.(gz)$/] })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'gsap-vendor': ['gsap'],
          'lucide-icons': ['lucide-react']
        }
      }
    }
  }
});
