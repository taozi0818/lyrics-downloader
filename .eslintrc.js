module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  // parserOptions: {
  //   ecmaVersion: 2015,
  //   sourceType: 'module',
  // },
  plugins: [ '@typescript-eslint' ],
  settings: {},
  rules: {
    'array-bracket-spacing': [ 'warn', 'always' ],
    'object-curly-spacing': [ 'warn', 'always' ],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'prefer-const': 0,
    semi: [ 'error', 'always' ],
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
  },
  env: {
    jest: true,
  },
};
