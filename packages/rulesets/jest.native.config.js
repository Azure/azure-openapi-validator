// @ts-check

module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'json',
    'node',
    'ts',
  ],
  collectCoverage: true,
  coverageReporters: [
    'json',
    'lcov',
    'cobertura',
    'text',
    'html',
    'clover',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.*/tests/.*',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  testMatch: [
    '**/native/tests/*-test.ts',
    '!**/native/tests/**/*.d.ts',
  ],
  verbose: true,
  preset: 'ts-jest', 
  collectCoverageFrom: [
  ],
  moduleNameMapper: {
  }
}
