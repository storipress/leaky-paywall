export default {
  plugins: {
    tailwindcss: {},
    // workaround to prevent shopify override root font size
    '@thedutchcoder/postcss-rem-to-px': {},
    autoprefixer: {},
  },
}
