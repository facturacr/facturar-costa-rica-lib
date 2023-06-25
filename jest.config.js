module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/', 'inputs', 'stubs'],
  moduleNameMapper: {
    '^@test(.*)$': '<rootDir>/__tests__/$1',
    '^@src(.*)$': '<rootDir>/src/$1'
  },
  coverageThreshold: {
    global: {
      statements: 20,
      branches: 19,
      functions: 20,
      lines: 20
    }
  },
  restoreMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,js}'
  ]
}
