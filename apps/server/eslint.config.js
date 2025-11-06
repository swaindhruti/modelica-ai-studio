import { config } from "@repo/eslint-config/base";
import globals from "globals";

export default [
  ...config,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
  },
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**", "drizzle/**"],
  },
];
