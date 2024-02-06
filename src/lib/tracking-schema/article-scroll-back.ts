import { z } from 'zod'

export const articleScrollBack = defineTrackEvent({
  event: 'article_scroll_back',
  properties: {
    pathname: z.string(),
    clientId: z.string(),
    articleId: z.string().nullable(),
  },
})
