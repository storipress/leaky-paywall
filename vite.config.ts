import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import RadixVueResolver from 'radix-vue/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': '/src/',
    },
  },
  build: {
    lib: {
      entry: './src/entry.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dirs: ['src/utils', 'src/composables'],
    }),
    Components({
      dirs: ['src/components', 'src/components/ui'],
      resolvers: [RadixVueResolver()],
    }),
    VueDevTools(),
  ],
})
