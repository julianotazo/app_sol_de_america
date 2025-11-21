import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    env: {
      node: true,
      es2022: true
    },
    plugins: {
      prettier
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
