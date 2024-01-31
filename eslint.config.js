import antfu from '@antfu/eslint-config'

export default antfu(
  {
    stylistic: false,
    rules: {
      'antfu/top-level-function': 'error',

      'vue/attributes-order': 'error',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
  {
    ignores: ['src/vite-env.d.ts'],
  },
)
