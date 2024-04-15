import { Effect, pipe } from 'effect'
import invariant from 'tiny-invariant'
import { SiteSubscriptionInfo } from 'storipress-client'
import { GraphqlService } from '../services/GraphqlService'
import { fromAPIFormat } from './extract-config'

export function getPaywallConfig(clientId: string) {
  return pipe(
    GraphqlService,
    Effect.flatMap(({ query }) => query(SiteSubscriptionInfo, {})),
    Effect.flatMap((res) => {
      invariant(res.data, 'no data')
      return fromAPIFormat(clientId, res.data)
    }),
  )
}
