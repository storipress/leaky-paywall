import { Hono } from 'hono'
import type { ResolveConfigFn } from '@microlabs/otel-cf-workers'
import { instrument } from '@microlabs/otel-cf-workers'
import { cors } from 'hono/cors'
import * as Tracer from '@effect/opentelemetry/Tracer'
import * as Resource from '@effect/opentelemetry/Resource'
import { secureHeaders } from 'hono/secure-headers'
import { etag } from 'hono/etag'
import { Effect, Logger, pipe } from 'effect'
import { trace } from '@opentelemetry/api'
import { GraphqlService } from './services/GraphqlService'
import { getPaywallConfig } from './utils/get-paywall-config'
import { generateScript } from './utils/generate-script'

// @ts-expect-error polyfill
globalThis.performance = Date

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
    const activeSpan = trace.getActiveSpan()

    return pipe(
      generateScript(c, clientId),
      Effect.withSpan('generateScript', {
        attributes: {
          clientId,
        },
        parent:
          activeSpan &&
          Tracer.makeExternalSpan({
            spanId: activeSpan.spanContext().spanId,
            traceId: activeSpan.spanContext().traceId,
          }),
      }),
      Effect.provide(Tracer.layerGlobal),
      Effect.provide(
        Resource.layer({
          serviceName: 'prophet_worker',
          serviceVersion: '1.0.0',
          attributes: {},
        }),
      ),
      Effect.provide(Logger.add(Logger.tracerLogger)),
      Effect.catchAllDefect((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
        return Effect.die(error)
      }),
      Effect.runPromise,
    )
  },
)

app.get('/:clientId/_prophet-config', (c) => {
  const clientId = c.req.param('clientId')

  return pipe(
    getPaywallConfig(clientId),
    Effect.map((config) => {
      return c.json(config)
    }),
    Effect.provide(GraphqlService.layer(clientId)),
    Effect.catchTag('NotFoundError', () => Effect.succeed(c.text('Not Found', 404))),
    Effect.catchAll((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      return Effect.succeed(c.text('Internal Server Error', 500))
    }),
    Effect.provide(Tracer.layerGlobal),
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
