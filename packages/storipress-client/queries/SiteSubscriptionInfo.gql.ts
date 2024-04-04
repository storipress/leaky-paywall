import { graphql } from '../gql'

export const SiteSubscriptionInfo = graphql(`
  query SiteSubscriptionInfo {
    siteSubscriptionInfo {
      name
      description
      logo {
        url
      }
    }
  }
`)
