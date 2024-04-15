import { Hono } from 'hono'
import { oneLineTrim } from 'proper-tags'
import type { ResolveConfigFn } from '@microlabs/otel-cf-workers'
import { instrument } from '@microlabs/otel-cf-workers'
import invariant from 'tiny-invariant'
import { cors } from 'hono/cors'
import * as Tracer from '@effect/opentelemetry/Tracer'
import * as Resource from '@effect/opentelemetry/Resource'
import { secureHeaders } from 'hono/secure-headers'
import { withQuery } from 'ufo'
import { version } from 'version-proxy'
import { etag } from 'hono/etag'
import { Effect, pipe } from 'effect'
import esbuild from 'esbuild-wasm'
import { SiteSubscriptionInfo } from 'storipress-client'
import { GraphqlService } from './services/GraphqlService'
import { initEsbuild } from './utils/esbuild-init'
import { fromAPIFormat } from './utils/extract-config'

const PRODUCTION_URL = withQuery('https://assets.stori.press/storipress/leaky-paywall.min.js', { v: version })
const PRODUCTION_DEBUG_URL = withQuery('https://assets.stori.press/storipress/leaky-paywall-debug.min.js', {
  v: version,
})
const CONFIG_VAR_NAME = 'SP_PAYWALL'

// @ts-expect-error polyfill
globalThis.performance = Date

const javascript = oneLineTrim

const app = new Hono()

app.get('/', (c) => {
  return c.text('Not found', 404)
})

app.get(
  '/:clientId/prophet.js',

  // https://hono.dev/middleware/builtin/cors
  cors({
    origin: '*',
    allowHeaders: ['Upgrade-Insecure-Requests'],
    allowMethods: ['HEAD', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 3600,
    credentials: true,
  }),

  // https://hono.dev/middleware/builtin/etag
  etag(),

  // https://hono.dev/middleware/builtin/secure-headers
  secureHeaders(),

  (c) => {
    const clientId = c.req.param('clientId')

    return pipe(
      initEsbuild,
      Effect.flatMap(() =>
        pipe(
          GraphqlService,
          Effect.flatMap(({ query }) => query(SiteSubscriptionInfo, {})),
          Effect.flatMap((res) => {
            invariant(res.data, 'no data')
            return fromAPIFormat(clientId, res.data)
          }),
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
        ),
      ),
      Effect.provide(GraphqlService.layer(clientId)),
      Effect.catchTag('NotFoundError', () => Effect.succeed(c.text('Not Found', 404))),
      Effect.catchAll((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
        return Effect.succeed(c.text('Internal Server Error', 500))
      }),
      Effect.provide(Tracer.layerGlobalTracer),
      Effect.provide(
        Resource.layer({
          serviceName: 'prophet_worker',
          serviceVersion: '1.0.0',
          attributes: {},
        }),
      ),
      Effect.catchAllDefect((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
        return Effect.die(error)
      }),
      Effect.runPromise,
    )
  },
)

const config: ResolveConfigFn = () => {
  return {
    exporter: {
      url: 'https://api.axiom.co/v1/traces',
      headers: {
        Authorization: 'Bearer xaat-e048c648-6eab-47ff-bf01-2b7d1af47842',
        'x-axiom-dataset': 'storipress_services',
      },
    },
    service: {
      name: 'prophet_worker',
    },
  }
}

export default instrument(app, config)
