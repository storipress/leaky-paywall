import process from 'node:process'
import esbuild from 'esbuild'

esbuild
  .build({
    logLevel: 'info',
    entryPoints: ['./lib/leaky-paywall.js'],
    bundle: true,
    minify: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      __VUE_OPTIONS_API__: 'false',
      __VUE_PROD_DEVTOOLS__: 'false',
    },
    outfile: './lib/leaky-paywall.min.js',
  })
  .catch(() => process.exit(1))
