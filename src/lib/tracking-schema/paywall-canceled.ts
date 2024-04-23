import { z } from 'zod'

export const paywallCanceled = defineTrackEvent({
  event: 'paywall.canceled',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
    type: z.enum(['scroll_back', 'dismissed']),
  },
})
