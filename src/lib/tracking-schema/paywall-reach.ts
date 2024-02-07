import { z } from 'zod'

export const paywallReached = defineTrackEvent({
  event: 'paywall.reach',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
  },
})
