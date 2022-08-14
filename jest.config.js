module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  modulePathIgnorePatterns: ['inputs', 'stubs'],
  moduleNameMapper: {
    '^@test(.*)$': '<rootDir>/__tests__/$1',
    '^@src(.*)$': '<rootDir>/src/$1'
  },
  coverageThreshold: {
    global: {
      statements: 58,
      branches: 35,
      functions: 58,
      lines: 58
    }
  },
  restoreMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,js}'
  ]
}
