import type { GraphQLError } from 'graphql-web-lite'
import { CombinedError } from '@urql/vue'
import { SignInPaywall } from 'storipress-client'

const BAD_REQUEST_MESSAGE = 'Bad Request.'

function isBadRequest(error?: GraphQLError) {
  if (!error?.message) {
    return false
  }
  return error.message === BAD_REQUEST_MESSAGE
}

interface SubscribeInput {
  email: string
}

interface SuccessSubscribeReturn {
  ok: true
  token?: string
}

interface FailSubscribeReturn {
  ok: false
  isBadRequest: boolean
  error: CombinedError
}

type SubscribeReturn = SuccessSubscribeReturn | FailSubscribeReturn

export function useSubscribe() {
  const { executeMutation: signInPaywall } = useMutation(SignInPaywall)

  async function doLogin(input: SubscribeInput): Promise<SubscribeReturn> {
    const res = await signInPaywall({
      email: input.email,
    })

    if (res.error || !res.data?.signInLeakySubscriber) {
      return {
        ok: false,
        isBadRequest: isBadRequest(res.error?.graphQLErrors?.[0]),
        error: res.error ?? createUnknownError(),
      }
    }

    return {
      ok: true,
      token: res.data.signInLeakySubscriber,
    }
  }

  return {
    async subscribe(input: SubscribeInput): Promise<SubscribeReturn> {
      return doLogin(input)
    },
  }
}

function createUnknownError() {
  return new CombinedError({
    networkError: new Error('Unknown error'),
  })
}
