import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // Refreshed to load dependencies
  build: {
    rollupOptions: {
      output: {
        // Split big libraries into their own long-cached files so a site
        // update doesn't make returning visitors re-download them.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          firestore: ['firebase/app', 'firebase/firestore'],
          motion: ['framer-motion']
        }
      }
    }
  }
})
