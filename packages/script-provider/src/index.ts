import { Hono } from 'hono'
import { oneLineTrim } from 'proper-tags'
import type { ResolveConfigFn } from '@microlabs/otel-cf-workers'
import { instrument } from '@microlabs/otel-cf-workers'
import * as Tracer from '@effect/opentelemetry/Tracer'
import * as Resource from '@effect/opentelemetry/Resource'
import { Effect, SynchronizedRef, pipe } from 'effect'
import esbuild from 'esbuild-wasm'
import { SiteSubscriptionInfo } from 'storipress-client'
// ref: https://blog.interactions.rest/blog/esbuild-on-the-edge/
// @ts-expect-error no type
// eslint-disable-next-line antfu/no-import-node-modules-by-path
import wasm from '../../../node_modules/esbuild-wasm/esbuild.wasm'
import { GraphqlService } from './services/GraphqlService'

const PRODUCTION_URL = 'https://assets.stori.press/storipress/leaky-paywall.min.js'
const CONFIG_VAR_NAME = 'SP_PAYWALL'

// @ts-expect-error polyfill
globalThis.performance = Date

const javascript = oneLineTrim

const app = new Hono()

app.get('/', (c) => {
  return c.text('Not found', 404)
})

const initializedRef = SynchronizedRef.unsafeMake(false)

app.get('/:clientId/prophet.js', (c) => {
  const clientId = c.req.param('clientId')

  return pipe(
    SynchronizedRef.updateEffect(initializedRef, () =>
      pipe(
        Effect.promise(() =>
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
    ),
    Effect.flatMap(() =>
      pipe(
        GraphqlService,
        Effect.flatMap(({ query }) => query(SiteSubscriptionInfo, {})),
        Effect.flatMap((res) => {
          const config = JSON.stringify({
            flags: {
              paywall: true,
              tracking: true,
            },
            freeLimit: 3,
            pathPattern: null,
            all: false,
            clientId,
            logo: '',
            title: res.data?.siteSubscriptionInfo.name ?? 'Welcome',
            description: res.data?.siteSubscriptionInfo.description ?? '',
            // TODO: need primary color config
            primaryColor: 'rgb(29 78 216)',
          })
          const code = javascript`
            window.${CONFIG_VAR_NAME} = ${config};
            let s=document.createElement('script');
            s.type='module';
            s.src='${PRODUCTION_URL}';
            document.head.append(s);
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
    Effect.runPromise,
  )
})

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
