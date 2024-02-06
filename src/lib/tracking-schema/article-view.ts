import { z } from 'zod'

export const articleView = defineTrackEvent({
  event: 'article_view',
  properties: {
    pathname: z.string(),
    clientId: z.string(),
    articleId: z.string().nullable(),
  },
})
