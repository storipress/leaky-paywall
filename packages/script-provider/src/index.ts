import { Hono } from 'hono'
import { oneLineTrim } from 'proper-tags'
import { Effect, SynchronizedRef, pipe } from 'effect'
import esbuild from 'esbuild-wasm'
import { SiteSubscriptionInfo } from 'storipress-client'
import wasm from '../../../node_modules/esbuild-wasm/esbuild.wasm'
import { GraphqlService } from './services/GraphqlService'

const PRODUCTION_URL = 'https://assets.stori.press/storipress/leaky-paywall.min.js'
const CONFIG_VAR_NAME = 'SP_PAYWALL'

// @ts-expect-error polyfill
globalThis.performance = Date

const javascript = oneLineTrim

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const initializedRef = SynchronizedRef.unsafeMake(false)

app.get('/:clientId/prophet.js', async (c) => {
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
      ),
    ),
    Effect.flatMap(() =>
      pipe(
        GraphqlService,
        Effect.flatMap(({ query }) => query(SiteSubscriptionInfo, {})),
        Effect.tap((res) => {
          console.log(res.error)
        }),
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
            title: res.data?.siteSubscriptionInfo.name ?? 'Title',
            description: res.data?.siteSubscriptionInfo.description ?? 'Description',
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
    Effect.runPromise,
  )
})

export default app
