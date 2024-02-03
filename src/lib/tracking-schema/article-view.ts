import { z } from 'zod'

export const articleView = defineTrackEvent({
  event: 'article_view',
  properties: {
    pathname: z.string(),
    isCustomTriggered: z.boolean(),
    clientId: z.string(),
    articleId: z.string().nullable(),
  },
})
