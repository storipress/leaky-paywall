import { z } from 'zod'

export const articleScrollBack = defineTrackEvent({
  event: 'article.scroll_back',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
  },
})
