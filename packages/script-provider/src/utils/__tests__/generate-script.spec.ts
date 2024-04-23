import { HttpResponse, graphql, http } from 'msw'
import { setupServer } from 'msw/node'
import { SiteSubscriptionInfo } from 'storipress-client'
import { afterAll, beforeAll, expect, it, vi } from 'vitest'
import { Hono } from 'hono'
import { Effect, Logger, pipe } from 'effect'
import { generateScript } from '../generate-script'

vi.mock('esbuild-wasm', () => ({
  default: {
    transform: (x: unknown) => Promise.resolve(x),
  },
}))

vi.mock('../esbuild-init', async () => {
  const effect = await vi.importActual<{ Effect: typeof Effect }>('effect')
  return {
    initEsbuild: effect.Effect.void,
  }
})

const server = setupServer(
  http.get('https://api.storipress.dev/client/client_id/rest/v1/publication/state', () => {
    return HttpResponse.json({ state: 'online' })
  }),
  graphql.query(SiteSubscriptionInfo, () => {
    return HttpResponse.json({
      data: {
        siteSubscriptionInfo: {
          name: 'Test',
          description: 'Test description',
          logo: null,
          paywall_config: JSON.stringify({
            flags: {
              paywall: true,
              tracking: true,
            },
            freeLimit: {
              interval: 7,
              quota: 1,
            },
            pathPattern: null,
            all: false,
            clientId: '',
            logo: '',
            title: '',
            description: '',
            primaryColor: 'rgb(29 78 216)',
            dismissible: false,
          }),
        },
      },
    })
  }),
)

beforeAll(() => {
  server.listen()
})

afterAll(() => server.close())

it('can generate script', async () => {
  const app = new Hono().get('/', async (c) => {
    return pipe(
      generateScript(c, 'client_id'),
      Effect.provide(Logger.replace(Logger.defaultLogger, Logger.none)),
      Effect.runPromise,
    )
  })

  const res = await app.request('/')

  expect(res.status).toBe(200)
  await expect(res.text()).resolves.toMatchSnapshot()
})
