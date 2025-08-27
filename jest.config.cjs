/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Optional: if you ever hit "Cannot use import statement outside a module"
  // transform: { '^.+\\.tsx?$': ['ts-jest', { useESM: false }] },
};
