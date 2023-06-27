// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
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
    "@typescript-eslint/ban-ts-comment": "off",
    "block-scoped-var": "error",
    camelcase: "error",
    "consistent-return": "error",
    "default-case": "error",
    "default-case-last": "error",
    "default-param-last": ["error"],
    "dot-notation": "error",
    eqeqeq: ["error", "always"],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: ["interface", "class", "typeAlias", "enum"],
        format: ["PascalCase"],
      },
      {
        selector: "variable",
        format: ["camelCase"],
      },
      {
        selector: "memberLike",
        modifiers: ["public", "protected"],
        format: ["camelCase"],
      },
    ],
  },
};
