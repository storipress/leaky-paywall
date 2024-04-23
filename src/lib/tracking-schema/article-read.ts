import { z } from 'zod'

export const articleRead = defineTrackEvent({
  event: 'article.read',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
    percentage: z.number(),
  },
})
