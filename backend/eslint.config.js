import globals from "globals";
import tseslint from 'typescript-eslint';
import eslintRecommended from '@eslint/js';

export default tseslint.config(
  {
    ignores: [
        "dist/",
    ]
  },

  eslintRecommended.configs.recommended, 

  {
    files: ["src/**/*.ts"],
    extends: [
        ...tseslint.configs.recommended,
    ],
    languageOptions: {
      globals: {
        ...globals.node, 
        ...globals.es2021
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-useless-catch": "warn",
    },
  },

  {
    files: ["**/*.cjs"],
    languageOptions: {
      globals: {
        ...globals.node, 
        ...globals.commonjs 
      },
      sourceType: "commonjs" 
    },
    rules: {
    }
  },

  {
    files: ["eslint.config.js"],
    languageOptions: {
        globals: {
            ...globals.node, 
            ...globals.es2021
        },
        sourceType: "module"
    }
  }
);
