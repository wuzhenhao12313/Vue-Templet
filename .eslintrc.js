module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'no-undef': 'off',
    'camelcase': 'off',
    'no-unused-expressions': 'off',
    'no-sequences':'off',
    'no-unused-vars':'off',
    'vue/valid-template-root':'off',
    'vue/require-v-for-key':'off',
    'no-extend-native':'off',
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
