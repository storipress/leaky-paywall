import process from 'node:process'
import esbuild from 'esbuild'
import { Effect, Match, pipe } from 'effect'

const MODE = process.env.MODE ?? 'lib'

const entry = Match.value(MODE).pipe(
  Match.when('lib-debug', () => './lib/leaky-paywall-debug.js'),
  Match.when('lib-preview', () => './lib/leaky-paywall-preview.js'),
  Match.orElse(() => './lib/leaky-paywall.js'),
)

const output = Match.value(MODE).pipe(
  Match.when('lib-debug', () => './lib/leaky-paywall-debug.min.js'),
  Match.when('lib-preview', () => './lib/leaky-paywall-preview.min.js'),
  Match.orElse(() => './lib/leaky-paywall.min.js'),
)

await pipe(
  Effect.log(`Minify ${entry} -> ${output}`),
  Effect.flatMap(() =>
    Effect.promise(() =>
      esbuild.build({
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
      }),
    ),
  ),
  Effect.catchAllDefect((error) => {
    console.error(error)
    process.exit(1)
  }),
  Effect.runPromise,
)
