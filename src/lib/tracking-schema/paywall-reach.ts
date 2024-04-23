import { z } from 'zod'

export const paywallReached = defineTrackEvent({
  event: 'paywall.reached',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
  },
})
