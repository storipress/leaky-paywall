import { z } from 'zod'

export const articleTextSelection = defineTrackEvent({
  event: 'article.text.selected',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string().nullable(),
    text_selection: z.string(),
  },
})
