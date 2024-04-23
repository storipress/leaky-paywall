import { Context, Effect, Inspectable, Layer, pipe } from 'effect'
import type { AnyVariables, CombinedError, OperationResult, TypedDocumentNode } from '@urql/core'
import { Client, cacheExchange, fetchExchange } from '@urql/core'
import { joinURL } from 'ufo'
import { createClient } from '../utils/rest-client'
import { getApiHostUrl, getEnvironmentFromClientId } from '../utils/api-host-url'
import { GraphqlError, NotFoundError } from '../utils/errors'

interface GraphqlServiceImpl {
  query: <Data, Variables extends AnyVariables>(
    document: TypedDocumentNode<Data, Variables>,
    variables: Variables,
  ) => Effect.Effect<OperationResult<Data, Variables>, GraphqlError>
}

export class GraphqlService extends Context.Tag('@app/GraphqlService')<GraphqlService, GraphqlServiceImpl>() {
  static layer = (clientId: string): Layer.Layer<GraphqlService, NotFoundError> => {
    const env = getEnvironmentFromClientId(clientId)
    const restClient = createClient(env)

    return Layer.effect(
      this,
      pipe(
        Effect.promise(() => restClient.getTenantState({ params: { clientId } })),
        Effect.tap((res) => Effect.log(`check ${clientId} state: ${Inspectable.format(res.body)}`)),
        Effect.filterOrFail(
          (res) => res.status === 200 && res.body.state === 'online',
          () => new NotFoundError(),
        ),
        Effect.map(() => {
          const client = new Client({
            url: joinURL(getApiHostUrl(env), `/client/${clientId}/graphql`),
            exchanges: [cacheExchange, fetchExchange],
          })

          return GraphqlService.of({
            query: (document, variables) => {
              return pipe(
                Effect.promise(() => client.query(document, variables)),
                Effect.filterOrFail(
                  (res) => res.error === undefined,
                  (res) => new GraphqlError({ cause: res.error as CombinedError }),
                ),
              )
            },
          })
        }),
      ),
    )
  }
}
