import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'

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
      dirs: ['src/utils'],
    }),
    Components({
      dirs: ['src/components', 'src/components/ui'],
    }),
    VueDevTools(),
  ],
})
