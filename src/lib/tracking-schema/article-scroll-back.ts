import { z } from 'zod'

export const articleScrollBack = defineTrackEvent({
  event: 'paywall.canceled',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
  },
})
