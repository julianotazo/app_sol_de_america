import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,jsx}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    plugins: {
      prettier,
      react,
      "react-hooks": reactHooks
    },
    rules: {
      // Reglas base recomendadas de ESLint
      ...js.configs.recommended.rules,
      // Reglas recomendadas de React
      ...react.configs.recommended.rules,
      // Reglas recomendadas para hooks
      ...reactHooks.configs.recommended.rules,
      // Integración con Prettier: formateo obligatorio
      "prettier/prettier": "error"
    }
  }
];
