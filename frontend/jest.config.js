/**
 * jest.config.js — Configuração do Jest para projeto Next.js
 *
 * Instalação das dependências de teste:
 *   npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
 *
 * Executar testes:
 *   npm test
 *   npm test -- --watch           (modo watch)
 *   npm test -- --coverage        (com relatório de cobertura)
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Aponta para a raiz do projeto Next.js
  dir: './',
});

const customJestConfig = {
  setupFilesAfterFramework: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Alias de importação do Next.js
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mockar CSS Modules
    '\\.module\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  testPathPattern: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
};

module.exports = createJestConfig(customJestConfig);
