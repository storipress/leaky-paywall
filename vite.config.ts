import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
// @ts-expect-error no type
import RadixVueResolver from 'radix-vue/resolver'

const baseConfig = defineConfig({
  resolve: {
    alias: {
      '~': '/src/',
    },
  },
  plugins: [
    vue({ customElement: true }),
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
