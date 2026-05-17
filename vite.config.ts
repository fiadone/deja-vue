import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './playground',
  plugins: [vue(), unocss()]
})
