import { type ClientOptions, cacheExchange, fetchExchange } from '@urql/vue'

export function createClientOptions(clientId: string): ClientOptions {
  return {
    url: `https://api.storipress.dev/client/${clientId}/graphql`,
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
