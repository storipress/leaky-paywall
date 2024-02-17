import { z } from 'zod'

export const articleScrollDepth = defineTrackEvent({
  event: 'article.scroll_depth',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
    percentage: z.number(),
  },
})
