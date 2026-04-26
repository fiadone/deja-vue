import { defineConfig } from 'tsdown'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  platform: 'browser',
  plugins: [vue()],
  exports: true,
  dts: { vue: true }
})
