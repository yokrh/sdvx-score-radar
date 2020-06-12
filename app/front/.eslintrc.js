module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'comma-dangle': [1, 'always-multiline'],
    'space-before-function-paren': 0,
    'standard/object-curly-even-spacing': 0,
    'standard/array-bracket-even-spacing': 0,
    'import/no-named-as-default-member': 0,
    'vue/attributes-order': 0,
    'vue/singleline-html-element-content-newline': 0,
  },
}
