import process from 'node:process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Codegen from 'vite-plugin-graphql-codegen'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'
// @ts-expect-error no type
import RadixVueResolver from 'radix-vue/resolver'

const baseConfig = defineConfig({
  resolve: {
    alias: {
      '~': '/src/',
      graphql: 'graphql-web-lite',
    },
  },
  plugins: [
    vue({ customElement: true }),
    Codegen(),
    Boolean(process.env.ANALYZE) && visualizer(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        '@vueuse/math',
        {
          from: '@nanostores/vue',
          imports: ['useStore'],
        },
        {
          from: 'nanostores',
          imports: ['atom'],
        },
        {
          from: '~/gql/gql',
          imports: ['graphql'],
        },
      ],
      dirs: ['src/utils', 'src/composables', 'src/stores'],
    }),
    Components({
      dirs: ['src/components', 'src/components/ui'],
      resolvers: [RadixVueResolver()],
    }),
    VueDevTools(),
  ],
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      ...baseConfig,
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      build: {
        outDir: 'lib',

        lib: {
          entry: './src/entry.ts',
          formats: ['es'],
        },
        rollupOptions: {
          external: ['vue'],
        },
      },
    }
  }

  return baseConfig
})
