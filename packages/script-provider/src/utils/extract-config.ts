import type { DocumentType } from 'storipress-client/gql'
import type { SiteSubscriptionInfo } from 'storipress-client'
import type { Config } from 'shared/schema'
import { Effect, pipe } from 'effect'
import { destr } from 'destr'
import type { PaywallConfig } from '../schema/paywall-config'
import { paywallConfig } from '../schema/paywall-config'

type RawAPIInput = DocumentType<typeof SiteSubscriptionInfo>

const DEFAULT_VALUES: Config = {
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
}

export function fromAPIFormat(clientId: string, apiValues: RawAPIInput): Effect.Effect<Config> {
  return pipe(
    Effect.sync(() => destr(apiValues.siteSubscriptionInfo.paywall_config)),
    Effect.flatMap((maybePaywallConfig) => extractPaywallConfigFromAPI(maybePaywallConfig)),
    Effect.map((values) => ({ ...DEFAULT_VALUES, ...values, title: apiValues.siteSubscriptionInfo.name, clientId })),
  )
}

function extractPaywallConfigFromAPI(maybePaywallConfig: unknown): Effect.Effect<Partial<Config>> {
  return pipe(
    Effect.try(() => paywallConfig.parse(maybePaywallConfig)),
    Effect.map((values): Partial<Config> => {
      return {
        description: values.hit_limit_cta,
        primaryColor: values.brand_color,
        freeLimit: {
          interval: values.free_limit.interval,
          quota: values.free_limit.quota,
        },
        logo: values.logo,
        dismissible: values.dismissible,
      }
    }),
    Effect.catchAll(() => Effect.succeed({})),
  )
}
