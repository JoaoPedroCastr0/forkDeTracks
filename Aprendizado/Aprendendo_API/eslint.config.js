import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,

  // BACKEND (TypeScript)
{
  files: ["src/**/*.ts"],
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      console: "readonly",
      process: "readonly",
      __dirname: "readonly",
      Bun: "readonly" 
    },
  },
  plugins: {
    "@typescript-eslint": tsPlugin,
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
  },
},

  // 🔹 FRONTEND (Browser)
  {
    files: ["frontend/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        alert: "readonly",
        prompt: "readonly",
        location: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];