import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,jsx}'],
    ignores: [
      'dist/**',
      'node_modules/**',
      'tailwind.config.js',
      'vite.config.js',
      'postcss.config.js'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      prettier,
      react,
      'react-hooks': reactHooks
    },
    rules: {
      // Reglas recomendadas de ESLint
      ...js.configs.recommended.rules,
      // Reglas React
      ...react.configs.recommended.rules,
      // Reglas Hooks
      ...reactHooks.configs.recommended.rules,
      // Desactivar reglas que no aplican a tu setup
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Prettier obligatorio
      'prettier/prettier': 'error'
    }
  }
];
