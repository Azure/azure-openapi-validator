// @ts-check

module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "node", "ts"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "cobertura", "text", "html", "clover"],
  coveragePathIgnorePatterns: ["/node_modules/", ".*/tests/.*"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  testMatch: ["**/test/*.test.ts", "!**/test/**/*.d.ts"],
  verbose: true,
  preset: "ts-jest",
  collectCoverageFrom: ["src/spectral/functions/*.ts", "!spectral/*.d.ts", "!spectral/functions/*.d.ts"],
  coverageThreshold: {
    "src/spectral/functions/*.ts": {
      statements: 80,
    },
  },
  moduleNameMapper: {
    "^nimma/legacy$": "<rootDir>/node_modules/nimma/dist/legacy/cjs/index.js",
    "^nimma/(.*)": "<rootDir>/node_modules/nimma/dist/cjs/$1",
    "^@stoplight/spectral-ruleset-bundler/(.*)$": "<rootDir>/node_modules/@stoplight/spectral-ruleset-bundler/dist/$1",
  },
}
