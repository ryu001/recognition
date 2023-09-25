import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { resolve } from 'path'
const port = 5173
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@views': path.resolve(__dirname, './src/views'),
    }
  },
  server: {
    port: port,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:8081/api',
        changeOrigin: false,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})

