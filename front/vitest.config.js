/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', 
    testTimeout: 15000, // ⏰ 15 segundos por teste
    hookTimeout: 10000,
    restoreMocks: true,
    clearMocks: true, 
  },
})
