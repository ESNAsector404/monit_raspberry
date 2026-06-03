import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    // Proxy optionnel pour éviter les problèmes CORS en dev
    // proxy: {
    //   '/api': { target: 'http://192.168.1.10:5000', changeOrigin: true }
    // }
  }
})
