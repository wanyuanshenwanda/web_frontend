import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    hmr: true,
    port: 3004,
    proxy: {
      "/api": {
        target: "http://localhost:7070",
        changeOrigin: true,
        pathReWrite: {
          "^api": "/api",
        }
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    },
    chunkFileNames: (chunkInfo) => {
      const facedModuleId = chunkInfo.facadeModuleId
      ? chunkInfo.facadeModuleId.split('/')
      :[];
      const fileName = 
      facedModuleId[facedModuleId.length - 2] || '[name]';
      return `js/${fileName}/[name].[hash].js`;
    }
  }
})

