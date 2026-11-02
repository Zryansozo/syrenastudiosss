import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('gsap') || id.includes('lenis')) return 'vendor-gsap';
            if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('/react/')) return 'vendor-react';
            if (id.includes('@tabler') || id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('matter-js')) return 'vendor-physics';
          }
        },
      },
    },
  },
})

