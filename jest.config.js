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
      statements: 54,
      branches: 38,
      functions: 65,
      lines: 54
    }
  },
  restoreMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,js}'
  ],
  globalSetup: './jest-setup.js'
}
