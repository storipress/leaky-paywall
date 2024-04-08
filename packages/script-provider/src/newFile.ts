import { cors } from 'hono/cors'
import * as Tracer from '@effect/opentelemetry/Tracer'
import * as Resource from '@effect/opentelemetry/Resource'
import { Effect, SynchronizedRef, pipe } from 'effect'
import esbuild from 'esbuild-wasm'
import { SiteSubscriptionInfo } from 'storipress-client'
import wasm from '../../../node_modules/esbuild-wasm/esbuild.wasm'
import { GraphqlService } from './services/GraphqlService'
import { app, initializedRef, javascript, CONFIG_VAR_NAME, PRODUCTION_URL } from '.'

app.get(
  '/:clientId/prophet.js',

  cors({
    origin: '*',
    allowHeaders: ['Upgrade-Insecure-Requests'],
    allowMethods: ['HEAD', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 3600,
    credentials: true,
  }),

  (c) => {
    const clientId = c.req.param('clientId')

    return pipe(
      SynchronizedRef.updateEffect(initializedRef, (initialized) =>
        pipe(
          initialized
            ? Effect.unit
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
      Effect.catchAllDefect((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
        return Effect.die(error)
      }),
      Effect.runPromise,
    )
  },
)
