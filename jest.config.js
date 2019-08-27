/* eslint-env node */

module.exports = {
  preset: 'ts-jest',
  transform: {
    '.(js|jsx)': '@sucrase/jest-plugin',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./tests/jest.setup.js'],
  clearMocks: true,
}
