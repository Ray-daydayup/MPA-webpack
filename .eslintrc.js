module.exports = {
  parser: 'babel-eslint',
  extends: ['alloy'],
  env: {
    browser: true,
    node: true
  },
  rules: {
    'no-new': 'off',
    'no-proto': 'off'
    // 'no-console': 'error'
  }
}
