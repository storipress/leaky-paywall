import { expect, it } from 'vitest'
import type { Config } from 'shared/schema'
import { Effect, pipe } from 'effect'
import type { PaywallConfig } from '../../schema/paywall-config'
import { GraphqlService } from '../../services/GraphqlService'
import { getPaywallConfig } from '../get-paywall-config'

it('can response config json', async () => {
  const res = await pipe(
    getPaywallConfig('client_id'),
    Effect.provideService(
      GraphqlService,
      GraphqlService.of({
        query: () =>
          Effect.succeed({
            hasNext: false,
            operation: {} as any,
            stale: {} as any,
            data: {
              siteSubscriptionInfo: {
                name: 'Site Name',
                paywall_config: JSON.stringify({
                  brand_color: '#ff0000',
                  dismissible: true,
                  free_limit: {
                    interval: 7,
                    quota: 7,
                  },
                  paywall_trigger: {
                    type: 'viewport',
                    offset: 0.45,
                  },
                  hit_limit_title: '',
                  hit_limit_cta: 'Hit limit cta',
                  logo: 'https://example.com/logo.png',
                } satisfies PaywallConfig),
              },
            } as any,
          }),
      }),
    ),
    Effect.runPromise,
  )

  expect(res).toEqual({
    flags: {
      paywall: true,
      tracking: true,
    },
    all: false,
    clientId: 'client_id',
    title: 'Site Name',
    primaryColor: '#ff0000',
    dismissible: true,
    pathPattern: null,
    freeLimit: {
      interval: 7,
      quota: 7,
    },
    paywallTrigger: {
      type: 'viewport',
      value: 0.45,
    },
    description: 'Hit limit cta',
    logo: 'https://example.com/logo.png',
  } satisfies Config)
})

it('can response config json without new config', async () => {
  const res = await pipe(
    getPaywallConfig('client_id'),
    Effect.provideService(
      GraphqlService,
      GraphqlService.of({
        query: () =>
          Effect.succeed({
            hasNext: false,
            operation: {} as any,
            stale: {} as any,
            data: {
              siteSubscriptionInfo: {
                name: 'Site Name',
                paywall_config: JSON.stringify({
                  brand_color: '#ff0000',
                  dismissible: true,
                  free_limit: {
                    interval: 7,
                    quota: 7,
                  },
                  hit_limit_cta: 'Hit limit cta',
                  logo: 'https://example.com/logo.png',
                } as unknown as PaywallConfig),
              },
            } as any,
          }),
      }),
    ),
    Effect.runPromise,
  )

  expect(res).toEqual({
    flags: {
      paywall: true,
      tracking: true,
    },
    all: false,
    clientId: 'client_id',
    title: 'Site Name',
    primaryColor: '#ff0000',
    dismissible: true,
    pathPattern: null,
    freeLimit: {
      interval: 7,
      quota: 7,
    },
    paywallTrigger: {
      type: 'viewport',
      value: 0.45,
    },
    description: 'Hit limit cta',
    logo: 'https://example.com/logo.png',
  } satisfies Config)
})

it('can use title config', async () => {
  const res = await pipe(
    getPaywallConfig('client_id'),
    Effect.provideService(
      GraphqlService,
      GraphqlService.of({
        query: () =>
          Effect.succeed({
            hasNext: false,
            operation: {} as any,
            stale: {} as any,
            data: {
              siteSubscriptionInfo: {
                name: 'Site Name',
                paywall_config: JSON.stringify({
                  brand_color: '#ff0000',
                  dismissible: true,
                  free_limit: {
                    interval: 7,
                    quota: 7,
                  },
                  hit_limit_cta: 'Hit limit cta',
                  hit_limit_title: 'Custom Title',
                  logo: 'https://example.com/logo.png',
                } as unknown as PaywallConfig),
              },
            } as any,
          }),
      }),
    ),
    Effect.runPromise,
  )

  expect(res).toEqual({
    flags: {
      paywall: true,
      tracking: true,
    },
    all: false,
    clientId: 'client_id',
    title: 'Custom Title',
    primaryColor: '#ff0000',
    dismissible: true,
    pathPattern: null,
    freeLimit: {
      interval: 7,
      quota: 7,
    },
    paywallTrigger: {
      type: 'viewport',
      value: 0.45,
    },
    description: 'Hit limit cta',
    logo: 'https://example.com/logo.png',
  } satisfies Config)
})
