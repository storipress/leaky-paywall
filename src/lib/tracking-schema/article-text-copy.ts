import { z } from 'zod'

export const articleTextCopy = defineTrackEvent({
  event: 'article.text.copied',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
    text_copy: z.string(),
  },
})
