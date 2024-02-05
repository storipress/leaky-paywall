import { type ClientOptions, cacheExchange, fetchExchange } from '@urql/vue'

export function createClientOptions(clientId: string): ClientOptions {
  return {
    url: `https://api.storipress.dev/client/${clientId}/graphql`,
    exchanges: [cacheExchange, fetchExchange],
  }
}
