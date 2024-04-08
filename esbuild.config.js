import process from 'node:process'
import esbuild from 'esbuild'

const entry = process.env.MODE === 'lib-debug' ? './lib/leaky-paywall-debug.js' : './lib/leaky-paywall.js'
const output = process.env.MODE === 'lib-debug' ? './lib/leaky-paywall-debug.min.js' : './lib/leaky-paywall.min.js'

esbuild
  .build({
    logLevel: 'info',
    entryPoints: [entry],
    bundle: true,
    minify: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      __VUE_OPTIONS_API__: 'false',
      __VUE_PROD_DEVTOOLS__: 'false',
    },
    outfile: output,
  })
  .catch(() => process.exit(1))
