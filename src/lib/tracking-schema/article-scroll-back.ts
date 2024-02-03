import { z } from 'zod'

export const articleScrollBack = defineTrackEvent({
  event: 'article_scroll_back',
  properties: {
    clientId: z.string(),
    articleId: z.string().nullable(),
  },
})
