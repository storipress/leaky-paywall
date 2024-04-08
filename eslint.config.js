import antfu from '@antfu/eslint-config'

export default antfu(
  {
    stylistic: false,
    rules: {
      'antfu/top-level-function': 'error',

      'vue/attributes-order': 'error',
      'vue/html-indent': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
  {
    ignores: [
      'src/vite-env.d.ts',
      'auto-imports.d.ts',
      'components.d.ts',
      'src/gql/**',
      'packages/storipress-client/gql/**',
    ],
  },
)
