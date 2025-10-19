/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/anime/**/*.ts'],
      reporter: ['lcov', 'text', 'html']
    }
  },
})