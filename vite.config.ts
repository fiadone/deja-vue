/// <reference types="vitest/config" />
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './playground',
  plugins: [vue(), unocss()],
  test: {
    root: '.',
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      headless: true
    }
  }
})
