import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import tseslint from "typescript-eslint";

// pnpm add --save-dev @eslint/eslintrc @eslint/js eslint-plugin-perfectionist typescript-eslint

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  perfectionist.configs["recommended-alphabetical"],
  ...compat.config({
    extends: ["eslint:recommended", "next"],
  }),
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["node_modules", ".next", "out"],
    rules: {
      "perfectionist/sort-jsx-props": [
        "error",
        {
          customGroups: {},
          groups: [],
          ignoreCase: true,
          ignorePattern: [],
          newlinesBetween: "always",
          order: "asc",
          partitionByNewLine: false,
          specialCharacters: "keep",
          type: "alphabetical",
        },
      ],
    },
  },
);
