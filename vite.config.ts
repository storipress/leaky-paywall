import process from 'node:process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import Macros from 'unplugin-macros/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import RadixVueResolver from 'radix-vue/resolver'

const baseConfig = defineConfig({
  resolve: {
    alias: {
      '~': '/src/',
      graphql: 'graphql-web-lite',
    },
  },
  plugins: [
    Macros(),
    vue({ customElement: true }),
    Boolean(process.env.ANALYZE) && visualizer(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
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
          from: '@urql/vue',
          imports: ['useQuery', 'useMutation'],
        },
      ],
      dirs: ['src/utils', 'src/composables', 'src/stores'],
    }),
    Components({
      dirs: ['src/components', 'src/components/ui'],
      // @ts-expect-error type incorrect
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
        emptyOutDir: false,

        lib: {
          entry: {
            'leaky-paywall': './src/entry.ts',
          },
          formats: ['es'],
        },
        rollupOptions: {
          external: ['vue'],
        },
      },
    }
  }

  if (mode === 'lib-debug') {
    return {
      ...baseConfig,
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      build: {
        outDir: 'lib',
        emptyOutDir: false,

        lib: {
          entry: {
            'leaky-paywall-debug': './src/entry-debug.ts',
          },
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
