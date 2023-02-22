module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "eol-last": ["error", "always"],
    "no-trailing-spaces": ["error"],
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    "arrow-parens": ["error", "always"],
    indent: ["error", 2],
    "no-unused-expressions": ["error"],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "no-console": ["error", { allow: ["error", "warn"] }],
  },
};
