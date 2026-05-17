import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'tsdown'

export default defineConfig({
  platform: 'browser',
  plugins: [vue()],
  exports: true,
  dts: { vue: true }
})
