module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
    mocha: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    indent: ['error', 2],
    semi: 'error',
  },
};
