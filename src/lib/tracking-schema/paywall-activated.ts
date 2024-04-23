import { z } from 'zod'

export const paywallActivated = defineTrackEvent({
  event: 'paywall.activated',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
  },
})
