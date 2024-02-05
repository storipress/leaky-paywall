import { useMutation } from '@urql/vue'

export type AuthAPI = ReturnType<typeof useAuth>

export function useAuth() {
  const paywallStore = useStore($paywall)
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

  const onLogin = async ({ email }: { email: string }) => {
    try {
      const result = await requestSignInSubscriberMutate({
        email,
        referer: document.referrer || location.origin,
        from: location.href,
      })
      return result.data?.requestSignInSubscriber
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
    return false
  }
  const onSignup = async (email: string) => {
    try {
      const result = await signUpSubscriberMutate({
        email,
        referer: document.referrer || location.origin,
        from: location.href,
      })
      if (result.data?.signUpSubscriber) {
        $paywall.setKey('token', result.data.signUpSubscriber)
        return result
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
    return false
  }
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
    onLogin,
    onSignup,
    onSignOut,
    onVerifyEmail,
    onSignInSubscriber,
  }
}
