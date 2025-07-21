module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    // General ESLint rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'off', // Disabled for TypeScript
  },
  env: {
    node: true,
    es2020: true,
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js',
    '*.d.ts',
  ],
};
