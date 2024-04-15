import { graphql } from '../gql'

export const SiteSubscriptionInfo = graphql(`
  query SiteSubscriptionInfo {
    siteSubscriptionInfo {
      name
      description
      paywall_config
      logo {
        url
      }
    }
  }
`)
