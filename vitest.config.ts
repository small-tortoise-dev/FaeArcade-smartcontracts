import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'build', 'wrappers'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        'wrappers/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.config.js'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@contracts': resolve(__dirname, './contracts'),
      '@scripts': resolve(__dirname, './scripts'),
      '@tests': resolve(__dirname, './tests')
    }
  }
}) 