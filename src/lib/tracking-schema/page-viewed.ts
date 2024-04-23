import { z } from 'zod'

export const pageViewed = defineTrackEvent({
  event: 'page.viewed',
  properties: {
    pathname: z.string(),
  },
})
