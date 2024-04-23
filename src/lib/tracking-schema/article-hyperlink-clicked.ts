import { z } from 'zod'

export const articleHyperlinkClicked = defineTrackEvent({
  event: 'article.hyperlink.clicked',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string(),
    href: z.string(),
  },
})
