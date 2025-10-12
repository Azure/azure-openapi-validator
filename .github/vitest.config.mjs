import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Run tests serially (equivalent to Jest's --runInBand)
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Set test timeout (Jest default is 5000ms, increase if needed)
    testTimeout: 90000,
    hookTimeout: 90000,
    teardownTimeout: 10000,
    // Include test files
    include: ['tests/**/*.test.js'],
    // Use globals for compatibility with Jest-style tests
    globals: true,
    // Disable watch mode
    watch: false,
    // Pass with no tests found
    passWithNoTests: false,
    // Silent console output during tests
    silent: false,
  },
})
