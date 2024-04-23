import { Effect, SynchronizedRef, pipe } from 'effect'
import esbuild from 'esbuild-wasm'
// ref: https://blog.interactions.rest/blog/esbuild-on-the-edge/
// @ts-expect-error no type
// eslint-disable-next-line antfu/no-import-node-modules-by-path
import wasm from '../../../../node_modules/esbuild-wasm/esbuild.wasm'

export const initializedRef = SynchronizedRef.unsafeMake(false)

export const initEsbuild = SynchronizedRef.updateEffect(initializedRef, (initialized) =>
  pipe(
    initialized
      ? Effect.void
      : Effect.promise(() =>
          esbuild.initialize({
            wasmModule: wasm,
            worker: false,
          }),
        ),
    Effect.as(true),
    Effect.catchAllDefect((error) => {
      // eslint-disable-next-line no-console
      console.log('Fail to init esbuild', error)
      return Effect.die(error)
    }),
    Effect.withSpan('init esbuild'),
  ),
)
