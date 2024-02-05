export type AuthAPI = ReturnType<typeof useAuth>

export function useAuth() {
  const paywallStore = useStore($paywall)
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
    onVerifyEmail,
    onSignInSubscriber,
  }
}
