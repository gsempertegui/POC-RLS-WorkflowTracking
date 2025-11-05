// jest.config.js
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Maneja alias de Next.js (como @/components)
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    // Ignora node_modules para la mayoría de los casos
    '/node_modules/',
  ],
};

module.exports = config;