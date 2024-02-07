import { z } from 'zod'

export const articleLinkClicked = defineTrackEvent({
  event: 'article.link_click',
  properties: {
    pathname: z.string(),
    client_id: z.string(),
    article_id: z.string(),
    href: z.string(),
  },
})
