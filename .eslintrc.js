module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off',
    'indent': ['error', 2],
    'no-extra-semi': 'error',
    'no-unreachable': 'error',
    'valid-typeof': 'error',
    'eqeqeq': 'off',
    'no-implicit-coercion': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
