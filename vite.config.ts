import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'

export default defineConfig({  
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        garden: resolve(__dirname, 'garden/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        korea: resolve(__dirname, 'korea/index.html'),
        hell: resolve(__dirname, 'hell/index.html'),
      },
    },
  },
  
})
