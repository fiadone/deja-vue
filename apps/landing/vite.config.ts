import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import svg from 'vite-svg-loader'

export default defineConfig({
  base: '/deja-vue/',
  plugins: [
    svg(),
    unocss(),
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'deja-vue': fileURLToPath(new URL('../../packages/deja-vue/src/index.ts', import.meta.url))
    }
  },
  server: {
    allowedHosts: [
      '.trycloudflare.com'
    ]
  }
})
