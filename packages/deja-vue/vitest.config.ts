import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    coverage: {
      exclude: ['src/index.ts', 'src/env.d.ts', '**/*.types.ts'],
      include: ['src/**/*.ts', 'src/**/*.vue'],
      provider: 'v8',
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    },
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
    maxWorkers: 1,
    setupFiles: ['tests/shared/setup.ts']
  }
})
