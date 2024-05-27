module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard', "plugin:prettier/recommended"],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0,
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "parser": "flow"
      }
    ],
    // 'vue/multi-word-component-names': [
    //   'error',
    //   {
    //     ignores: ['index'], //需要忽略的组件名
    //   },
    // ],
    'semi': [0],
    "no-mixed-spaces-and-tabs": [0],
    // 'no-unused-vars': [2, { vars: 'all', args: 'none' }],
    // quotes: 'off',
    // 'no-dupe-keys': 'off'
  },
  // overrides: [
  //   {
  //     files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
  //     env: {
  //       jest: true
  //     }
  //   }
  // ]
};
