import { CombinedError, useMutation } from '@urql/vue'
import type { GraphQLError } from 'graphql-web-lite'

export type AuthAPI = ReturnType<typeof useAuth>

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

export function useAuth() {
  const paywallStore = useStore($paywall)
  const { executeMutation: signOutSubscriberMutate } = useMutation(
    graphql(`
      mutation SignOutSubscriber {
        signOutSubscriber
      }
    `),
  )
  const { executeMutation: verifySubscriberEmailMutate } = useMutation(
    graphql(`
      mutation VerifySubscriberEmail($token: String!) {
        verifySubscriberEmail(token: $token)
      }
    `),
  )
  const { executeMutation: signInSubscriberMutate } = useMutation(
    graphql(`
      mutation SignInSubscriber($token: String!) {
        signInSubscriber(token: $token)
      }
    `),
  )

  const onSignOut = async () => {
    try {
      const result = await signOutSubscriberMutate({})
      if (result.data?.signOutSubscriber) {
        $paywall.setKey('token', '')
      }
      return result.data?.signOutSubscriber
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
    return false
  }
  const onVerifyEmail = async (token: string) => {
    try {
      const result = await verifySubscriberEmailMutate({ token })
      if (result.data?.verifySubscriberEmail) {
        return true
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
    return false
  }
  const onSignInSubscriber = async (token: string) => {
    try {
      const result = await signInSubscriberMutate({ token })
      if (result.data?.signInSubscriber) {
        $paywall.setKey('token', result.data.signInSubscriber)
        return true
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
    return false
  }

  const isAuth = computed(() => Boolean(paywallStore.value.token))

  return {
    isAuth,
    onSignOut,
    onVerifyEmail,
    onSignInSubscriber,
  }
}
