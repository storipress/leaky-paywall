import { defineConfig } from 'tsup'
import Macros from 'unplugin-macros/esbuild'

export default defineConfig({
  clean: true,
  publicDir: 'static',
  format: ['esm'],
  esbuildPlugins: [Macros()],
})
