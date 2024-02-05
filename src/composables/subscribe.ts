import type { GraphQLError } from 'graphql-web-lite'
import { CombinedError } from '@urql/vue'

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
  // Sign in require to check the email
  token?: string
}

interface FailSubscribeReturn {
  ok: false
  isBadRequest: boolean
  error: CombinedError
}

type SubscribeReturn = SuccessSubscribeReturn | FailSubscribeReturn

export function useSubscribe(mode: Ref<'subscribe' | 'login'>) {
  const { executeMutation: requestSignInSubscriberMutate } = useMutation(
    graphql(`
      mutation RequestSignInSubscriber($email: EmailString!, $referer: String!, $from: String!) {
        requestSignInSubscriber(input: { email: $email, referer: $referer, from: $from })
      }
    `),
  )

  const { executeMutation: signUpSubscriberMutate } = useMutation(
    graphql(`
      mutation SignUpSubscriber($email: EmailString!, $referer: String!, $from: String!) {
        signUpSubscriber(input: { email: $email, referer: $referer, from: $from })
      }
    `),
  )

  function collectReferer() {
    return {
      referer: document.referrer || location.origin,
      from: location.href,
    }
  }

  async function doLogin(input: SubscribeInput): Promise<SubscribeReturn> {
    const res = await requestSignInSubscriberMutate({
      email: input.email,
      ...collectReferer(),
    })

    if (res.error) {
      return {
        ok: false,
        isBadRequest: isBadRequest(res.error.graphQLErrors?.[0]),
        error: res.error,
      }
    }

    return {
      ok: true,
    }
  }

  async function doSignup(input: SubscribeInput): Promise<SubscribeReturn> {
    const res = await signUpSubscriberMutate({
      email: input.email,
      ...collectReferer(),
    })

    if (res.error) {
      return {
        ok: false,
        isBadRequest: isBadRequest(res.error.graphQLErrors?.[0]),
        error: res.error,
      }
    }

    return {
      ok: true,
      token: res.data?.signUpSubscriber,
    }
  }

  return {
    async subscribe(input: SubscribeInput): Promise<SubscribeReturn> {
      const actions = mode.value === 'login' ? [doLogin, doSignup] : [doSignup, doLogin]
      for (const action of actions) {
        const result = await action(input)
        if (!result.ok && !result.isBadRequest) {
          return result
        }
        if (result.ok) {
          return result
        }
      }
      return {
        ok: false,
        isBadRequest: false,
        error: new CombinedError({
          networkError: new Error('Unknown error'),
        }),
      }
    },
  }
}
