import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/personal_business/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/snow-api': {
        target: 'https://dev405150.service-now.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/snow-api/, ''),
        secure: true,
      },
    },
  },
})
