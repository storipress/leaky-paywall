import { z } from 'zod'

export const paywallDisplay = defineTrackEvent({
  event: 'paywall.display',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
  },
})
