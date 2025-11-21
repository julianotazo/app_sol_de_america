import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    plugins: {
      prettier
    },
    rules: {
      // Reglas recomendadas base de ESLint
      ...js.configs.recommended.rules,
      // Reglas de eslint-config-prettier (desactiva conflictos)
      ...prettierConfig.rules,
      // Integración con Prettier: si no está formateado → error
      'prettier/prettier': 'error',
      // Tus reglas personalizadas
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error'
    }
  }
];
