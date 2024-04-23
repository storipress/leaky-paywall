import { type ClientOptions, cacheExchange, fetchExchange } from '@urql/vue'
import { getApiHostUrl, getEnvironmentFromClientId } from './api-host-url'

export function createClientOptions(clientId: string): ClientOptions {
  return {
    url: `${getApiHostUrl(getEnvironmentFromClientId(clientId))}/client/${clientId}/graphql`,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => {
      const paywall = $paywall.get()

      if (!paywall.token) return {}

      return {
        headers: {
          Authorization: `Bearer ${paywall.token}`,
        },
      }
    },
  }
}
