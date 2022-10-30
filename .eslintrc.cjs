// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-namespace": "off",
    quotes: ["error", "double"],
    "no-await-in-loop": "error",
    "no-unused-private-class-members": "error",
    "block-scoped-var": "error",
    camelcase: "error",
    complexity: ["error", 5],
    "consistent-return": "error",
    "default-case": "error",
    "default-case-last": "error",
    "default-param-last": ["error"],
    "dot-notation": "error",
    eqeqeq: ["error", "always"],
    "@typescript-eslint/no-non-null-assertion": "off",
  },
};
