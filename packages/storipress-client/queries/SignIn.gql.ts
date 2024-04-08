import { graphql } from '../gql'

export const SignInPaywall = graphql(`
  mutation SignInPaywall($email: EmailString!) {
    signInLeakySubscriber(input: { email: $email })
  }
`)
