import { Effect, pipe } from 'effect'
import { oneLineTrim } from 'proper-tags'
import type { Context } from 'hono'
import esbuild from 'esbuild-wasm'
import { GraphqlService } from '../services/GraphqlService'
import { initEsbuild } from './esbuild-init'
import { getPaywallConfig } from './get-paywall-config'
import { CONFIG_VAR_NAME, PRODUCTION_DEBUG_URL, PRODUCTION_URL } from './constants'

const javascript = oneLineTrim
export function generateScript(c: Context, clientId: string) {
  return pipe(
    initEsbuild,
    Effect.andThen(getPaywallConfig(clientId)),
    Effect.flatMap((configValues) => {
      const config = JSON.stringify(configValues)
      const code = javascript`
            window.${CONFIG_VAR_NAME} = ${config};
            function insertScript(u) {
              let s=document.createElement('script');
              s.type='module';
              s.src=u;
              document.head.append(s);
            }
            insertScript('${PRODUCTION_URL}');
            if (window.location.search.includes('sp_debug=true')) {
              insertScript('${PRODUCTION_DEBUG_URL}');
            }
          `
      return Effect.promise(() => esbuild.transform(code, { loader: 'js', minify: true }))
    }),
    Effect.map((minified) => c.text(minified.code, 200, { 'content-type': 'text/javascript' })),
    Effect.provide(GraphqlService.layer(clientId)),
    Effect.catchTags({
      NotFoundError: () => Effect.succeed(c.text('Not Found', 404)),
      GraphqlError: (error) => {
        return pipe(Effect.logError(error), Effect.as(c.text('Internal Server Error', 500)))
      },
    }),
  )
}
