import { graphql } from '../gql'

export const TrackSubscriberActivity = graphql(`
  mutation TrackSubscriberActivity($input: TrackSubscriberActivityInput!) {
    trackSubscriberActivity(input: $input)
  }
`)
