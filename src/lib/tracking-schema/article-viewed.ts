import { z } from 'zod'

export const articleViewed = defineTrackEvent({
  event: 'article.viewed',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
  },
})
