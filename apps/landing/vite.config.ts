import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/deja-vue/',
  plugins: [vue(), unocss()],
  resolve: {
    alias: {
      'deja-vue': fileURLToPath(new URL('../../packages/deja-vue/src/index.ts', import.meta.url))
    }
  }
})
