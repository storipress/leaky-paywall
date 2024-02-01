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
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core', '@vueuse/math'],
      dirs: ['src/utils', 'src/composables'],
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
