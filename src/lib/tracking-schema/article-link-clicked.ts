import { z } from 'zod'

export const articleLinkClicked = defineTrackEvent({
  event: 'article_link_clicked',
  properties: {
    pathname: z.string(),
    clientId: z.string(),
    articleId: z.string().nullable(),
    href: z.string(),
  },
})
