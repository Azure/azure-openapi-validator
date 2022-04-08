// @ts-check

/** @type {jest.InitialOptions} */
module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: {},
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  testMatch: ["**/*.test.ts", "!*test.d.ts"],
  verbose: true,
  testSequencer: './test-sequence.js'
}
