module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '(command-handler|query-handler|controller|service|gateway).spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@decorators$': '<rootDir>/src/common/decorators/index',
    '^@constants(.*)$': '<rootDir>/src/common/constants$1',
    '^@guards$': '<rootDir>/src/common/guards/index',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
};
