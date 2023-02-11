module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['@aloudata/eslint-config-base', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['**/*.less.d.ts', 'build/*', '.eslintrc.js'],
  plugins: ['react', '@typescript-eslint', 'import'],
  rules: {
    'react/require-default-props': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/type-annotation-spacing': ['error', { after: true }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
      {
        selector: 'enum',
        format: ['PascalCase'],
        custom: {
          regex: '^E[A-Z]',
          match: true,
        },
      },
    ],
    eqeqeq: ['error'],
    'object-shorthand': ['error'],
    'prefer-const': ['error'],
  },
};
